const { Email } = require('../models');
const { createController } = require('./genericController');
const { sendEmail } = require('../services/emailService');
const logger = require('../config/logger');

const baseController = createController(Email, 'Email', ['subject', 'to_email', 'from_email']);

module.exports = {
  getEmails: baseController.getAll,
  getEmail: baseController.getOne,
  createEmail: baseController.create,
  updateEmail: baseController.update,
  deleteEmail: baseController.delete,

  // Custom method to send email
  sendEmail: async (req, res) => {
    try {
      const { to, subject, body, html } = req.body;

      // Send email via email service
      await sendEmail({
        to,
        subject,
        text: body,
        html: html || body,
      });

      // Record email in database
      const emailRecord = await Email.create({
        from_email: process.env.SMTP_FROM_EMAIL || 'noreply@nexacrm.com',
        to_email: to,
        subject,
        body,
        html_body: html,
        status: 'sent',
        sent_at: new Date(),
      });

      res.json({
        success: true,
        data: emailRecord,
        message: 'Email sent successfully',
      });
    } catch (error) {
      logger.error('Send email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending email',
        error: error.message,
      });
    }
  },
};
