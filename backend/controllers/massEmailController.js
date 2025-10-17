const { createController } = require('./genericController');
const { MassEmail } = require('../models');

const controller = createController(MassEmail, 'MassEmail', ['campaign_name', 'subject', 'email_body', 'status']);

module.exports = controller;
