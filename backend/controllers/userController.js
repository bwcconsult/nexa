const { User } = require('../models');
const { createController } = require('./genericController');

// Use generic controller with custom search fields
const baseController = createController(User, 'User', ['full_name', 'email']);

// Export with any custom methods
module.exports = {
  getUsers: baseController.getAll,
  getUser: baseController.getOne,
  createUser: baseController.create,
  updateUser: baseController.update,
  deleteUser: baseController.delete,
};
