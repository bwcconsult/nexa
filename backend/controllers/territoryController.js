const { createController } = require('./genericController');
const { Territory } = require('../models');

const controller = createController(Territory, 'Territory', ['territory_name', 'territory_code', 'territory_type', 'is_active']);

module.exports = controller;
