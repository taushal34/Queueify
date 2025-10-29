const Result = require('../models/Result');

exports.getResult = async (req, res) => {
    try {
        const { enrollment } = req.body;
        if (!enrollment) return res.status(400).json({ message: "Enrollment required" });
        if (!/^\d{10}$/.test(enrollment)) return res.status(400).json({ message: "Enrollment must be 10 digits" });

        // Generate random percentage
        const percentage = Math.floor(Math.random() * 20) + 80; // 80-99

        // Save result
        const result = await Result.create({ enrollment, percentage });

        res.json({ success: true, percentage, resultId: result._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};