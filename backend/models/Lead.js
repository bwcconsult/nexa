const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
  title: {
    type: DataTypes.STRING,
  },
  source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'other'),
    defaultValue: 'website',
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'qualified', 'unqualified', 'converted'),
    defaultValue: 'new',
  },
  lead_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
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
  website: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  postal_code: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  assigned_to: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  converted_date: {
    type: DataTypes.DATE,
  },
  last_contact_date: {
    type: DataTypes.DATE,
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'leads',
  indexes: [
    { fields: ['email'] },
    { fields: ['status'] },
    { fields: ['assigned_to'] },
    { fields: ['lead_score'] },
  ],
});

module.exports = Lead;
