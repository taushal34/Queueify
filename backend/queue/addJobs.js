require("dotenv").config();
const { getQueueForSubcategory } = require("./queue/queueFactory");

const addJobsToQueue = async () => {
    const subcatId = "68e4a9eaa56b7e5b2e6eb1a9"; // Replace with a valid subcategory ID
    const queue = getQueueForSubcategory(subcatId);

    const jobData = {
        requestIds: ["68e6333963e82133310d26f1", "68e6334563e82133310d26f2"], // Replace with valid request IDs
    };

    await queue.add(jobData);
    console.log(`Job added to queue for subcategory: ${subcatId}`);
};

addJobsToQueue().catch(err => console.error(err));