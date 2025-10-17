const { Call } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Call, 'Call', ['subject', 'phone_number']);

module.exports = {
  getCalls: baseController.getAll,
  getCall: baseController.getOne,
  createCall: baseController.create,
  updateCall: baseController.update,
  deleteCall: baseController.delete,
};
