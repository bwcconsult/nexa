const { createController } = require('./genericController');
const { ApprovalProcess } = require('../models');

const controller = createController(ApprovalProcess, 'ApprovalProcess', ['process_name', 'module_name', 'is_active']);

module.exports = controller;
