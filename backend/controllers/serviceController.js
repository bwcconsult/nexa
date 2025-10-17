const { createController } = require('./genericController');
const { Service } = require('../models');

const controller = createController(Service, 'Service', ['service_name', 'service_code', 'description', 'category']);

module.exports = controller;
