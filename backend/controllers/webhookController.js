const logger = require('../config/logger');

// Webhook handler controller
module.exports = {
  handleWebhook: async (req, res) => {
    try {
      const { event, data } = req.body;

      logger.info('Webhook received:', { event, data });

      // Process webhook based on event type
      // Add your webhook processing logic here

      res.json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      logger.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing webhook',
        error: error.message,
      });
    }
  },

  getWebhookStatus: async (req, res) => {
    res.json({
      success: true,
      status: 'active',
      message: 'Webhook endpoint is operational',
    });
  },
};
