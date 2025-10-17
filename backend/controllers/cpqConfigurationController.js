const { createController } = require('./genericController');
const { CPQConfiguration } = require('../models');

const controller = createController(CPQConfiguration, 'CPQConfiguration', ['configuration_name', 'configuration_type', 'is_active']);

module.exports = controller;
