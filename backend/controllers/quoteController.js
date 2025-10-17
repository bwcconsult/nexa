const { createController } = require('./genericController');
const { Quote } = require('../models');

const controller = createController(Quote, 'Quote', ['subject', 'quote_number', 'description']);

module.exports = controller;
