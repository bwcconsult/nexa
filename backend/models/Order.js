const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_number: {
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
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  tax: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  shipping_cost: {
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
  items: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  shipping_address: {
    type: DataTypes.TEXT,
  },
  billing_address: {
    type: DataTypes.TEXT,
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  tracking_number: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['order_number'] },
    { fields: ['customer_id'] },
    { fields: ['status'] },
    { fields: ['order_date'] },
  ],
});

module.exports = Order;
