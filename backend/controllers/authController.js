const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: moment().tz("Asia/Kolkata").toDate()
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    // Signup પછી પણ token return કરો
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "90d" });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        ...userObj,
        createdAtIST: moment(user.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Login successful",
      token,
      user: {
        ...userObj,
        createdAtIST: moment(user.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};