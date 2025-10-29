const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
    status: { type: String, enum: ["waiting", "active", "completed"], default: "waiting" },
    queuePosition: { type: Number, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite or duplicate registration
module.exports = mongoose.models.Request || mongoose.model("Request", requestSchema);