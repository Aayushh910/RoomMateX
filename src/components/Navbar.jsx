import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const Navbar = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
      <nav className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-white/50 dark:border-slate-800 rounded-2xl transition-all duration-300">
        <div className="px-6 md:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-indigo-500/40">
                <svg className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300">
                RoomMateX
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/dashboard" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Dashboard</Link>
                <Link to="/rooms" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Find Rooms</Link>
                <Link to="/add-room" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">List Room</Link>
                <Link to="/contact" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Contact</Link>
              </div>
            )}

            {!user && (
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Home</Link>
                <Link to="/rooms" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Find Rooms</Link>
                <Link to="/contact" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-300 text-sm hover:scale-110 hover:-translate-y-1">Contact</Link>
              </div>
            )}


            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 border border-primary-200 hover:border-primary-300 transition-all duration-300 group shadow-sm hover:shadow-md">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-500 font-medium">Welcome back</p>
                      <p className="text-sm font-bold text-gray-900 -mt-0.5">{user.name?.split(' ')[0] || 'User'}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-gray-700 border-2 border-gray-100 px-5 py-2 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium text-sm transition-all duration-300 hover:bg-gray-50 rounded-lg transform hover:scale-105">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 font-medium text-sm transform hover:-translate-y-1 hover:scale-105">
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
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Dashboard</Link>
                  <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Find Rooms</Link>
                  <Link to="/add-room" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">List Room</Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Contact</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Home</Link>
                  <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Find Rooms</Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Contact</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};
