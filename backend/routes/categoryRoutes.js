const express = require("express");
const router = express.Router();
const { createCategory, createSubcategory, getCategories } = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware"); // USE authMiddleware.js
const adminAuth = require("../middleware/adminAuth");

// Public - anyone can see categories
router.get("/", getCategories);

// Admin only - Create category
router.post("/", auth, adminAuth, createCategory);

// Admin only - Create subcategory
router.post("/subcategory", auth, adminAuth, createSubcategory);

// Example Admin test route
router.get("/admin-data", auth, adminAuth, async (req, res) => {
  try {
    // Admin user info
    const adminUser = req.user;

    // Admin user દ્વારા બનાવેલી categories
    const categories = await require("../models/Category").find({ createdBy: adminUser.id });

    // Admin user દ્વારા બનાવેલી subcategories
    const subcategories = await require("../models/Subcategory").find({ createdBy: adminUser.id });

    res.json({
      message: "Welcome Admin!",
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      },
      categories,
      subcategories
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;