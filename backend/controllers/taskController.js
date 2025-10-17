const { Task } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Task, 'Task', ['title', 'description']);

module.exports = {
  getTasks: baseController.getAll,
  getTask: baseController.getOne,
  createTask: baseController.create,
  updateTask: baseController.update,
  deleteTask: baseController.delete,
};
