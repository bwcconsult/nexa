const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
  },
  customer_type: {
    type: DataTypes.ENUM('individual', 'business'),
    defaultValue: 'individual',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  billing_address: {
    type: DataTypes.TEXT,
  },
  shipping_address: {
    type: DataTypes.TEXT,
  },
  tax_id: {
    type: DataTypes.STRING,
  },
  credit_limit: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  total_spent: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'customers',
  indexes: [
    { fields: ['email'] },
    { fields: ['status'] },
  ],
});

module.exports = Customer;
