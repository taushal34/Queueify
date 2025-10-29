const express = require("express");
const router = express.Router();
const { deleteUserAndCategories } = require("../controllers/userController"); // CHANGE THIS LINE
const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Admin only - Delete user and their categories
router.delete("/delete-user/:userId", auth, adminAuth, deleteUserAndCategories);

module.exports = router;