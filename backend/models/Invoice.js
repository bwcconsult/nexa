const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoice_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.UUID,
    references: {
      model: 'customers',
      key: 'id',
    },
  },
  issue_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft',
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  tax: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  items: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  terms: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'invoices',
  indexes: [
    { fields: ['invoice_number'] },
    { fields: ['customer_id'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],
});

module.exports = Invoice;
