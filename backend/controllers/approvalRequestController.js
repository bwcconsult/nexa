const { createController } = require('./genericController');
const { ApprovalRequest } = require('../models');

const controller = createController(ApprovalRequest, 'ApprovalRequest', ['approval_process_id', 'record_id', 'status']);

module.exports = controller;
