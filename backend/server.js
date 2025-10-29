const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const requestRoutes = require('./routes/requestRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(cors()); // <-- Add this line
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));


// ... existing imports and connectDB
app.use("/api/categories", require("./routes/categoryRoutes"));

// ... existing auth routes etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


app.use("/api/register", require("./routes/registerRoutes"));

app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/requests', requestRoutes);

app.use('/api/ticket', require('./routes/ticketRoutes'));

app.use('/api/result', require('./routes/resultRoutes'));

app.use('/api/movie-ticket', require('./routes/movieTicketRoutes'));