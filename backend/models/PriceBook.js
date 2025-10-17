const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PriceBook = sequelize.define('PriceBook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_standard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'price_books',
  timestamps: true,
  underscored: true
});

module.exports = PriceBook;
