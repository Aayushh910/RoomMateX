import api from './api';

export const dashboardService = {
  // Get dashboard summary
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  // Get recommended properties
  getRecommended: async () => {
    const response = await api.get('/dashboard/recommended');
    return response.data;
  },

  // Get user's wishlist
  getWishlist: async () => {
    const response = await api.get('/dashboard/wishlist');
    return response.data;
  },

  // Get user's listings
  getMyListings: async () => {
    const response = await api.get('/dashboard/my-listings');
    return response.data;
  },

  // Get contact requests
  getRequests: async () => {
    const response = await api.get('/dashboard/requests');
    return response.data;
  },

  // Get recently viewed properties
  getRecentlyViewed: async () => {
    const response = await api.get('/dashboard/recently-viewed');
    return response.data;
  },

  // Get total available rooms count
  getTotalRoomsCount: async () => {
    const response = await api.get('/properties?page=1&page_size=1');
    return response.data.total || 0;
  },

  // Get all contact requests (including accepted/rejected) for modal
  getAllRequests: async () => {
    const response = await api.get('/dashboard/all-requests');
    return response.data;
  },

  // Accept contact request
  acceptRequest: async (requestId) => {
    const response = await api.post(`/dashboard/requests/${requestId}/accept`);
    return response.data;
  },

  // Reject contact request
  rejectRequest: async (requestId) => {
    const response = await api.post(`/dashboard/requests/${requestId}/reject`);
    return response.data;
  },
};
