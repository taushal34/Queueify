require('dotenv').config();
const mongoose = require("mongoose");
const { getQueueForSubcategory, queues } = require("../queue/queueFactory");
const RequestModel = require("../models/Request");
const Subcategory = require("../models/Subcategory");

// connect DB
const connectDB = require("../config/db");
connectDB();

// generic processor: we will attach a processor for new queues as they are created.
// Option A: periodically scan subcategories and attach processors for each existing subcat

async function startWorkers() {
  const subcats = await Subcategory.find().lean();
  subcats.forEach(sub => attachProcessor(sub._id.toString()));
  // also poll for new subcategories periodically (optional)
  setInterval(async () => {
    const fresh = await Subcategory.find().lean();
    fresh.forEach(s => attachProcessor(s._id.toString()));
  }, 30 * 1000);
}

function attachProcessor(subcatId) {
  const q = getQueueForSubcategory(subcatId);
  // avoid multiple bindings
  if (q._processorAttached) return;
  q._processorAttached = true;

  q.process(async (job) => {
    const { requestId } = job.data;
    console.log(`Processing ${requestId} from subcat ${subcatId}`);

    const reqDoc = await RequestModel.findByIdAndUpdate(requestId, { status: "active", startedAt: new Date() }, { new: true });
    if (!reqDoc) {
      console.log("Request not found:", requestId);
      return Promise.resolve();
    }

    // TODO: real session logic (10 min session) -> schedule end
    // For demo use simulated processing time (e.g., 10s)
    await new Promise(r => setTimeout(r, 10000)); // simulate 10s session

    reqDoc.status = "completed";
    reqDoc.endedAt = new Date();
    await reqDoc.save();
    console.log(`Completed ${requestId}`);
    return Promise.resolve();
  });
}

startWorkers().catch(err => console.error(err));
