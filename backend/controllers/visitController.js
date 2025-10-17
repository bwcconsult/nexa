const { createController } = require('./genericController');
const { Visit } = require('../models');

const controller = createController(Visit, 'Visit', ['subject', 'visit_number', 'location', 'notes']);

module.exports = controller;
