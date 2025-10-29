const Ticket = require('../models/Ticket');
const RequestModel = require('../models/Request');

function generateTicketId() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

exports.bookTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subcategoryId, from, to, date, time, price } = req.body;

        // Check if user is active for this subcategory
        const reqDoc = await RequestModel.findOne({ user: userId, subcategory: subcategoryId, status: "active" });
        if (!reqDoc) return res.status(400).json({ message: "You are not allowed to book now." });

        // Generate unique ticket id
        let ticket_id;
        let exists = true;
        while (exists) {
            ticket_id = generateTicketId();
            exists = await Ticket.findOne({ ticket_id });
        }

        const ticket = await Ticket.create({
            user: userId,
            subcategory: subcategoryId,
            from,
            to,
            date,
            time,
            price,
            ticket_id
        });

        // Optionally: Mark request as completed after booking
        reqDoc.status = "completed";
        await reqDoc.save();

        res.json({ success: true, ticket_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};