import api from './api';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add property to wishlist
  addToWishlist: async (propertyId) => {
    const response = await api.post(`/wishlist/${propertyId}`);
    return response.data;
  },

  // Remove property from wishlist
  removeFromWishlist: async (propertyId) => {
    const response = await api.delete(`/wishlist/${propertyId}`);
    return response.data;
  },

  // Check if property is in wishlist
  isInWishlist: async (propertyId) => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.some(item => item.property_id === propertyId);
    } catch (error) {
      return false;
    }
  },
};
