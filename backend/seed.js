const mongoose = require("mongoose");
const Category = require("./models/Category");
const Subcategory = require("./models/Subcategory");

const ADMIN_ID = new mongoose.Types.ObjectId("68e4a94cf0a25bc649e30190");

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/queue_system");

    // 1. Insert TRAIN tikit category
    const trainCategory = await Category.create({
        name: "TRAIN tikit",
        key: "train_tikit",
        createdBy: ADMIN_ID
    });

    // 2. Insert subcategories for TRAIN tikit
    const trainSubcategories = [
        {
            name: "Vande Bharat Express",
            key: "vande_bharat_express",
            category: trainCategory._id,
            createdBy: ADMIN_ID,
            imageUrl: "https://your-image-url.com/vande_bharat_express.jpg"
        },
        {
            name: "Rajdhani Express",
            key: "rajdhani_express",
            category: trainCategory._id,
            createdBy: ADMIN_ID,
            imageUrl: "https://your-image-url.com/rajdhani_express.jpg"
        },
        {
            name: "Gujrat Queen",
            key: "gujrat_queen",
            category: trainCategory._id,
            createdBy: ADMIN_ID,
            imageUrl: "https://your-image-url.com/gujrat_queen.jpg"
        }
    ];

    await Subcategory.insertMany(trainSubcategories);

    console.log("TRAIN tikit category and subcategories seeded successfully!");
    process.exit();
}

seed();