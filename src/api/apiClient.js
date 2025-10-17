/**
 * Nexa CRM API Client
 * Replaces Base44 SDK with custom AWS-backed API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
const apiClient = new APIClient();

// Authentication API
export const AuthAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/update-profile', data),
  updatePassword: (data) => apiClient.put('/auth/update-password', data),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post(`/auth/reset-password/${token}`, { password }),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh-token', { refreshToken }),
};

// Entity Base Class
class EntityAPI {
  constructor(entityName) {
    this.entityName = entityName;
    this.endpoint = `/${entityName.toLowerCase()}s`;
  }

  async list(sort = '-created_at', limit = 1000, filters = {}) {
    const params = {
      sort,
      limit,
      ...filters,
    };
    const response = await apiClient.get(this.endpoint, params);
    return response.data;
  }

  async get(id) {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(this.endpoint, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  async search(query, filters = {}) {
    const params = { search: query, ...filters };
    const response = await apiClient.get(this.endpoint, params);
    return response.data;
  }
}

// Export all entity APIs
export const Lead = new EntityAPI('Lead');
export const Contact = new EntityAPI('Contact');
export const Account = new EntityAPI('Account');
export const Deal = new EntityAPI('Deal');
export const Task = new EntityAPI('Task');
export const Meeting = new EntityAPI('Meeting');
export const Call = new EntityAPI('Call');
export const Activity = new EntityAPI('Activity');
export const Customer = new EntityAPI('Customer');
export const Product = new EntityAPI('Product');
export const Order = new EntityAPI('Order');
export const Campaign = new EntityAPI('Campaign');
export const Supplier = new EntityAPI('Supplier');
export const Invoice = new EntityAPI('Invoice');
export const Ticket = new EntityAPI('Ticket');
export const LinkAnalytics = new EntityAPI('LinkAnalytics');
export const Email = new EntityAPI('Email');
export const Document = new EntityAPI('Document');
export const Workflow = new EntityAPI('Workflow');

// User API (special case)
export const User = {
  ...new EntityAPI('User'),
  me: () => AuthAPI.me(),
};

// File Upload API
export const FileAPI = {
  async upload(file, folder = 'documents') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = apiClient.getToken();
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.data;
  },
};

// Email API
export const EmailAPI = {
  send: (data) => apiClient.post('/emails/send', data),
  getTemplates: () => apiClient.get('/emails/templates'),
};

// Analytics API
export const AnalyticsAPI = {
  getDashboard: (timeRange = '30d') => apiClient.get('/analytics/dashboard', { range: timeRange }),
  getRevenue: (timeRange = '30d') => apiClient.get('/analytics/revenue', { range: timeRange }),
  getPipeline: () => apiClient.get('/analytics/pipeline'),
  getLeadSources: () => apiClient.get('/analytics/lead-sources'),
  getConversionFunnel: () => apiClient.get('/analytics/conversion-funnel'),
};

export default apiClient;
