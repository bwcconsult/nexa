const { LinkAnalytics } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(LinkAnalytics, 'LinkAnalytics', ['short_code', 'original_url']);

module.exports = {
  getLinkAnalytics: baseController.getAll,
  getLinkAnalytic: baseController.getOne,
  createLinkAnalytic: baseController.create,
  updateLinkAnalytic: baseController.update,
  deleteLinkAnalytic: baseController.delete,
};
