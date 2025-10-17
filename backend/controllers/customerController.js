const { Customer } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Customer, 'Customer', ['name', 'email', 'company']);

module.exports = {
  getCustomers: baseController.getAll,
  getCustomer: baseController.getOne,
  createCustomer: baseController.create,
  updateCustomer: baseController.update,
  deleteCustomer: baseController.delete,
};
