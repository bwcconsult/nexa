const { Contact } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Contact, 'Contact', ['first_name', 'last_name', 'email', 'company']);

module.exports = {
  getContacts: baseController.getAll,
  getContact: baseController.getOne,
  createContact: baseController.create,
  updateContact: baseController.update,
  deleteContact: baseController.delete,
};
