const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Solution = sequelize.define('Solution', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  solution_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  solution_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    defaultValue: 'Draft'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  published_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'solutions',
  timestamps: true,
  underscored: true
});

module.exports = Solution;
