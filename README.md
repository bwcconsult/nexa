# 🚀 Nexa CRM - Enterprise Customer Relationship Management

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</div>

<p align="center">
  <strong>A modern, full-stack CRM system built with React, Node.js, and PostgreSQL</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Nexa CRM is a **production-ready, enterprise-grade CRM** that provides comprehensive customer relationship management capabilities. Built to compete with industry leaders like Salesforce, HubSpot, and Zoho, but with modern UI/UX and more affordable pricing.

### **Key Highlights**

✅ **100% Feature Complete** - All core CRM features implemented  
✅ **Modern UI/UX** - Beautiful, responsive design with dark mode  
✅ **Enterprise Ready** - SSO, RBAC, multi-currency, workflow automation  
✅ **AWS Integrated** - S3, RDS, SES, ElastiCache ready  
✅ **Production Tested** - Security, logging, monitoring built-in  

---

## ⚡ Features

### **Core CRM**
- 📊 **Lead Management** - Capture, score, and convert leads
- 👥 **Contact Management** - Complete customer profiles
- 🏢 **Account Management** - Company & organization tracking
- 💰 **Deal Pipeline** - Visual sales pipeline with drag-and-drop
- ✅ **Task Management** - Kanban-style task tracking
- 📅 **Meeting Scheduling** - Calendar integration
- 📞 **Call Logging** - Track all customer interactions

### **Advanced Features**
- 🎨 **Custom Fields** - Add custom fields to any entity
- 📧 **Mass Email Campaigns** - Bulk email with templates
- 📈 **Advanced Reports** - Drag-and-drop report builder
- ⚙️ **Workflow Automation** - Visual automation builder
- 🔐 **SSO/SAML** - Enterprise authentication
- 💱 **Multi-Currency** - 150+ currencies supported
- 🔗 **Link Analytics** - Track link clicks (unique feature)

### **Enterprise**
- 👔 **Role-Based Access Control** - 4 roles (admin, manager, sales_rep, support)
- 👥 **Team Management** - Collaborate with your team
- 📊 **Analytics Dashboard** - Real-time insights
- 📄 **Document Management** - AWS S3 integration
- 🎫 **Support Tickets** - Customer support system
- 💳 **Invoicing** - Invoice generation and tracking

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 18** - UI library
- ⚡ **Vite** - Build tool
- 🎨 **TailwindCSS** - Styling
- 🧩 **shadcn/ui** - Component library
- 🎭 **Framer Motion** - Animations
- 📊 **Recharts** - Data visualization
- 🔄 **React Router v7** - Routing

### **Backend**
- 🟢 **Node.js 18+** - Runtime
- 🚂 **Express.js** - Web framework
- 🐘 **PostgreSQL** - Database
- 🔄 **Sequelize ORM** - Database ORM
- 🔐 **JWT** - Authentication
- 🛡️ **Helmet** - Security
- ☁️ **AWS Services** - S3, SES, RDS, ElastiCache

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm 9+
- PostgreSQL 12+
- Git

### **1. Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/nexa-crm.git
cd nexa-crm
```

### **2. Frontend Setup**

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your settings
# VITE_API_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### **3. Backend Setup**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials and secrets

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### **4. Access the Application**

Open your browser to `http://localhost:5173` and register a new account!

---

## 🌐 Deployment

### **Recommended Deployment Strategy**

- **Frontend**: [Netlify](https://netlify.com) - Free tier available
- **Backend**: [Railway](https://railway.app) - Easy PostgreSQL integration

### **Frontend - Netlify**

1. Push your code to GitHub
2. Connect repository to Netlify
3. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = Your Railway backend URL
5. Deploy!

See `netlify.toml` for configuration.

### **Backend - Railway**

1. Push your code to GitHub
2. Connect repository to Railway
3. Set root directory to `/backend`
4. Add PostgreSQL database
5. Configure environment variables (see backend/.env.example)
6. Deploy!

See `backend/railway.toml` for configuration.

**Detailed deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📁 Project Structure

```
nexa-crm/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── services/           # Business logic
│   ├── server.js           # Entry point
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── api/                # API client
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── netlify.toml           # Netlify config
├── package.json           # Frontend dependencies
└── README.md
```

---

## 📚 Documentation

- **[API Documentation](./backend/README.md)** - Complete API reference
- **[Backend Setup](./backend/docs/SETUP.md)** - Detailed backend setup
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[Feature Documentation](./100_PERCENT_COMPLETE.md)** - Complete feature list
- **[Migration Guide](./BACKEND_MIGRATION_GUIDE.md)** - Database migrations

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check our [docs folder](./docs/)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/nexa-crm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/nexa-crm/discussions)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">
  <strong>Built with ❤️ by the Nexa Team</strong>
</div>