const mongoose = require('mongoose');

const movieTicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    // movie: { type: String, required: true }, // Movie name or ID
    date: { type: Date, required: true },
    showTime: { type: String, required: true },
    ticketCount: { type: Number, required: true },
    ticket_id: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MovieTicket', movieTicketSchema);