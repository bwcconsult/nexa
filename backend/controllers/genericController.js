const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * Generic CRUD Controller Factory
 * Creates standard REST operations for any model
 */
const createController = (Model, modelName, searchFields = []) => {
  return {
    // Get all records
    getAll: async (req, res) => {
      try {
        const {
          page = 1,
          limit = 1000,
          search,
          sort = '-created_at',
          ...filters
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        // Apply search
        if (search && searchFields.length > 0) {
          where[Op.or] = searchFields.map(field => ({
            [field]: { [Op.iLike]: `%${search}%` }
          }));
        }

        // Apply filters
        Object.keys(filters).forEach(key => {
          if (filters[key]) where[key] = filters[key];
        });

        // Build order
        const order = [];
        const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
        const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
        order.push([sortField, sortDirection]);

        const { count, rows } = await Model.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset,
          order,
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
        logger.error(`Get ${modelName}s error:`, error);
        res.status(500).json({
          success: false,
          message: `Error fetching ${modelName}s`,
          error: error.message,
        });
      }
    },

    // Get single record
    getOne: async (req, res) => {
      try {
        const record = await Model.findByPk(req.params.id);

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        res.json({
          success: true,
          data: record,
        });
      } catch (error) {
        logger.error(`Get ${modelName} error:`, error);
        res.status(500).json({
          success: false,
          message: `Error fetching ${modelName}`,
          error: error.message,
        });
      }
    },

    // Create record
    create: async (req, res) => {
      try {
        const record = await Model.create(req.body);

        res.status(201).json({
          success: true,
          data: record,
        });
      } catch (error) {
        logger.error(`Create ${modelName} error:`, error);
        res.status(500).json({
          success: false,
          message: `Error creating ${modelName}`,
          error: error.message,
        });
      }
    },

    // Update record
    update: async (req, res) => {
      try {
        const record = await Model.findByPk(req.params.id);

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        await record.update(req.body);

        res.json({
          success: true,
          data: record,
        });
      } catch (error) {
        logger.error(`Update ${modelName} error:`, error);
        res.status(500).json({
          success: false,
          message: `Error updating ${modelName}`,
          error: error.message,
        });
      }
    },

    // Delete record
    delete: async (req, res) => {
      try {
        const record = await Model.findByPk(req.params.id);

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        await record.destroy();

        res.json({
          success: true,
          message: `${modelName} deleted successfully`,
        });
      } catch (error) {
        logger.error(`Delete ${modelName} error:`, error);
        res.status(500).json({
          success: false,
          message: `Error deleting ${modelName}`,
          error: error.message,
        });
      }
    },
  };
};

module.exports = { createController };
