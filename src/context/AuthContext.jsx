import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('roomatex_user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Optionally fetch fresh user data
      refreshUser();
    }
    setLoading(false);
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('roomatex_user', JSON.stringify(userData));
    } catch (error) {
      // If token is invalid, clear storage
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (credentials) => {
    try {
      const { user: userData } = await authService.login(credentials);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.register(userData);
      // After registration, automatically login
      const loginResult = await login({
        email: userData.email,
        password: userData.password,
      });
      return loginResult;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (updates) => {
    try {
      const updatedUser = await userService.updateProfile(updates);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.detail || 'Update failed';
      return { success: false, error: message };
    }
  };

  const sendOTP = async (purpose = 'verification') => {
    try {
      await authService.sendOTP(purpose);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to send OTP';
      return { success: false, error: message };
    }
  };

  const verifyOTP = async (otp, purpose = 'verification') => {
    try {
      await authService.verifyOTP(otp, purpose);
      // Refresh user data to get updated verification status
      if (purpose === 'verification') {
        await refreshUser();
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'OTP verification failed';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    updateUser,
    sendOTP,
    verifyOTP,
    refreshUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVerified: user?.is_verified || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
