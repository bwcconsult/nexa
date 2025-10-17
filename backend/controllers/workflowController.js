const { Workflow } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Workflow, 'Workflow', ['name', 'description']);

module.exports = {
  getWorkflows: baseController.getAll,
  getWorkflow: baseController.getOne,
  createWorkflow: baseController.create,
  updateWorkflow: baseController.update,
  deleteWorkflow: baseController.delete,
};
