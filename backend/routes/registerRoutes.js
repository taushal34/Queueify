const express = require("express");
const router = express.Router();
const { registerForSubcategory,deleteRequest,getUserQueuePosition } = require("../controllers/registerController");
const auth = require("../middleware/authMiddleware");

// User must be logged in to register
router.post("/:subcatId", auth, registerForSubcategory, deleteRequest);

router.delete("/:requestId", auth, deleteRequest);

router.get("/:subcatId/position", auth, getUserQueuePosition);
module.exports = router;


