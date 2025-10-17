const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quote_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'deals',
      key: 'id'
    }
  },
  account_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  contact_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  quote_stage: {
    type: DataTypes.ENUM('Draft', 'Sent', 'Reviewed', 'Accepted', 'Rejected'),
    defaultValue: 'Draft'
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  discount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  tax: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  terms_and_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  billing_street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billing_city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billing_state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billing_postal_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billing_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_postal_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'quotes',
  timestamps: true,
  underscored: true
});

module.exports = Quote;
