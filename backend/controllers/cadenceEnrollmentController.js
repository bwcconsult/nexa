const { createController } = require('./genericController');
const { CadenceEnrollment } = require('../models');

const controller = createController(CadenceEnrollment, 'CadenceEnrollment', ['cadence_id', 'record_id', 'status']);

module.exports = controller;
