const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const User = require("../models/user");

exports.deleteUserAndCategories = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find all categories created by this user
    const categories = await Category.find({ createdBy: userId });
    const categoryIds = categories.map(cat => cat._id);

    // Delete all subcategories under those categories
    await Subcategory.deleteMany({ category: { $in: categoryIds } });

    // Delete all categories created by this user
    await Category.deleteMany({ createdBy: userId });

    // Delete the user
    await user.deleteOne();

    return res.json({ message: "User, their categories, and subcategories deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
