const { Ticket } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Ticket, 'Ticket', ['ticket_number', 'subject', 'description']);

module.exports = {
  getTickets: baseController.getAll,
  getTicket: baseController.getOne,
  createTicket: baseController.create,
  updateTicket: baseController.update,
  deleteTicket: baseController.delete,
};
