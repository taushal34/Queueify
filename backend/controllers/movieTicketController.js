const MovieTicket = require('../models/MovieTicket');
// const Queue = require('../models/Queue'); // Only needed if you fetch subcategoryId from queue

function generateTicketId() {
    return 'MOVIE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

exports.bookMovieTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, showTime, ticketCount, subcategoryId } = req.body;

        // 1. Check if user already booked ticket for this subcategory
        const alreadyBooked = await MovieTicket.findOne({ user: userId, subcategory: subcategoryId });
        if (alreadyBooked) {
            return res.status(400).json({ message: "You have already booked your ticket for this movie!" });
        }

        // 2. Generate unique ticket id
        let ticket_id;
        let exists = true;
        while (exists) {
            ticket_id = generateTicketId();
            exists = await MovieTicket.findOne({ ticket_id });
        }

        // 3. Create and store ticket
        const ticket = await MovieTicket.create({
            user: userId,
            subcategory: subcategoryId,
            date,
            showTime,
            ticketCount,
            ticket_id
        });

        res.json({ success: true, ticket_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};