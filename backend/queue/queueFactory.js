const Queue = require("bull");

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379
  }
};

// cache to reuse Queue instances
const queues = new Map();

/**
 * getQueueForSubcategory(subcatId)
 * returns a Bull queue instance for that subcategory
 */
function getQueueForSubcategory(subcatId) {
  const name = `queue:subcategory:${subcatId}`;
  if (queues.has(name)) return queues.get(name);

  const q = new Queue(name, redisConfig);
  queues.set(name, q);
  return q;
}

module.exports = { getQueueForSubcategory, queues };
