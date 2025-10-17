const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  cost: {
    type: DataTypes.DECIMAL(15, 2),
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'unit',
  },
  status: {
    type: DataTypes.ENUM('active', 'discontinued', 'out_of_stock'),
    defaultValue: 'active',
  },
  image_url: {
    type: DataTypes.STRING,
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'products',
  indexes: [
    { fields: ['sku'] },
    { fields: ['category'] },
    { fields: ['status'] },
  ],
});

module.exports = Product;
