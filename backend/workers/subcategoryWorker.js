require("dotenv").config();
const mongoose = require("mongoose");
const { getQueueForSubcategory } = require("../queue/queueFactory");
const RequestModel = require("../models/Request");
const Subcategory = require("../models/Subcategory");

// Connect to the database
const connectDB = require("../config/db");
connectDB();

// Start workers for all subcategories
async function startWorkers() {
    const subcategories = await Subcategory.find().lean();
    subcategories.forEach(sub => attachProcessor(sub._id.toString()));

    // Optional: Poll for new subcategories periodically
    setInterval(async () => {
        const freshSubcategories = await Subcategory.find().lean();
        freshSubcategories.forEach(sub => attachProcessor(sub._id.toString()));
    }, 30 * 1000); // Poll every 30 seconds
}

// Attach a processor to handle jobs for a specific subcategory
function attachProcessor(subcatId) {
    const queue = getQueueForSubcategory(subcatId);

    // Avoid multiple bindings
    if (queue._processorAttached) return;
    queue._processorAttached = true;

    queue.process(async (job) => {
        console.log(`Worker started for subcategory: ${subcatId}`);
        console.log(`Processing job: ${job.id}`);
        console.log("Job data:", job.data);

        // Single requestId handle karo
        const requestId = job.data.requestId;
        if (!requestId) {
            console.log("No requestId found in job data.");
            return Promise.resolve();
        }

        // Fetch request from the database
        const request = await RequestModel.findOne({ _id: requestId, status: "waiting" }).populate("user");
        if (!request) {
            console.log("No valid request found for processing.");
            return Promise.resolve();
        }

        const sessionStart = new Date();
        console.log(`Session started at: ${sessionStart.toLocaleString()} for request ${requestId}`);

        // Update request to "active"
        try {
            request.status = "active";
            request.startedAt = sessionStart;
            await request.save();
            const updated = await RequestModel.findById(requestId);
            console.log("DB status after save (active):", updated.status);
        } catch (err) {
            console.error("Error saving request (active):", err);
        }

        // Simulate session duration (30 seconds for demo)
        const sessionDuration = 30 * 1000; // 30 seconds
        await new Promise(resolve => setTimeout(resolve, sessionDuration));

        const sessionEnd = new Date();
        console.log(`Session ended at: ${sessionEnd.toLocaleString()} for request ${requestId}`);
        console.log(`Session duration: ${(sessionEnd - sessionStart) / 1000} seconds`);

        // Update request to "completed"
        try {
            request.status = "completed";
            request.endedAt = sessionEnd;
            await request.save();
            const updated2 = await RequestModel.findById(requestId);
            console.log("DB status after save (completed):", updated2.status);
        } catch (err) {
            console.error("Error saving request (completed):", err);
        }

        return Promise.resolve();
    });
}

// Start the workers
startWorkers().catch(err => console.error(err));