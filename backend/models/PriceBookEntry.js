const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PriceBookEntry = sequelize.define('PriceBookEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  price_book_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'price_books',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  list_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  use_standard_price: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'price_book_entries',
  timestamps: true,
  underscored: true
});

module.exports = PriceBookEntry;
