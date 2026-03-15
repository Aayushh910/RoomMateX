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

  // Get contact requests (removed - feature not implemented)
  getRequests: async () => {
    return [];
  },

  // Get recently viewed properties (removed - feature not implemented)
  getRecentlyViewed: async () => {
    return [];
  },

  // Get total available rooms count
  getTotalRoomsCount: async () => {
    const response = await api.get('/properties?page=1&page_size=1');
    return response.data.total || 0;
  },

  // Get all contact requests (removed - feature not implemented)
  getAllRequests: async () => {
    return [];
  },

  // Accept contact request (removed - feature not implemented)
  acceptRequest: async (requestId) => {
    return { message: 'Feature not available' };
  },

  // Reject contact request (removed - feature not implemented)
  rejectRequest: async (requestId) => {
    return { message: 'Feature not available' };
  },
};
