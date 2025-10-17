const { Deal } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Deal, 'Deal', ['name', 'description']);

module.exports = {
  getDeals: baseController.getAll,
  getDeal: baseController.getOne,
  createDeal: baseController.create,
  updateDeal: baseController.update,
  deleteDeal: baseController.delete,
};
