const { createController } = require('./genericController');
const { ValidationRule } = require('../models');

const controller = createController(ValidationRule, 'ValidationRule', ['rule_name', 'module_name', 'field_name', 'validation_type']);

module.exports = controller;
