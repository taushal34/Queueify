const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  status: { type: String, enum: ["waiting","active","completed","expired"], default: "waiting" },
  queuePosition: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  startedAt: Date,
  endedAt: Date
});

module.exports = mongoose.model("Request", requestSchema);
