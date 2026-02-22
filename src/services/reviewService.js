import api from './api';

export const reviewService = {
  // Get reviews for a property
  getPropertyReviews: async (propertyId) => {
    const response = await api.get(`/properties/${propertyId}/reviews`);
    return response.data;
  },

  // Create a review
  createReview: async (propertyId, reviewData) => {
    const response = await api.post(`/properties/${propertyId}/reviews`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
