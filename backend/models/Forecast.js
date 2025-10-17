const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Forecast = sequelize.define('Forecast', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  forecast_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  forecast_period: {
    type: DataTypes.STRING,
    allowNull: false // e.g., "Q1 2025", "January 2025"
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  quota: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  committed_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  best_case_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  pipeline_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  closed_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Submitted', 'Approved', 'Rejected'),
    defaultValue: 'Draft'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approved_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'forecasts',
  timestamps: true,
  underscored: true
});

module.exports = Forecast;
