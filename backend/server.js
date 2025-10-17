require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import configurations
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leadRoutes = require('./routes/leads');
const contactRoutes = require('./routes/contacts');
const accountRoutes = require('./routes/accounts');
const dealRoutes = require('./routes/deals');
const taskRoutes = require('./routes/tasks');
const meetingRoutes = require('./routes/meetings');
const callRoutes = require('./routes/calls');
const activityRoutes = require('./routes/activities');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const campaignRoutes = require('./routes/campaigns');
const supplierRoutes = require('./routes/suppliers');
const invoiceRoutes = require('./routes/invoices');
const ticketRoutes = require('./routes/tickets');
const linkAnalyticsRoutes = require('./routes/linkAnalytics');
const emailRoutes = require('./routes/emails');
const documentRoutes = require('./routes/documents');
const workflowRoutes = require('./routes/workflows');
const webhookRoutes = require('./routes/webhooks');
const analyticsRoutes = require('./routes/analytics');
const ssoRoutes = require('./routes/sso');
const quoteRoutes = require('./routes/quotes');
const priceBookRoutes = require('./routes/priceBooks');
const solutionRoutes = require('./routes/solutions');
const forecastRoutes = require('./routes/forecasts');
const visitRoutes = require('./routes/visits');
const socialPostRoutes = require('./routes/socialPosts');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const massEmailRoutes = require('./routes/massEmails');
const assignmentRuleRoutes = require('./routes/assignmentRules');
const validationRuleRoutes = require('./routes/validationRules');
const webhookConfigRoutes = require('./routes/webhookConfigs');
const territoryRoutes = require('./routes/territories');
const approvalProcessRoutes = require('./routes/approvalProcesses');
const approvalRequestRoutes = require('./routes/approvalRequests');
const salesCadenceRoutes = require('./routes/salesCadences');
const cadenceEnrollmentRoutes = require('./routes/cadenceEnrollments');
const cpqConfigurationRoutes = require('./routes/cpqConfigurations');
const blueprintRoutes = require('./routes/blueprints');
const customFunctionRoutes = require('./routes/customFunctions');
const clientPortalRoutes = require('./routes/clientPortals');
const pageLayoutRoutes = require('./routes/pageLayouts');
const kioskModeRoutes = require('./routes/kioskModes');
const industryTemplateRoutes = require('./routes/industryTemplates');
const featureRoutes = require('./routes/features');
const contactListRoutes = require('./routes/contactLists');
const importExportRoutes = require('./routes/importExport');
const conversationRoutes = require('./routes/conversations');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1'
  });
});

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/leads`, leadRoutes);
app.use(`/api/${apiVersion}/contacts`, contactRoutes);
app.use(`/api/${apiVersion}/accounts`, accountRoutes);
app.use(`/api/${apiVersion}/deals`, dealRoutes);
app.use(`/api/${apiVersion}/tasks`, taskRoutes);
app.use(`/api/${apiVersion}/meetings`, meetingRoutes);
app.use(`/api/${apiVersion}/calls`, callRoutes);
app.use(`/api/${apiVersion}/activities`, activityRoutes);
app.use(`/api/${apiVersion}/customers`, customerRoutes);
app.use(`/api/${apiVersion}/products`, productRoutes);
app.use(`/api/${apiVersion}/orders`, orderRoutes);
app.use(`/api/${apiVersion}/campaigns`, campaignRoutes);
app.use(`/api/${apiVersion}/suppliers`, supplierRoutes);
app.use(`/api/${apiVersion}/invoices`, invoiceRoutes);
app.use(`/api/${apiVersion}/tickets`, ticketRoutes);
app.use(`/api/${apiVersion}/link-analytics`, linkAnalyticsRoutes);
app.use(`/api/${apiVersion}/emails`, emailRoutes);
app.use(`/api/${apiVersion}/documents`, documentRoutes);
app.use(`/api/${apiVersion}/workflows`, workflowRoutes);
app.use(`/api/${apiVersion}/webhooks`, webhookRoutes);
app.use(`/api/${apiVersion}/analytics`, analyticsRoutes);
app.use(`/api/${apiVersion}/sso`, ssoRoutes);
app.use(`/api/${apiVersion}/quotes`, quoteRoutes);
app.use(`/api/${apiVersion}/price-books`, priceBookRoutes);
app.use(`/api/${apiVersion}/solutions`, solutionRoutes);
app.use(`/api/${apiVersion}/forecasts`, forecastRoutes);
app.use(`/api/${apiVersion}/visits`, visitRoutes);
app.use(`/api/${apiVersion}/social-posts`, socialPostRoutes);
app.use(`/api/${apiVersion}/projects`, projectRoutes);
app.use(`/api/${apiVersion}/services`, serviceRoutes);
app.use(`/api/${apiVersion}/mass-emails`, massEmailRoutes);
app.use(`/api/${apiVersion}/assignment-rules`, assignmentRuleRoutes);
app.use(`/api/${apiVersion}/validation-rules`, validationRuleRoutes);
app.use(`/api/${apiVersion}/webhook-configs`, webhookConfigRoutes);
app.use(`/api/${apiVersion}/territories`, territoryRoutes);
app.use(`/api/${apiVersion}/approval-processes`, approvalProcessRoutes);
app.use(`/api/${apiVersion}/approval-requests`, approvalRequestRoutes);
app.use(`/api/${apiVersion}/sales-cadences`, salesCadenceRoutes);
app.use(`/api/${apiVersion}/cadence-enrollments`, cadenceEnrollmentRoutes);
app.use(`/api/${apiVersion}/cpq-configurations`, cpqConfigurationRoutes);
app.use(`/api/${apiVersion}/blueprints`, blueprintRoutes);
app.use(`/api/${apiVersion}/custom-functions`, customFunctionRoutes);
app.use(`/api/${apiVersion}/client-portals`, clientPortalRoutes);
app.use(`/api/${apiVersion}/page-layouts`, pageLayoutRoutes);
app.use(`/api/${apiVersion}/kiosk-modes`, kioskModeRoutes);
app.use(`/api/${apiVersion}/industry-templates`, industryTemplateRoutes);
app.use(`/api/${apiVersion}/features`, featureRoutes);
app.use(`/api/${apiVersion}/contact-lists`, contactListRoutes);
app.use(`/api/${apiVersion}`, importExportRoutes);
app.use(`/api/${apiVersion}/conversations`, conversationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Sync database models (only in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database models synchronized.');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Nexa CRM Backend running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 API Base: http://localhost:${PORT}/api/${apiVersion}`);
    });
  } catch (error) {
    logger.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

startServer();

module.exports = app;
