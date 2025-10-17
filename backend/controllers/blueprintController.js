const { createController } = require('./genericController');
const { Blueprint } = require('../models');

const controller = createController(Blueprint, 'Blueprint', ['blueprint_name', 'module_name', 'is_active']);

module.exports = controller;
