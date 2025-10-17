const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
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
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  account_id: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
      key: 'id',
    },
  },
  source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'email_campaign', 'event', 'other'),
    defaultValue: 'website',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'lead', 'customer'),
    defaultValue: 'active',
  },
  linkedin_url: {
    type: DataTypes.STRING,
  },
  twitter_handle: {
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
  last_contact_date: {
    type: DataTypes.DATE,
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'contacts',
  indexes: [
    { fields: ['email'] },
    { fields: ['account_id'] },
    { fields: ['assigned_to'] },
    { fields: ['status'] },
  ],
});

module.exports = Contact;
