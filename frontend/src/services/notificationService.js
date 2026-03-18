import api from './api';

export const notificationService = {
  // Get all user's reports with admin responses (as reporter)
  getMyReports: async () => {
    const response = await api.get('/notifications/my-reports');
    return response.data;
  },

  // Get all reports on user's properties (as owner)
  getOwnerReports: async () => {
    const response = await api.get('/notifications/owner-reports');
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark a specific notification as read (reporter)
  markAsRead: async (reportId) => {
    const response = await api.post(`/notifications/mark-as-read/${reportId}`);
    return response.data;
  },

  // Mark a specific notification as read (owner)
  markOwnerAsRead: async (reportId) => {
    const response = await api.post(`/notifications/mark-owner-as-read/${reportId}`);
    return response.data;
  },

  // Mark all notifications as read (reporter)
  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-all-as-read');
    return response.data;
  },

  // Mark all owner notifications as read
  markAllOwnerAsRead: async () => {
    const response = await api.post('/notifications/mark-all-owner-as-read');
    return response.data;
  },
};
