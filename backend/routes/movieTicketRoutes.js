const express = require('express');
const router = express.Router();
const movieTicketController = require('../controllers/movieTicketController');
const auth = require('../middleware/auth');

router.post('/book', auth, movieTicketController.bookMovieTicket);

module.exports = router;