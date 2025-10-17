const { createController } = require('./genericController');
const { Project } = require('../models');

const controller = createController(Project, 'Project', ['project_name', 'project_code', 'description']);

module.exports = controller;
