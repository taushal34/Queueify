const Subcategory = require("../models/Subcategory");
const RequestModel = require("../models/Request");
const { getQueueForSubcategory } = require("../queue/queueFactory");

exports.registerForSubcategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subcatId = req.params.subcatId;
    const subcat = await Subcategory.findById(subcatId);
    if (!subcat) return res.status(404).json({ message: "Subcategory not found" });

    // Check if user already registered for this subcategory
    const existing = await RequestModel.findOne({ user: userId, subcategory: subcat._id });
    if (existing) {
      return res.status(400).json({ message: "Already registered", position: existing.queuePosition });
    }

    // create request doc in DB
    const reqDoc = await RequestModel.create({
      user: userId,
      subcategory: subcat._id,
      status: "waiting"
    });

    // Find current count of requests for this subcategory
    const currentCount = await RequestModel.countDocuments({ subcategory: subcat._id });

    // Assign position as currentCount
    reqDoc.queuePosition = currentCount;
    await reqDoc.save();

    // get queue for this subcategory and add job
    const q = getQueueForSubcategory(subcat._id.toString());
    await q.add({ requestId: reqDoc._id.toString(), subcategoryId: subcat._id.toString() }, { removeOnComplete: true });

    return res.status(201).json({ message: "Registered", requestId: reqDoc._id, position: reqDoc.queuePosition });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const reqDoc = await RequestModel.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });

    const subcatId = reqDoc.subcategory;
    const deletedPosition = reqDoc.queuePosition;

    // Delete the request
    await reqDoc.deleteOne();

    // Update queuePosition for all requests after the deleted one
    await RequestModel.updateMany(
      { subcategory: subcatId, queuePosition: { $gt: deletedPosition } },
      { $inc: { queuePosition: -1 } }
    );

    return res.json({ message: "Request deleted and queue updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


exports.getUserQueuePosition = async (req, res) => {
  try {
    const userId = req.user.id;
    const subcatId = req.params.subcatId;

    const request = await RequestModel.findOne({ user: userId, subcategory: subcatId });
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ position: request.queuePosition, status: request.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};