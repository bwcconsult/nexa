const { Sequelize } = require('sequelize');
const logger = require('./logger');

// Use DATABASE_URL if available (for Railway/Heroku), otherwise use individual vars
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: process.env.NODE_ENV === 'development' ? 
        (msg) => logger.debug(msg) : false,
      pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        },
        logging: process.env.NODE_ENV === 'development' ? 
          (msg) => logger.debug(msg) : false,
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000
        },
        define: {
          timestamps: true,
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        }
      }
    );

module.exports = { sequelize };
