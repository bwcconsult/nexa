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
const Quote = require('./Quote');
const PriceBook = require('./PriceBook');
const PriceBookEntry = require('./PriceBookEntry');
const Solution = require('./Solution');
const Forecast = require('./Forecast');
const Visit = require('./Visit');
const SocialPost = require('./SocialPost');
const Project = require('./Project');
const Service = require('./Service');
const MassEmail = require('./MassEmail');
const AssignmentRule = require('./AssignmentRule');
const ValidationRule = require('./ValidationRule');
const WebhookConfig = require('./WebhookConfig');
const Territory = require('./Territory');
const ApprovalProcess = require('./ApprovalProcess');
const ApprovalRequest = require('./ApprovalRequest');
const SalesCadence = require('./SalesCadence');
const CadenceEnrollment = require('./CadenceEnrollment');
const CPQConfiguration = require('./CPQConfiguration');
const Blueprint = require('./Blueprint');
const CustomFunction = require('./CustomFunction');
const ClientPortal = require('./ClientPortal');
const PageLayout = require('./PageLayout');
const KioskMode = require('./KioskMode');
const IndustryTemplate = require('./IndustryTemplate');

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

// Quote relationships
Quote.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });
Quote.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Quote.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Quote.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });

// PriceBook relationships
PriceBook.hasMany(PriceBookEntry, { foreignKey: 'price_book_id', as: 'entries' });

// PriceBookEntry relationships
PriceBookEntry.belongsTo(PriceBook, { foreignKey: 'price_book_id', as: 'priceBook' });
PriceBookEntry.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Solution relationships
Solution.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Solution.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

// Forecast relationships
Forecast.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Forecast.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// Visit relationships
Visit.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Visit.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Visit.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Visit.belongsTo(User, { foreignKey: 'assigned_to', as: 'owner' });

// SocialPost relationships
SocialPost.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
SocialPost.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
SocialPost.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Project relationships
Project.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Project.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });
Project.belongsTo(User, { foreignKey: 'project_manager_id', as: 'manager' });

// Service relationships
Service.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

// MassEmail relationships
MassEmail.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// AssignmentRule relationships
AssignmentRule.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
AssignmentRule.belongsTo(User, { foreignKey: 'assigned_to_user_id', as: 'assignedUser' });

// ValidationRule relationships
ValidationRule.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// WebhookConfig relationships
WebhookConfig.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Territory relationships
Territory.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });
Territory.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Territory.belongsTo(Territory, { foreignKey: 'parent_territory_id', as: 'parentTerritory' });
Territory.hasMany(Territory, { foreignKey: 'parent_territory_id', as: 'childTerritories' });

// ApprovalProcess relationships
ApprovalProcess.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
ApprovalProcess.hasMany(ApprovalRequest, { foreignKey: 'approval_process_id', as: 'requests' });

// ApprovalRequest relationships
ApprovalRequest.belongsTo(ApprovalProcess, { foreignKey: 'approval_process_id', as: 'process' });
ApprovalRequest.belongsTo(User, { foreignKey: 'requested_by', as: 'requester' });
ApprovalRequest.belongsTo(User, { foreignKey: 'final_decision_by', as: 'decider' });

// SalesCadence relationships
SalesCadence.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
SalesCadence.hasMany(CadenceEnrollment, { foreignKey: 'cadence_id', as: 'enrollments' });

// CadenceEnrollment relationships
CadenceEnrollment.belongsTo(SalesCadence, { foreignKey: 'cadence_id', as: 'cadence' });
CadenceEnrollment.belongsTo(User, { foreignKey: 'enrolled_by', as: 'enroller' });
CadenceEnrollment.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// CPQConfiguration relationships
CPQConfiguration.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
CPQConfiguration.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Blueprint relationships
Blueprint.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// CustomFunction relationships
CustomFunction.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// ClientPortal relationships
ClientPortal.belongsTo(Account, { foreignKey: 'client_account_id', as: 'account' });
ClientPortal.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// PageLayout relationships
PageLayout.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// KioskMode relationships
KioskMode.belongsTo(User, { foreignKey: 'auto_assign_to', as: 'assignee' });
KioskMode.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

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
  Quote,
  PriceBook,
  PriceBookEntry,
  Solution,
  Forecast,
  Visit,
  SocialPost,
  Project,
  Service,
  MassEmail,
  AssignmentRule,
  ValidationRule,
  WebhookConfig,
  Territory,
  ApprovalProcess,
  ApprovalRequest,
  SalesCadence,
  CadenceEnrollment,
  CPQConfiguration,
  Blueprint,
  CustomFunction,
  ClientPortal,
  PageLayout,
  KioskMode,
  IndustryTemplate,
};

module.exports = models;
