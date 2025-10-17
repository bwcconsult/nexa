const { createController } = require('./genericController');
const { KioskMode } = require('../models');

const controller = createController(KioskMode, 'KioskMode', ['kiosk_name', 'target_module', 'is_active']);

module.exports = controller;
