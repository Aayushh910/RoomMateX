import api from './api';

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', {
      occupation: userData.occupation,
      age: userData.age,
      bio: userData.bio,
      city: userData.city,
      phone_number: userData.phone_number,
      // Preference fields
      gender_preference: userData.gender_preference,
      budget_min: userData.budget_min,
      budget_max: userData.budget_max,
      lifestyle: userData.lifestyle,
      interests: userData.interests,
    });
    
    // Update localStorage with new user data
    localStorage.setItem('roomatex_user', JSON.stringify(response.data));
    
    return response.data;
  },

  // Delete user account (requires OTP verification first)
  deleteAccount: async () => {
    const response = await api.delete('/users/delete-account');
    return response.data;
  },

  // Upload profile photo
  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/upload-profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Update localStorage with new user data
    localStorage.setItem('roomatex_user', JSON.stringify(response.data));
    
    return response.data;
  },
};
