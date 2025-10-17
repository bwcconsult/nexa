const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  service_type: {
    type: DataTypes.ENUM('Consulting', 'Support', 'Maintenance', 'Installation', 'Training', 'Custom'),
    defaultValue: 'Support'
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'Hour' // Hour, Day, Session, etc.
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  cost_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  service_level: {
    type: DataTypes.ENUM('Basic', 'Standard', 'Premium', 'Enterprise'),
    defaultValue: 'Standard'
  },
  response_time: {
    type: DataTypes.STRING,
    allowNull: true // e.g., "24 hours", "Same day"
  },
  support_hours: {
    type: DataTypes.STRING,
    allowNull: true // e.g., "24/7", "Business hours"
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  provider_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'services',
  timestamps: true,
  underscored: true
});

module.exports = Service;
