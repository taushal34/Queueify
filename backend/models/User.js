const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: () => moment().tz("Asia/Kolkata").toDate()
  },
});

module.exports = mongoose.model("User", userSchema);
