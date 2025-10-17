const { Meeting } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Meeting, 'Meeting', ['title', 'description']);

module.exports = {
  getMeetings: baseController.getAll,
  getMeeting: baseController.getOne,
  createMeeting: baseController.create,
  updateMeeting: baseController.update,
  deleteMeeting: baseController.delete,
};
