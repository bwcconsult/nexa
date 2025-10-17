const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Lead = require('./Lead');
const Contact = require('./Contact');
const Account = require('./Account');
const Deal = require('./Deal');
const Task = require('./Task');
const Meeting = require('./Meeting');
const Call = require('./Call');
const Activity = require('./Activity');
const Customer = require('./Customer');
const Product = require('./Product');
const Order = require('./Order');
const Campaign = require('./Campaign');
const Supplier = require('./Supplier');
const Invoice = require('./Invoice');
const Ticket = require('./Ticket');
const LinkAnalytics = require('./LinkAnalytics');
const Email = require('./Email');
const Document = require('./Document');
const Workflow = require('./Workflow');

// Define relationships

// User relationships
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'leads' });
User.hasMany(Contact, { foreignKey: 'assigned_to', as: 'contacts' });
User.hasMany(Deal, { foreignKey: 'assigned_to', as: 'deals' });
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'tasks' });
User.hasMany(Activity, { foreignKey: 'user_id', as: 'activities' });

// Lead relationships
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });

// Contact relationships
Contact.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });
Contact.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });

// Account relationships
Account.hasMany(Contact, { foreignKey: 'account_id', as: 'contacts' });
Account.hasMany(Deal, { foreignKey: 'account_id', as: 'deals' });
Account.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });

// Deal relationships
Deal.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Deal.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Deal.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });

// Task relationships
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });
Task.belongsTo(Lead, { foreignKey: 'related_to_id', as: 'lead' });
Task.belongsTo(Contact, { foreignKey: 'related_to_id', as: 'contact' });
Task.belongsTo(Deal, { foreignKey: 'related_to_id', as: 'deal' });

// Meeting relationships
Meeting.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
Meeting.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// Activity relationships
Activity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order relationships
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Invoice relationships
Invoice.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Ticket relationships
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
Ticket.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Document relationships
Document.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

const models = {
  sequelize,
  User,
  Lead,
  Contact,
  Account,
  Deal,
  Task,
  Meeting,
  Call,
  Activity,
  Customer,
  Product,
  Order,
  Campaign,
  Supplier,
  Invoice,
  Ticket,
  LinkAnalytics,
  Email,
  Document,
  Workflow,
};

module.exports = models;
