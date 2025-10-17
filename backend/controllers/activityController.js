const { Activity } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Activity, 'Activity', ['title', 'description']);

module.exports = {
  getActivities: baseController.getAll,
  getActivity: baseController.getOne,
  createActivity: baseController.create,
  updateActivity: baseController.update,
  deleteActivity: baseController.delete,
};
