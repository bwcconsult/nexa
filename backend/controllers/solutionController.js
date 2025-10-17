const { createController } = require('./genericController');
const { Solution } = require('../models');

const controller = createController(Solution, 'Solution', ['title', 'solution_number', 'description', 'category']);

module.exports = controller;
