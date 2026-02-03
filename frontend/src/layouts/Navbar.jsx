import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Info, Star, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
// import {logo} from "../assets/logo.png";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/admin/users', label: 'Users', icon: User },
        { to: '/admin/rooms', label: 'Rooms', icon: Search },
        { to: '/admin/reports', label: 'Reports', icon: Shield },
      ];
    }

    if (user?.role === 'owner') {
      return [
        { to: '/dashboard', label: 'Home', icon: Home },
        { to: '/add-room', label: 'List Room', icon: Search },
        { to: '/info', label: 'Info', icon: Info },
        { to: '/reviews', label: 'Reviews', icon: Star },
      ];
    }

    // seeker
    return [
      { to: '/dashboard', label: 'Home', icon: Home },
      { to: '/rooms', label: 'Find Room', icon: Search },
      { to: '/info', label: 'Info', icon: Info },
      { to: '/reviews', label: 'Reviews', icon: Star },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-dark-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-xl">R</span>
            </div>
            <span className="font-display font-bold text-xl text-dark-900">
              Room<span className="text-primary-600">Mate</span>X
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-dark-700 hover:bg-dark-50 hover:text-primary-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{user?.name || 'Profile'}</span>
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-100 animate-slide-down">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-700 hover:bg-dark-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-700 hover:bg-dark-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-dark-700 hover:bg-dark-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
