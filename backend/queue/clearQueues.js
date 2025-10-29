const { getQueueForSubcategory } = require("./queueFactory");
const Subcategory = require("../models/Subcategory");
const connectDB = require("../config/db");

// Connect to the database
connectDB().then(async () => {
    console.log("✅ MongoDB Connected");

    async function clearQueues() {
        const subcategories = await Subcategory.find().lean();
        for (const sub of subcategories) {
            const queue = getQueueForSubcategory(sub._id.toString());
            await queue.empty(); // Clear all jobs in the queue
            console.log(`Cleared queue for subcategory: ${sub._id}`);
        }
        process.exit();
    }

    clearQueues();
}).catch(err => {
    console.error("❌ MongoDB connection failed", err.message);
});