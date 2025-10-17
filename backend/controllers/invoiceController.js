const { Invoice } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Invoice, 'Invoice', ['invoice_number']);

module.exports = {
  getInvoices: baseController.getAll,
  getInvoice: baseController.getOne,
  createInvoice: baseController.create,
  updateInvoice: baseController.update,
  deleteInvoice: baseController.delete,
};
