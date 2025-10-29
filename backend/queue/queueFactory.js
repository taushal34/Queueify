const Queue = require("bull");

const getQueueForSubcategory = (subcatId) => {
    console.log(`Initializing queue for subcategory: ${subcatId}`);
    return new Queue(subcatId, {
        redis: {
            host: "127.0.0.1", // Redis host
            port: 6379,        // Redis port
        },
    });
};

module.exports = { getQueueForSubcategory };