import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GUJARAT_CITIES } from '../constants/cities';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: '',
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.city || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('Please agree to Terms and Conditions');
      return;
    }

    setLoading(true);

    const result = await signup({
      fullName: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      role: formData.role === 'Room Seeker' ? 'room_seeker' : 'room_owner',
    });

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden grid lg:grid-cols-2">
      {/* Left Side: Themed/Animated Content & Benefits */}
      <div className="hidden lg:flex relative overflow-hidden bg-gray-900 items-center justify-center p-16 h-screen">
        {/* Simplified Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group animate-slide-up">
            <img 
              src="/logos/logocrop.png" 
              alt="RoomMateX Logo" 
              className="w-10 h-10 rounded-[16px] transform group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Room</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">MateX</span>
            </span>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight animate-slide-up delay-100">
            Join Our Trusted
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Community</span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed animate-slide-up delay-200">
            Create an account to unlock full access to verified rooms and roommates.
          </p>

          <div className="space-y-6 animate-fade-in delay-300">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Verified Community</h3>
                <p className="text-gray-400 text-sm">Every member is verified for security and trust.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Direct Communication</h3>
                <p className="text-gray-400 text-sm">Connect directly with room owners and seekers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Smart Listings</h3>
                <p className="text-gray-400 text-sm">Advanced filters to find exactly what you need.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-3 lg:p-4 bg-gray-50 h-screen overflow-y-auto">
        <div className="w-full max-w-md bg-white p-5 rounded-3xl border border-gray-200 shadow-xl">
          <div className="lg:hidden mb-4">
            <Link to="/" className="inline-flex items-center gap-2 group animate-slide-up">
              <img 
                src="/logos/transparent.png" 
                alt="RoomMateX Logo" 
                className="w-10 h-10 rounded-full transform group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                <span className="text-black">Room</span>
                <span className="text-[#4858AF]">MateX</span>
              </span>
            </Link>
          </div>

          <div className="mb-4 animate-slide-up delay-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5 animate-slide-up delay-200">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) setFormData({ ...formData, phone: value });
                  }}
                />
              </div>
            </div>

            <div className="animate-slide-up delay-300">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 pr-10 py-2 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <select
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium text-sm"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">Select City</option>
                {GUJARAT_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="animate-slide-up delay-400">
              <label className="block text-xs font-semibold text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Room Seeker' })}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.role === 'Room Seeker' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <svg className={`w-6 h-6 mb-1 ${formData.role === 'Room Seeker' ? 'text-primary-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className={`text-xs font-bold ${formData.role === 'Room Seeker' ? 'text-primary-700' : 'text-gray-600'}`}>Room Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Room Owner' })}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.role === 'Room Owner' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <svg className={`w-6 h-6 mb-1 ${formData.role === 'Room Owner' ? 'text-primary-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className={`text-xs font-bold ${formData.role === 'Room Owner' ? 'text-primary-700' : 'text-gray-600'}`}>Room Owner</span>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 py-1 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                I agree to the <a href="#" className="font-bold text-gray-900 border-b border-gray-200 hover:border-primary-500">Terms</a> and <a href="#" className="font-bold text-gray-900 border-b border-gray-200 hover:border-primary-500">Privacy Policy</a>
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] animate-slide-up delay-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-500 font-medium animate-slide-up delay-700 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
