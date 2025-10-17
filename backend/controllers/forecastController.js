const { createController } = require('./genericController');
const { Forecast } = require('../models');

const controller = createController(Forecast, 'Forecast', ['forecast_name', 'forecast_period']);

module.exports = controller;
