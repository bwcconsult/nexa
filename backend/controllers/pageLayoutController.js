const { createController } = require('./genericController');
const { PageLayout } = require('../models');

const controller = createController(PageLayout, 'PageLayout', ['layout_name', 'module_name', 'is_active']);

module.exports = controller;
