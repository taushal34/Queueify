const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    enrollment: { type: String, required: true },
    percentage: { type: Number, required: true },
    shownAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);