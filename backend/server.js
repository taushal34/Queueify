const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));


// ... existing imports and connectDB
app.use("/api/categories", require("./routes/categoryRoutes"));

// ... existing auth routes etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


app.use("/api/register", require("./routes/registerRoutes"));