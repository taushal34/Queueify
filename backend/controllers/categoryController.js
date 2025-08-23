const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

exports.createCategory = async (req, res) => {
  try {
    const { name, key } = req.body;
    // createdBy field add કરો
    const cat = await Category.create({ name, key, createdBy: req.user.id });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, key, categoryId, maxParallel } = req.body;
    // createdBy field add કરો
    const sub = await Subcategory.create({ name, key, category: categoryId, maxParallel, createdBy: req.user.id });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.find().lean();
    const results = await Promise.all(cats.map(async c => {
      const subs = await Subcategory.find({ category: c._id }).lean();
      return { ...c, subcategories: subs };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};