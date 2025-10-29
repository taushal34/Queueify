const express = require("express");
const router = express.Router();
const { registerForSubcategory, getUserQueuePosition } = require("../controllers/registerController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:subcatId", authMiddleware, registerForSubcategory);

// NEW: Get user's queue position and status
router.get("/queue-position/:subcatId", authMiddleware, getUserQueuePosition);

module.exports = router;