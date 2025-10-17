# Nexa CRM Backend - AWS Ready

Production-ready Node.js/Express backend for Nexa CRM with full AWS integration.

## 🏗️ Architecture

```
Backend (Node.js + Express)
├── AWS RDS (PostgreSQL) - Database
├── AWS ElastiCache (Redis) - Caching
├── AWS S3 - File Storage
├── AWS SES - Email Service
├── AWS Cognito - Authentication (Optional)
└── AWS CloudWatch - Logging & Monitoring
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your AWS credentials and database settings.

### 3. Run Database Migrations

```bash
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📊 Database Models

All entities are fully implemented with Sequelize ORM:

- ✅ **User** - Authentication & team management
- ✅ **Lead** - Lead management with scoring
- ✅ **Contact** - Customer contacts
- ✅ **Account** - Company accounts
- ✅ **Deal** - Sales pipeline
- ✅ **Task** - Task management
- ✅ **Meeting** - Calendar & scheduling
- ✅ **Call** - Call logging
- ✅ **Activity** - Activity timeline
- ✅ **Customer** - Customer lifecycle
- ✅ **Product** - Product catalog
- ✅ **Order** - Order processing
- ✅ **Campaign** - Marketing campaigns
- ✅ **Supplier** - Supplier management
- ✅ **Invoice** - Invoicing system
- ✅ **Ticket** - Support tickets
- ✅ **LinkAnalytics** - Link tracking
- ✅ **Email** - Email tracking
- ✅ **Document** - File management
- ✅ **Workflow** - Automation workflows

## 🔐 Authentication

JWT-based authentication with:
- User registration/login
- Password hashing (bcrypt)
- Token refresh
- Role-based access control (RBAC)
- Password reset via email

### Roles

- **admin** - Full system access
- **manager** - Team & pipeline management
- **sales_rep** - Own leads & deals
- **support** - Customer support access

## 🌐 API Endpoints

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
GET    /api/v1/auth/me
PUT    /api/v1/auth/update-password
PUT    /api/v1/auth/update-profile
```

### Leads
```
GET    /api/v1/leads
POST   /api/v1/leads
GET    /api/v1/leads/:id
PUT    /api/v1/leads/:id
DELETE /api/v1/leads/:id
POST   /api/v1/leads/:id/convert
PUT    /api/v1/leads/:id/assign
GET    /api/v1/leads/stats/overview
```

### Contacts, Accounts, Deals, etc.
Similar CRUD patterns for all entities.

## 🔧 AWS Services Integration

### 1. AWS RDS (PostgreSQL)

```javascript
DB_HOST=your-rds-instance.amazonaws.com
DB_PORT=5432
DB_NAME=nexa_crm
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true
```

### 2. AWS S3 (File Storage)

```javascript
const { uploadFile } = require('./services/s3Service');

// Upload file
const result = await uploadFile(
  fileBuffer,
  'document.pdf',
  'documents',
  'application/pdf'
);
// Returns: { key, url, bucket }
```

### 3. AWS SES (Email)

```javascript
const { sendEmail } = require('./services/emailService');

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<h1>Welcome to Nexa CRM</h1>',
});
```

### 4. AWS ElastiCache (Redis)

```javascript
REDIS_HOST=your-elasticache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

## 📦 Deployment to AWS

### Option 1: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create nexa-crm-prod

# Deploy
eb deploy
```

### Option 2: AWS EC2

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@your-instance

# Clone repo
git clone your-repo

# Install dependencies
cd backend
npm install

# Set up PM2
npm install -g pm2
pm2 start server.js --name nexa-crm

# Set up Nginx reverse proxy
sudo yum install nginx
# Configure nginx.conf (see docs)
```

### Option 3: AWS ECS (Docker)

```bash
# Build Docker image
docker build -t nexa-crm-backend .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-ecr-url
docker tag nexa-crm-backend:latest your-ecr-url/nexa-crm-backend:latest
docker push your-ecr-url/nexa-crm-backend:latest

# Deploy to ECS (create task definition & service)
```

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

See `.env.example` for all required variables:

- Database (RDS)
- Redis (ElastiCache)
- AWS credentials
- S3 bucket
- SES email
- JWT secrets
- CORS origins
- Rate limiting

## 🔒 Security Features

- ✅ Helmet.js for HTTP headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ SQL injection protection (Sequelize)
- ✅ XSS protection
- ✅ Request logging

## 📊 Monitoring

### AWS CloudWatch

Logs are automatically sent to CloudWatch when deployed on AWS.

### Health Check

```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "v1"
}
```

## 🐛 Debugging

Development mode includes:
- Detailed error messages
- Stack traces
- Request logging
- Database query logging

## 📚 Additional Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [AWS Setup Guide](./docs/AWS_SETUP.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Proprietary - Nexa CRM

## 🆘 Support

For issues or questions, contact: support@yourcrm.com
