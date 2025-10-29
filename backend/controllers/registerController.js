const Subcategory = require("../models/Subcategory");
const RequestModel = require("../models/Request");

exports.registerForSubcategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const subcatId = req.params.subcatId;
        const subcat = await Subcategory.findById(subcatId);
        if (!subcat) return res.status(404).json({ message: "Subcategory not found" });

        // Check if user already registered for ANY subcategory and not completed
        const existingAny = await RequestModel.findOne({
            user: userId,
            status: { $in: ["waiting", "active"] }
        });
        if (existingAny) {
            return res.status(400).json({ message: "Please complete your current queue session before registering for another." });
        }

        // Check if user already registered for this subcategory
        const existing = await RequestModel.findOne({ user: userId, subcategory: subcat._id });
        if (existing) {
            return res.status(400).json({ message: "Already registered", position: existing.queuePosition });
        }

        // Calculate queue position
        const currentCount = await RequestModel.countDocuments({ subcategory: subcat._id });
        const queuePosition = currentCount + 1;

        const reqDoc = await RequestModel.create({
            user: userId,
            subcategory: subcat._id,
            status: "waiting",
            queuePosition,
        });

        // 1 min pachi status "active"
        setTimeout(async () => {
            try {
                reqDoc.status = "active";
                await reqDoc.save();
                // 1 min pachi status "completed"
                setTimeout(async () => {
                    reqDoc.status = "completed";
                    await reqDoc.save();
                }, 60 * 1000); // 1 min
            } catch (err) {
                console.error("Error updating status:", err);
            }
        }, 60 * 1000); // 1 min

        return res.status(201).json({ message: "Registered", requestId: reqDoc._id, position: reqDoc.queuePosition });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
// Get user's queue position and status
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
// const Subcategory = require("../models/Subcategory");
// const RequestModel = require("../models/Request");
// const { getQueueForSubcategory } = require("../queue/queueFactory");

// exports.registerForSubcategory = async (req, res) => {
//     try {
//         const userId = req.user?.id;
//         if (!userId) return res.status(401).json({ message: "Unauthorized" });

//         const subcatId = req.params.subcatId;
//         const subcat = await Subcategory.findById(subcatId);
//         if (!subcat) return res.status(404).json({ message: "Subcategory not found" });

//         // Check if user already registered for this subcategory
//         const existing = await RequestModel.findOne({ user: userId, subcategory: subcat._id });
//         if (existing) {
//             return res.status(400).json({ message: "Already registered", position: existing.queuePosition });
//         }

//         // Calculate queue position
//         const currentCount = await RequestModel.countDocuments({ subcategory: subcat._id });
//         const queuePosition = currentCount + 1;

//         const reqDoc = await RequestModel.create({
//             user: userId,
//             subcategory: subcat._id,
//             status: "waiting",
//             queuePosition,
//         });

//         const q = getQueueForSubcategory(subcat._id.toString());
//         await q.add({ requestId: reqDoc._id.toString(), subcategoryId: subcat._id.toString() }, { removeOnComplete: true });

//         return res.status(201).json({ message: "Registered", requestId: reqDoc._id, position: reqDoc.queuePosition });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };

// // NEW: Get user's queue position and status
// exports.getUserQueuePosition = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const subcatId = req.params.subcatId;

//         const request = await RequestModel.findOne({ user: userId, subcategory: subcatId });
//         if (!request) return res.status(404).json({ message: "Request not found" });

//         res.json({ position: request.queuePosition, status: request.status });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };