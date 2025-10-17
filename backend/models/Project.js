const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  account_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'deals',
      key: 'id'
    }
  },
  project_type: {
    type: DataTypes.ENUM('Internal', 'External', 'Client Project', 'R&D'),
    defaultValue: 'Client Project'
  },
  status: {
    type: DataTypes.ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
    defaultValue: 'Planning'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  actual_cost: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  project_manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  team_members: {
    type: DataTypes.JSON, // Array of user IDs
    allowNull: true
  },
  milestones: {
    type: DataTypes.JSON,
    allowNull: true
  },
  deliverables: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  risks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'projects',
  timestamps: true,
  underscored: true
});

module.exports = Project;
