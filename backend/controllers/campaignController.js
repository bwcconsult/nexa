const { Campaign } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Campaign, 'Campaign', ['name', 'description']);

module.exports = {
  getCampaigns: baseController.getAll,
  getCampaign: baseController.getOne,
  createCampaign: baseController.create,
  updateCampaign: baseController.update,
  deleteCampaign: baseController.delete,
};
