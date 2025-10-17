const { createController } = require('./genericController');
const { AssignmentRule } = require('../models');

const controller = createController(AssignmentRule, 'AssignmentRule', ['rule_name', 'module_name', 'is_active']);

module.exports = controller;
