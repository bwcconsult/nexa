const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SocialPost = sequelize.define('SocialPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  platform: {
    type: DataTypes.ENUM('Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok', 'Other'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Scheduled', 'Published', 'Failed'),
    defaultValue: 'Draft'
  },
  scheduled_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  published_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  media_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_type: {
    type: DataTypes.ENUM('Image', 'Video', 'Link', 'None'),
    defaultValue: 'None'
  },
  campaign_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'campaigns',
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
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shares_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  engagement_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  hashtags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  mentions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  post_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  external_post_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'social_posts',
  timestamps: true,
  underscored: true
});

module.exports = SocialPost;
