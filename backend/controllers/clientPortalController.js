const { createController } = require('./genericController');
const { ClientPortal } = require('../models');

const controller = createController(ClientPortal, 'ClientPortal', ['portal_name', 'subdomain', 'is_active']);

module.exports = controller;
