const { Account } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Account, 'Account', ['name', 'industry']);

module.exports = {
  getAccounts: baseController.getAll,
  getAccount: baseController.getOne,
  createAccount: baseController.create,
  updateAccount: baseController.update,
  deleteAccount: baseController.delete,
};
