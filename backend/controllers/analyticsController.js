const { Lead, Deal, Contact, Account, sequelize } = require('../models');
const logger = require('../config/logger');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const { range = '30d' } = req.query;

      // Calculate date range
      const dateFrom = new Date();
      if (range === '7d') dateFrom.setDate(dateFrom.getDate() - 7);
      else if (range === '30d') dateFrom.setDate(dateFrom.getDate() - 30);
      else if (range === '90d') dateFrom.setDate(dateFrom.getDate() - 90);

      // Get counts
      const [leadsCount, dealsCount, contactsCount, accountsCount] = await Promise.all([
        Lead.count(),
        Deal.count(),
        Contact.count(),
        Account.count(),
      ]);

      res.json({
        success: true,
        data: {
          leads: leadsCount,
          deals: dealsCount,
          contacts: contactsCount,
          accounts: accountsCount,
          range,
        },
      });
    } catch (error) {
      logger.error('Dashboard analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard analytics',
        error: error.message,
      });
    }
  },

  getRevenue: async (req, res) => {
    try {
      const { range = '30d' } = req.query;

      const revenue = await Deal.sum('value', {
        where: { stage: 'won' },
      });

      res.json({
        success: true,
        data: {
          total_revenue: revenue || 0,
          range,
        },
      });
    } catch (error) {
      logger.error('Revenue analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching revenue analytics',
        error: error.message,
      });
    }
  },

  getPipeline: async (req, res) => {
    try {
      const pipeline = await Deal.findAll({
        attributes: [
          'stage',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('value')), 'total_value'],
        ],
        group: ['stage'],
      });

      res.json({
        success: true,
        data: pipeline,
      });
    } catch (error) {
      logger.error('Pipeline analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching pipeline analytics',
        error: error.message,
      });
    }
  },

  getLeadSources: async (req, res) => {
    try {
      const sources = await Lead.findAll({
        attributes: [
          'source',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['source'],
      });

      res.json({
        success: true,
        data: sources,
      });
    } catch (error) {
      logger.error('Lead sources analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching lead sources analytics',
        error: error.message,
      });
    }
  },

  getConversionFunnel: async (req, res) => {
    try {
      const funnel = {
        leads: await Lead.count(),
        qualified_leads: await Lead.count({ where: { status: 'qualified' } }),
        contacts: await Contact.count(),
        deals: await Deal.count(),
        won_deals: await Deal.count({ where: { stage: 'won' } }),
      };

      res.json({
        success: true,
        data: funnel,
      });
    } catch (error) {
      logger.error('Conversion funnel error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching conversion funnel',
        error: error.message,
      });
    }
  },
};
