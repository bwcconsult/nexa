const { createController } = require('./genericController');
const { SocialPost } = require('../models');

const controller = createController(SocialPost, 'SocialPost', ['title', 'content', 'platform']);

module.exports = controller;
