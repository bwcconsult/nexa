const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    unique: true,
  },
  website: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  annual_revenue: {
    type: DataTypes.DECIMAL(15, 2),
  },
  employees: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM('prospect', 'customer', 'partner', 'vendor'),
    defaultValue: 'prospect',
  },
  phone: {
    type: DataTypes.STRING,
  },
  billing_address: {
    type: DataTypes.TEXT,
  },
  billing_city: {
    type: DataTypes.STRING,
  },
  billing_state: {
    type: DataTypes.STRING,
  },
  billing_country: {
    type: DataTypes.STRING,
  },
  billing_postal_code: {
    type: DataTypes.STRING,
  },
  shipping_address: {
    type: DataTypes.TEXT,
  },
  shipping_city: {
    type: DataTypes.STRING,
  },
  shipping_state: {
    type: DataTypes.STRING,
  },
  shipping_country: {
    type: DataTypes.STRING,
  },
  shipping_postal_code: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  assigned_to: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'accounts',
  indexes: [
    { fields: ['account_number'], unique: true },
    { fields: ['assigned_to'] },
    { fields: ['industry'] },
  ],
});

module.exports = Account;
