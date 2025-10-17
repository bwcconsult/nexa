const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ClientPortal = sequelize.define('ClientPortal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  portal_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subdomain: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'e.g., clientname.portal.yourcrm.com',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  client_account_id: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
      key: 'id',
    },
  },
  allowed_modules: {
    type: DataTypes.JSONB,
    defaultValue: ['deals', 'orders', 'invoices', 'tickets', 'documents'],
    comment: 'Which modules clients can access',
  },
  branding_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Logo, colors, custom CSS',
  },
  access_permissions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'What clients can view/edit',
  },
  enable_file_upload: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enable_messaging: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enable_ticket_creation: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enable_invoice_payment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  payment_gateway_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Stripe/PayPal configuration',
  },
  custom_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Additional fields to show',
  },
  welcome_message: {
    type: DataTypes.TEXT,
  },
  support_email: {
    type: DataTypes.STRING,
  },
  support_phone: {
    type: DataTypes.STRING,
  },
  active_users: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_logins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_accessed_at: {
    type: DataTypes.DATE,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'client_portals',
  indexes: [
    { fields: ['subdomain'] },
    { fields: ['client_account_id'] },
    { fields: ['is_active'] },
  ],
});

module.exports = ClientPortal;
