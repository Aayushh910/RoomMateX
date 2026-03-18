import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      full_name: userData.fullName,
      phone_number: userData.phone,
      city: userData.city || 'Not Specified',
      role: userData.role || 'user',
    });
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    const { access_token, refresh_token, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('roomatex_user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('roomatex_user');
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    const { access_token, user } = response.data;
    
    // Update tokens and user data
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('roomatex_user', JSON.stringify(user));
    
    return response.data;
  },

  // Send OTP for various purposes
  sendOTP: async (purpose = 'verification') => {
    const response = await api.post(`/auth/send-otp?purpose=${purpose}`);
    return response.data;
  },

  // Verify OTP for various purposes
  verifyOTP: async (otp, purpose = 'verification') => {
    const response = await api.post(`/auth/verify-otp?purpose=${purpose}`, { otp });
    return response.data;
  },

  // Change password (requires OTP verification first)
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with OTP
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      email,
      otp,
      new_password: newPassword,
    });
    return response.data;
  },
};
