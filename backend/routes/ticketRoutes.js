const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

router.post('/book', auth, ticketController.bookTicket);

module.exports = router;