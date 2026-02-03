import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    // Demo login - in real app, this would validate against backend
    const demoUsers = {
      'seeker@test.com': { role: 'seeker', name: 'Rahul Kumar', verified: true },
      'owner@test.com': { role: 'owner', name: 'Priya Sharma', verified: true },
      'admin@test.com': { role: 'admin', name: 'Admin User', verified: true },
    };

    const user = demoUsers[formData.email];
    if (user && formData.password === 'password') {
      login({ ...user, email: formData.email, id: Date.now().toString() });
      setAlert({ type: 'success', message: 'Login successful!' });
      setTimeout(() => navigate('/dashboard'), 500);
    } else {
      setAlert({ type: 'error', message: 'Invalid credentials. Use seeker@test.com / owner@test.com / admin@test.com with password: password' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-2xl">R</span>
              </div>
              <span className="font-display font-bold text-2xl text-dark-900">
                Room<span className="text-primary-600">Mate</span>X
              </span>
            </Link>
            <h1 className="text-4xl font-display font-bold text-dark-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-dark-600">
              Sign in to continue to your account
            </p>
          </div>

          {alert && (
            <div className="mb-6">
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-dark-300" />
                <span className="text-sm text-dark-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-800">
              Seeker: seeker@test.com<br />
              Owner: owner@test.com<br />
              Admin: admin@test.com<br />
              Password: password
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="relative h-full flex flex-col justify-center p-12 text-white">
          <h2 className="text-5xl font-display font-bold mb-6">
            Find Your Perfect Living Space
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who found their ideal room and roommates through our platform.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <span className="text-lg">Verified listings and users</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <span className="text-lg">Safe and secure platform</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <span className="text-lg">Trusted by 2,800+ users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
