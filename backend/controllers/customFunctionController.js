const { createController } = require('./genericController');
const { CustomFunction } = require('../models');

const controller = createController(CustomFunction, 'CustomFunction', ['function_name', 'display_name', 'is_active']);

module.exports = controller;
