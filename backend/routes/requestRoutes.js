const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { registerForSubcategory } = require("../controllers/registerController");

router.post("/", auth, registerForSubcategory);

module.exports = router;