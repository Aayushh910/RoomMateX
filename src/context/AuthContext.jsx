import { createContext, useContext, useState, useEffect } from 'react';

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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('roomatex_user', JSON.stringify(userData));
  };

  const signup = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: 'user',
      verified: false,
      profilePhoto: null,
      listings: [],
      wishlist: [],
      viewedRooms: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('roomatex_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roomatex_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('roomatex_user', JSON.stringify(updatedUser));
  };

  const addToWishlist = (roomId) => {
    const wishlist = user.wishlist || [];
    if (!wishlist.includes(roomId)) {
      updateUser({ wishlist: [...wishlist, roomId] });
    }
  };

  const removeFromWishlist = (roomId) => {
    const wishlist = user.wishlist || [];
    updateUser({ wishlist: wishlist.filter(id => id !== roomId) });
  };

  const addViewedRoom = (roomId) => {
    const viewedRooms = user.viewedRooms || [];
    if (!viewedRooms.includes(roomId)) {
      const updated = [roomId, ...viewedRooms].slice(0, 10); // Keep last 10
      updateUser({ viewedRooms: updated });
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    addToWishlist,
    removeFromWishlist,
    addViewedRoom,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
