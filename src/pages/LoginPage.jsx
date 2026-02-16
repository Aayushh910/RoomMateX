import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setOtpSent(true);
    setResetStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setError('');
      setResetStep(3);
    } else {
      setError('Invalid OTP. Use 1234.');
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setShowForgotPassword(false);
    setResetStep(1);
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setOtpSent(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Demo login - Check for admin and user credentials
    if (formData.email === 'admin@test.com' && formData.password === 'admin123') {
      login({
        id: 'admin1',
        name: 'Admin User',
        email: formData.email,
        role: 'admin',
        phone: '+91 98765 43200',
        city: 'Pune',
        verified: true,
        profilePhoto: null,
        listings: [],
        wishlist: [],
        viewedRooms: [],
      });
      navigate('/admin');
    } else if (formData.email === 'user@test.com' && formData.password === 'password') {
      // Regular user login
      login({
        id: 'user' + Date.now(),
        name: 'Demo User',
        email: formData.email,
        role: 'user',
        phone: '+91 98765 43210',
        city: 'Pune',
        verified: true,
        profilePhoto: null,
        listings: [],
        wishlist: [],
        viewedRooms: [],
      });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden grid lg:grid-cols-2">
      {/* Left Side: Clean Form */}
      <div className="flex items-center justify-center p-4 lg:p-6 bg-gray-50 h-screen overflow-y-auto">
        <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
          {/* Brand/Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group animate-slide-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">RoomMateX</span>
          </Link>

          {/* Form Header */}
          <div className="mb-6 animate-slide-up delay-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-500">Access your RoomMateX dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-slide-up delay-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="animate-slide-up delay-300">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] animate-slide-up delay-400">
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 font-medium animate-slide-up delay-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Sign up</Link>
          </p>



          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-slide-up delay-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-bold text-gray-900">Demo Access</p>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>User: <span className="font-mono text-gray-900">user@test.com</span> / <span className="font-mono text-gray-900">password</span></p>
              <p>Admin: <span className="font-mono text-gray-900">admin@test.com</span> / <span className="font-mono text-gray-900">admin123</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {resetStep === 1 && 'Forgot Password'}
                {resetStep === 2 && 'Enter OTP'}
                {resetStep === 3 && 'Reset Password'}
              </h3>
              <button onClick={() => { setShowForgotPassword(false); setError(''); setResetStep(1); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

            {resetStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Enter your email address and we'll send you an OTP to reset your password.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                    placeholder="you@email.com"
                  />
                </div>
                <button onClick={handleForgotPassword} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                  Send OTP
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">We sent an OTP to</p>
                  <p className="font-bold text-gray-900 mt-1">{forgotEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-center tracking-[1em] font-bold text-2xl"
                    placeholder="0000"
                    maxLength={4}
                  />
                  <p className="text-xs text-center text-gray-500 mt-2">Demo OTP: <strong>1234</strong></p>
                </div>
                <button onClick={handleVerifyOtp} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                  Verify OTP
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Enter your new password</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-2">Password must be at least 6 characters</p>
                </div>
                <button onClick={handleResetPassword} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Side: Themed/Animated Content */}
      <div className="hidden lg:flex relative overflow-hidden bg-gray-900 items-center justify-center p-12 h-screen">
        {/* Landing Page Theme Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px] animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          {/* Floating Boxes */}
          <div className="floating-box w-16 h-16 rounded-lg opacity-20" style={{ left: '15%', animationDuration: '22s', background: 'white' }}></div>
          <div className="floating-box w-24 h-24 rounded-2xl opacity-10" style={{ left: '65%', animationDuration: '28s', background: 'white' }}></div>
          <div className="floating-box w-12 h-12 rounded-md opacity-20" style={{ left: '35%', animationDuration: '20s', background: 'white' }}></div>
          <div className="floating-box w-20 h-20 rounded-xl opacity-10" style={{ left: '85%', animationDuration: '25s', background: 'white' }}></div>
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-sm font-semibold mb-6 backdrop-blur-sm animate-fade-in delay-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Better Together
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight animate-slide-up delay-300">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Living Space</span>
          </h1>

          <p className="text-lg text-gray-400 mb-6 leading-relaxed animate-slide-up delay-400">
            Discover verified rooms and trusted roommates in your city. Safe, simple, and stress-free housing solutions.
          </p>

          <div className="mb-8 animate-slide-up delay-500">
            <h3 className="text-base font-bold text-white mb-3">Why choose RoomMateX?</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Verified Listings & Users
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Secure & Easy Communication
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Smart Matchmaking Features
              </li>
            </ul>
          </div>

          {/* Feature Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in delay-600">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-1">2,800+</div>
              <div className="text-gray-400 font-medium text-sm">Active Users</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-400 font-medium text-sm">Satisfaction</div>
            </div>
          </div>

          {/* Trust Avatars */}
          <div className="flex items-center gap-3 animate-fade-in delay-700">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-gray-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-gray-900" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-gray-900" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" alt="" />
            </div>
            <p className="text-xs text-gray-400 font-medium italic">Join 1,000+ happy residents</p>
          </div>
        </div>
      </div>
    </div>
  );
};
