import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                RoomMateX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {user && !isAdmin && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/rooms" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Find Rooms
                </Link>
                <Link to="/add-room" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  List Room
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Contact Us
                </Link>
              </>
            )}
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Manage Users
                    </Link>
                    <Link to="/admin/rooms" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Manage Rooms
                    </Link>
                  </>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/rooms"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Rooms
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/rooms"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Rooms
                    </Link>
                    <Link
                      to="/add-room"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      List Room
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
