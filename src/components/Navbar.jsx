import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { notificationService } from '../services/notificationService';
import { NotificationsModal } from './modal/NotificationsModal';

export const Navbar = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl transition-all duration-300">
        <div className="px-6 md:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <img 
                src="/logos/logocrop.svg" 
                alt="RoomMateX Logo" 
                className="w-8 h-8 rounded-full transform group-hover:scale-110 transition-all duration-300"
              />
              <span className="text-lg font-bold tracking-tight transition-all duration-300">
                <span className="text-black group-hover:text-gray-800">Room</span>
                <span className="text-[#4858AF] group-hover:text-[#3d4a8f]">MateX</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Dashboard</Link>
                <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Find Rooms</Link>
                <Link to="/add-room" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">List Room</Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Contact</Link>
              </div>
            )}

            {!user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Home</Link>
                <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Find Rooms</Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 text-sm">Contact</Link>
              </div>
            )}


            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <button
                    onClick={() => setShowNotificationsModal(true)}
                    className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <Link to="/profile" className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 group shadow-sm hover:shadow-md">
                    {user.profile_photo ? (
                      <img 
                        src={getImageUrl(user.profile_photo)} 
                        alt={user.full_name} 
                        className="w-7 h-7 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                        {user.full_name?.[0] || 'U'}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-500 font-medium">Welcome back</p>
                      <p className="text-xs font-bold text-gray-800 -mt-0.5">{user.full_name?.split(' ')[0] || 'User'}</p>
                    </div>
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-black border border-gray-300 px-4 py-1.5 rounded-xl font-semibold hover:bg-red-600 hover:text-white hover:border-gray-300 transition-all shadow-sm text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2.5">
                  <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 rounded-xl">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 font-semibold text-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-2xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Dashboard</Link>
                  <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Find Rooms</Link>
                  <Link to="/add-room" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">List Room</Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Contact</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Home</Link>
                  <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Find Rooms</Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Contact</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={showNotificationsModal} 
        onClose={() => setShowNotificationsModal(false)}
        onUnreadCountChange={fetchUnreadCount}
      />
    </div>
  );
};
