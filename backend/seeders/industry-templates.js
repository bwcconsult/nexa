const { IndustryTemplate } = require('../models');

const industryTemplates = [
  {
    industry_name: 'SaaS & Technology',
    category: 'technology',
    description: 'Perfect for Software as a Service companies and technology startups',
    fit_score: 98,
    icon: 'Code',
    color_scheme: { primary: '#3B82F6', secondary: '#8B5CF6' },
    terminology: { customer: 'User', deal: 'Subscription', account: 'Organization' },
    custom_fields: [
      { name: 'Trial End Date', type: 'date', module: 'deals' },
      { name: 'Monthly Recurring Revenue', type: 'currency', module: 'deals' },
      { name: 'Product Plan', type: 'picklist', options: ['Free', 'Starter', 'Pro', 'Enterprise'], module: 'deals' },
      { name: 'Health Score', type: 'number', module: 'accounts' }
    ],
    workflow_templates: [
      { name: 'Trial Expiration Reminder', trigger: 'Scheduled', actions: ['Send Email', 'Create Task'] }
    ],
    dashboard_config: { widgets: ['MRR Trend', 'Trial Conversions', 'Churn Rate'] },
    pipeline_stages: [
      { name: 'Free Trial', probability: 10 },
      { name: 'Demo Scheduled', probability: 25 },
      { name: 'Contract Sent', probability: 75 },
      { name: 'Closed Won', probability: 100 }
    ],
    email_templates: [
      { name: 'Welcome Email', subject: 'Welcome to [Product Name]!' }
    ],
    recommended_integrations: ['Stripe', 'Intercom', 'Segment'],
    compliance_features: ['SOC 2', 'GDPR'],
    is_active: true,
    popularity_rank: 1
  },
  {
    industry_name: 'Financial Services & Insurance',
    category: 'financial_services',
    description: 'Designed for insurance agents, financial advisors, and wealth management',
    fit_score: 96,
    icon: 'DollarSign',
    color_scheme: { primary: '#059669', secondary: '#10B981' },
    terminology: { customer: 'Client', deal: 'Policy', contact: 'Policyholder' },
    custom_fields: [
      { name: 'Policy Number', type: 'text', module: 'deals' },
      { name: 'Premium Amount', type: 'currency', module: 'deals' },
      { name: 'Policy Type', type: 'picklist', options: ['Life', 'Health', 'Auto', 'Home'], module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Policy Renewal Reminder', trigger: '30 Days Before Renewal', actions: ['Send Email'] }
    ],
    dashboard_config: { widgets: ['Total Policies', 'Premium Revenue', 'Renewal Rate'] },
    pipeline_stages: [
      { name: 'Lead Inquiry', probability: 10 },
      { name: 'Quote Provided', probability: 50 },
      { name: 'Policy Issued', probability: 100 }
    ],
    email_templates: [{ name: 'Policy Renewal Notice', subject: 'Your policy renews soon' }],
    recommended_integrations: ['DocuSign', 'QuickBooks'],
    compliance_features: ['SEC Compliance', 'FINRA'],
    is_active: true,
    popularity_rank: 2
  },
  {
    industry_name: 'Real Estate',
    category: 'real_estate',
    description: 'Perfect for real estate agents, brokers, and property management',
    fit_score: 97,
    icon: 'Home',
    color_scheme: { primary: '#DC2626', secondary: '#F59E0B' },
    terminology: { customer: 'Client', deal: 'Property Deal', account: 'Property' },
    custom_fields: [
      { name: 'Property Address', type: 'text', module: 'accounts' },
      { name: 'List Price', type: 'currency', module: 'accounts' },
      { name: 'MLS Number', type: 'text', module: 'accounts' }
    ],
    workflow_templates: [
      { name: 'New Listing Alert', trigger: 'Property Added', actions: ['Send Alert'] }
    ],
    dashboard_config: { widgets: ['Active Listings', 'Properties Sold', 'Commission Revenue'] },
    pipeline_stages: [
      { name: 'Lead Inquiry', probability: 10 },
      { name: 'Property Viewed', probability: 25 },
      { name: 'Offer Accepted', probability: 75 },
      { name: 'Closed', probability: 100 }
    ],
    email_templates: [{ name: 'New Property Alert', subject: 'New property matching your criteria' }],
    recommended_integrations: ['Zillow', 'Realtor.com', 'DocuSign'],
    compliance_features: ['Fair Housing Compliance'],
    is_active: true,
    popularity_rank: 3
  },
  {
    industry_name: 'Professional Services',
    category: 'professional_services',
    description: 'Ideal for consultants, agencies, law firms, and accounting practices',
    fit_score: 95,
    icon: 'Briefcase',
    color_scheme: { primary: '#6366F1', secondary: '#8B5CF6' },
    terminology: { customer: 'Client', deal: 'Engagement' },
    custom_fields: [
      { name: 'Project Type', type: 'picklist', options: ['Consulting', 'Advisory', 'Implementation'], module: 'deals' },
      { name: 'Billing Type', type: 'picklist', options: ['Hourly', 'Fixed Fee', 'Retainer'], module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Proposal Follow-up', trigger: '3 Days After Sent', actions: ['Follow-up Email'] }
    ],
    dashboard_config: { widgets: ['Active Projects', 'Revenue by Practice Area'] },
    pipeline_stages: [
      { name: 'Initial Contact', probability: 10 },
      { name: 'Proposal Sent', probability: 50 },
      { name: 'Contract Signed', probability: 100 }
    ],
    email_templates: [{ name: 'Proposal Cover Letter', subject: 'Your proposal' }],
    recommended_integrations: ['QuickBooks', 'Xero', 'Asana'],
    compliance_features: ['Client Confidentiality'],
    is_active: true,
    popularity_rank: 4
  },
  {
    industry_name: 'Healthcare & Medical',
    category: 'healthcare',
    description: 'Designed for medical practices and healthcare providers',
    fit_score: 88,
    icon: 'Heart',
    color_scheme: { primary: '#EF4444', secondary: '#EC4899' },
    terminology: { customer: 'Patient', deal: 'Treatment Plan', account: 'Practice' },
    custom_fields: [
      { name: 'Patient ID', type: 'text', module: 'contacts' },
      { name: 'Insurance Provider', type: 'text', module: 'contacts' },
      { name: 'Appointment Date', type: 'date', module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Appointment Reminder', trigger: '24 Hours Before', actions: ['Send SMS'] }
    ],
    dashboard_config: { widgets: ['Today\'s Appointments', 'Patient Volume'] },
    pipeline_stages: [
      { name: 'Referral Received', probability: 10 },
      { name: 'Appointment Scheduled', probability: 50 },
      { name: 'Visit Completed', probability: 100 }
    ],
    email_templates: [{ name: 'Appointment Confirmation', subject: 'Your appointment is confirmed' }],
    recommended_integrations: ['Epic', 'Cerner', 'Athenahealth'],
    compliance_features: ['HIPAA Compliance', 'PHI Protection'],
    is_active: true,
    popularity_rank: 5
  },
  {
    industry_name: 'Non-Profit & Associations',
    category: 'non_profit',
    description: 'Perfect for non-profit organizations and charities',
    fit_score: 94,
    icon: 'Heart',
    color_scheme: { primary: '#F59E0B', secondary: '#EF4444' },
    terminology: { customer: 'Donor', deal: 'Donation', contact: 'Supporter' },
    custom_fields: [
      { name: 'Donor Level', type: 'picklist', options: ['Bronze', 'Silver', 'Gold', 'Platinum'], module: 'contacts' },
      { name: 'Donation Type', type: 'picklist', options: ['One-Time', 'Monthly', 'Annual'], module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Donation Thank You', trigger: 'Donation Received', actions: ['Send Thank You'] }
    ],
    dashboard_config: { widgets: ['Total Donations', 'Donor Retention Rate'] },
    pipeline_stages: [
      { name: 'Prospect', probability: 10 },
      { name: 'Engaged', probability: 50 },
      { name: 'Donor', probability: 100 }
    ],
    email_templates: [{ name: 'Donation Thank You', subject: 'Thank you!' }],
    recommended_integrations: ['PayPal', 'Stripe', 'GoFundMe'],
    compliance_features: ['501(c)(3) Compliance'],
    is_active: true,
    popularity_rank: 6
  },
  {
    industry_name: 'Manufacturing & Distribution',
    category: 'manufacturing',
    description: 'Designed for manufacturers and B2B distributors',
    fit_score: 90,
    icon: 'Factory',
    color_scheme: { primary: '#64748B', secondary: '#0EA5E9' },
    terminology: { customer: 'Customer', deal: 'Order', contact: 'Buyer' },
    custom_fields: [
      { name: 'Order Quantity', type: 'number', module: 'deals' },
      { name: 'Payment Terms', type: 'picklist', options: ['Net 30', 'Net 60', 'COD'], module: 'accounts' }
    ],
    workflow_templates: [
      { name: 'Order Confirmation', trigger: 'Order Placed', actions: ['Send Confirmation'] }
    ],
    dashboard_config: { widgets: ['Order Volume', 'Revenue by Product Line'] },
    pipeline_stages: [
      { name: 'Quote Requested', probability: 10 },
      { name: 'Quote Sent', probability: 25 },
      { name: 'Order Fulfilled', probability: 100 }
    ],
    email_templates: [{ name: 'Quote', subject: 'Your quote' }],
    recommended_integrations: ['SAP', 'Oracle NetSuite', 'QuickBooks'],
    compliance_features: ['Quality Standards'],
    is_active: true,
    popularity_rank: 7
  },
  {
    industry_name: 'Education & Training',
    category: 'education',
    description: 'Perfect for schools and training providers',
    fit_score: 87,
    icon: 'GraduationCap',
    color_scheme: { primary: '#7C3AED', secondary: '#2563EB' },
    terminology: { customer: 'Student', deal: 'Enrollment', contact: 'Applicant' },
    custom_fields: [
      { name: 'Program Name', type: 'text', module: 'deals' },
      { name: 'Tuition Amount', type: 'currency', module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Application Received', trigger: 'Application Submitted', actions: ['Send Confirmation'] }
    ],
    dashboard_config: { widgets: ['Enrollment Numbers', 'Application Pipeline'] },
    pipeline_stages: [
      { name: 'Inquiry', probability: 10 },
      { name: 'Application Submitted', probability: 50 },
      { name: 'Enrolled', probability: 100 }
    ],
    email_templates: [{ name: 'Application Received', subject: 'We received your application' }],
    recommended_integrations: ['Blackboard', 'Canvas', 'Zoom'],
    compliance_features: ['FERPA Compliance'],
    is_active: true,
    popularity_rank: 8
  },
  {
    industry_name: 'Retail & E-Commerce',
    category: 'retail',
    description: 'Designed for online retailers and stores',
    fit_score: 82,
    icon: 'ShoppingCart',
    color_scheme: { primary: '#EC4899', secondary: '#F59E0B' },
    terminology: { customer: 'Customer', deal: 'Order', contact: 'Shopper' },
    custom_fields: [
      { name: 'Order Number', type: 'text', module: 'deals' },
      { name: 'Loyalty Points', type: 'number', module: 'contacts' }
    ],
    workflow_templates: [
      { name: 'Abandoned Cart Recovery', trigger: 'Cart Abandoned', actions: ['Send Reminder'] }
    ],
    dashboard_config: { widgets: ['Sales Today', 'Average Order Value'] },
    pipeline_stages: [
      { name: 'Browsing', probability: 10 },
      { name: 'Cart Added', probability: 30 },
      { name: 'Payment Processed', probability: 100 }
    ],
    email_templates: [{ name: 'Order Confirmation', subject: 'Your order is confirmed!' }],
    recommended_integrations: ['Shopify', 'WooCommerce', 'Stripe'],
    compliance_features: ['PCI Compliance', 'GDPR'],
    is_active: true,
    popularity_rank: 9
  },
  {
    industry_name: 'Hospitality & Travel',
    category: 'hospitality',
    description: 'Perfect for hotels and travel agencies',
    fit_score: 85,
    icon: 'Plane',
    color_scheme: { primary: '#0EA5E9', secondary: '#06B6D4' },
    terminology: { customer: 'Guest', deal: 'Booking', account: 'Property' },
    custom_fields: [
      { name: 'Check-in Date', type: 'date', module: 'deals' },
      { name: 'Room Type', type: 'picklist', options: ['Standard', 'Deluxe', 'Suite'], module: 'deals' }
    ],
    workflow_templates: [
      { name: 'Booking Confirmation', trigger: 'Booking Made', actions: ['Send Confirmation'] }
    ],
    dashboard_config: { widgets: ['Occupancy Rate', 'Revenue Per Room'] },
    pipeline_stages: [
      { name: 'Inquiry', probability: 10 },
      { name: 'Quote Sent', probability: 30 },
      { name: 'Booking Confirmed', probability: 100 }
    ],
    email_templates: [{ name: 'Booking Confirmation', subject: 'Your booking is confirmed' }],
    recommended_integrations: ['Booking.com', 'Expedia', 'Airbnb'],
    compliance_features: ['Payment Card Security'],
    is_active: true,
    popularity_rank: 10
  }
];

async function seedIndustryTemplates() {
  try {
    console.log('🌱 Seeding industry templates...');
    
    for (const template of industryTemplates) {
      await IndustryTemplate.upsert(template, {
        conflictFields: ['industry_name']
      });
      console.log(`✅ Seeded: ${template.industry_name}`);
    }
    
    console.log('✅ Industry templates seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding industry templates:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedIndustryTemplates();
}

module.exports = { industryTemplates, seedIndustryTemplates };
