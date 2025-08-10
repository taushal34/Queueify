const User_L_S = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User_L_S.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User_L_S({
      name,
      email,
      password: hashedPassword,
      createdAt:moment().tz("Asia/Kolkata").toDate()
    });

    await user.save();
    const userIST = {
  ...user.toObject(),
  createdAtIST: moment(user.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
};
    res.status(201).json({ message: "Signup successful", user: userIST });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User_L_S.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
