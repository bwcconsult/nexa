const { createController } = require('./genericController');
const { SalesCadence } = require('../models');

const controller = createController(SalesCadence, 'SalesCadence', ['cadence_name', 'target_module', 'is_active']);

module.exports = controller;
