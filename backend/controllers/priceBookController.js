const { createController } = require('./genericController');
const { PriceBook } = require('../models');

const controller = createController(PriceBook, 'PriceBook', ['name', 'description']);

module.exports = controller;
