const { Lead, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      assigned_to,
      sort = '-created_at',
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (source) where.source = source;
    if (assigned_to) where.assigned_to = assigned_to;

    // Non-admin users can only see their assigned leads or unassigned ones
    if (req.user.role !== 'admin') {
      where[Op.or] = [
        { assigned_to: req.user.id },
        { assigned_to: null },
      ];
    }

    // Build order
    const order = [];
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
    order.push([sortField, sortDirection]);

    const { count, rows } = await Lead.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message,
    });
  }
};

// @desc    Get single lead
// @route   GET /api/v1/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    logger.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message,
    });
  }
};

// @desc    Create lead
// @route   POST /api/v1/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      assigned_to: req.body.assigned_to || req.user.id,
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    logger.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message,
    });
  }
};

// @desc    Update lead
// @route   PUT /api/v1/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead',
      });
    }

    await lead.update(req.body);

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    logger.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lead',
      error: error.message,
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/v1/leads/:id
// @access  Private (Admin/Manager only)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await lead.destroy();

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    logger.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message,
    });
  }
};

// @desc    Convert lead to contact/deal
// @route   POST /api/v1/leads/:id/convert
// @access  Private
exports.convertLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Mark lead as converted
    await lead.update({
      status: 'converted',
      converted_date: new Date(),
    });

    res.json({
      success: true,
      message: 'Lead converted successfully',
      data: lead,
    });
  } catch (error) {
    logger.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error converting lead',
      error: error.message,
    });
  }
};

// @desc    Assign lead to user
// @route   PUT /api/v1/leads/:id/assign
// @access  Private (Admin/Manager only)
exports.assignLead = async (req, res) => {
  try {
    const { assigned_to } = req.body;

    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await lead.update({ assigned_to });

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    logger.error('Assign lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning lead',
      error: error.message,
    });
  }
};

// @desc    Get lead statistics
// @route   GET /api/v1/leads/stats/overview
// @access  Private
exports.getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    const sourceStats = await Lead.findAll({
      attributes: [
        'source',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['source'],
    });

    res.json({
      success: true,
      data: {
        byStatus: stats,
        bySource: sourceStats,
      },
    });
  } catch (error) {
    logger.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead statistics',
      error: error.message,
    });
  }
};

module.exports = exports;
