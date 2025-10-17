const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(ticketController.getTickets)
  .post(ticketController.createTicket);

router
  .route('/:id')
  .get(ticketController.getTicket)
  .put(ticketController.updateTicket)
  .delete(ticketController.deleteTicket);

module.exports = router;
