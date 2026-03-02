import api from './api';

export const adminService = {
  // Admin login (separate from user login)
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    
    // Store admin tokens and flag
    localStorage.setItem('admin_access_token', response.data.access_token);
    localStorage.setItem('admin_refresh_token', response.data.refresh_token);
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
    
    return response.data;
  },

  // Verify admin token
  verifyAdmin: async () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) return false;
    
    try {
      const response = await api.get('/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  // Get admin dashboard stats
  getStats: async () => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get('/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get analytics overview with charts data
  getAnalytics: async () => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get('/admin/analytics/overview', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get all users
  getUsers: async (page = 1, pageSize = 20, filters = {}) => {
    const token = localStorage.getItem('admin_access_token');
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...filters
    });
    const response = await api.get(`/admin/users?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Block/unblock user
  blockUser: async (userId) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.put(`/admin/users/${userId}/block`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get all properties
  getProperties: async (page = 1, pageSize = 20, filters = {}) => {
    const token = localStorage.getItem('admin_access_token');
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...filters
    });
    const response = await api.get(`/admin/properties?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get property details
  getPropertyDetails: async (propertyId) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get(`/admin/properties/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Toggle property active status
  togglePropertyActive: async (propertyId) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.put(`/admin/properties/${propertyId}/toggle-active`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get all reports
  getReports: async (page = 1, pageSize = 20) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get(`/admin/reports?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get all contact requests
  getContactRequests: async (page = 1, pageSize = 20) => {
    const token = localStorage.getItem('admin_access_token');
    const response = await api.get(`/admin/contact-requests?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Update report status
  updateReportStatus: async (reportId, status, adminNotice = null) => {
    const token = localStorage.getItem('admin_access_token');
    const params = new URLSearchParams({ status });
    if (adminNotice) {
      params.append('admin_notice', adminNotice);
    }
    const response = await api.put(`/admin/reports/${reportId}/status?${params}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Admin logout
  logout: () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('admin_data');
  },

  // Check if user is admin
  isAdmin: () => {
    return localStorage.getItem('isAdmin') === 'true';
  },

  // Get admin data
  getAdminData: () => {
    const data = localStorage.getItem('admin_data');
    return data ? JSON.parse(data) : null;
  }
};
