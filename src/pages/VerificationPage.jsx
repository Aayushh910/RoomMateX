import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const VerificationPage = () => {
    const { user, verifyOTP, sendOTP, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action') || 'verify';
    const [step, setStep] = useState(1);
    const [verificationType, setVerificationType] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSendOtp = async (type) => {
        setVerificationType(type);
        setLoading(true);
        setError('');
        
        try {
            if (action === 'verify') {
                const result = await sendOTP('verification');
                if (result.success) {
                    setStep(2);
                } else {
                    setError(result.error || 'Failed to send OTP');
                }
            } else if (action === 'changePassword') {
                // Send OTP for password change
                const result = await sendOTP('password_change');
                if (result.success) {
                    setStep(2);
                } else {
                    setError(result.error || 'Failed to send OTP');
                }
            } else if (action === 'deleteAccount') {
                // Send OTP for account deletion
                const result = await sendOTP('account_delete');
                if (result.success) {
                    setStep(2);
                } else {
                    setError(result.error || 'Failed to send OTP');
                }
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            setError('Please enter a valid OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (action === 'verify') {
                const result = await verifyOTP(otp, 'verification');
                if (result.success) {
                    setStep(3);
                    setTimeout(() => {
                        navigate('/profile');
                    }, 2000);
                } else {
                    setError(result.error || 'Invalid OTP');
                }
            } else if (action === 'changePassword') {
                // Verify OTP for password change, then move to password form
                const result = await verifyOTP(otp, 'password_change');
                if (result.success) {
                    setStep(4); // Move to password change form
                } else {
                    setError(result.error || 'Invalid OTP');
                }
            } else if (action === 'deleteAccount') {
                // Verify OTP for account deletion, then delete account
                const result = await verifyOTP(otp, 'account_delete');
                if (result.success) {
                    // Delete account
                    try {
                        await userService.deleteAccount();
                        setStep(3);
                        setTimeout(() => {
                            authService.logout();
                            navigate('/');
                        }, 2000);
                    } catch (err) {
                        setError(err.response?.data?.detail || 'Failed to delete account');
                    }
                } else {
                    setError(result.error || 'Invalid OTP');
                }
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('Please fill all fields');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            setStep(5);
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (action === 'verify') return 'Verify Your Identity';
        if (action === 'changePassword') return 'Change Password';
        if (action === 'deleteAccount') return 'Delete Account';
        return 'Verification';
    };

    const getDescription = () => {
        if (action === 'verify') return 'Complete the verification process to access all features';
        if (action === 'changePassword') return 'Verify your identity to change your password';
        if (action === 'deleteAccount') return 'Verify your identity to delete your account';
        return '';
    };

    const getSuccessMessage = () => {
        if (action === 'verify') return "You're Verified!";
        if (action === 'deleteAccount') return 'Account Deleted!';
        return 'Verified!';
    };

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-gray-50/50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-6 flex-1 w-full flex items-center">
                <div className="glass-card rounded-2xl shadow-xl w-full overflow-hidden">
                    <div className="grid md:grid-cols-2 min-h-[500px]">
                        {/* Left Side - Information */}
                        <div className={`p-8 text-white flex flex-col justify-center ${
                            action === 'verify' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
                            action === 'changePassword' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                            'bg-gradient-to-br from-red-600 to-rose-700'
                        }`}>
                            <div className="space-y-6">
                                <div>
                                    {action === 'verify' && (
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                    )}
                                    {action === 'changePassword' && (
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                        </div>
                                    )}
                                    {action === 'deleteAccount' && (
                                        <div className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                    )}
                                    <h1 className="text-3xl font-bold mb-3">{getTitle()}</h1>
                                    <p className="text-white/90 text-lg">{getDescription()}</p>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sm font-bold">1</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Choose Method</p>
                                            <p className="text-white/80 text-sm">Select email or phone verification</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sm font-bold">2</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Enter OTP</p>
                                            <p className="text-white/80 text-sm">Verify with the code sent to you</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sm font-bold">3</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Complete</p>
                                            <p className="text-white/80 text-sm">
                                                {action === 'verify' && 'Get verified badge on your profile'}
                                                {action === 'changePassword' && 'Set your new password'}
                                                {action === 'deleteAccount' && 'Confirm account deletion'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="p-8 flex flex-col justify-center">

                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Verification Method </h2>
                                <button
                                    onClick={() => handleSendOtp('email')}
                                    className={`w-full p-4 border-2 border-gray-200 rounded-xl transition-all group ${
                                        action === 'verify' ? 'hover:border-blue-500 hover:bg-blue-50' :
                                        action === 'changePassword' ? 'hover:border-emerald-500 hover:bg-emerald-50' :
                                        'hover:border-red-500 hover:bg-red-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Verify via Email</p>
                                            <p className="text-sm text-gray-500">{user?.email || 'your@email.com'}</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSendOtp('phone')}
                                    className={`w-full p-4 border-2 border-gray-200 rounded-xl transition-all group relative ${
                                        action === 'verify' ? 'hover:border-blue-500 hover:bg-blue-50' :
                                        action === 'changePassword' ? 'hover:border-emerald-500 hover:bg-emerald-50' :
                                        'hover:border-red-500 hover:bg-red-50'
                                    } opacity-60 cursor-not-allowed`}
                                    disabled
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Verify via Phone</p>
                                            <p className="text-sm text-gray-500">{user?.phone || '+91 98765 XXXXX'}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Coming Soon</span>
                                    </div>
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">Phone verification is currently under process. Please use email verification.</p>

                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Enter OTP Code</h2>
                            <div className="text-center mb-4">
                                <p className="text-gray-600 text-sm">We sent an OTP to your {verificationType}</p>
                                <p className="font-bold text-gray-900 mt-1">{verificationType === 'email' ? user?.email : user?.phone || '+91 98765 XXXXX'}</p>
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
                                {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
                                <p className="text-xs text-center text-gray-500 mt-2"></p>
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-bold transition-colors shadow-lg text-white ${
                                    action === 'verify' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' :
                                    action === 'changePassword' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' :
                                    'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Verifying...' : (action === 'deleteAccount' ? 'Verify & Delete Account' : 'Verify & Complete')}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                className={`w-full text-sm text-gray-500 font-medium ${
                                    action === 'verify' ? 'hover:text-blue-600' :
                                    action === 'changePassword' ? 'hover:text-emerald-600' :
                                    'hover:text-red-600'
                                }`}
                            >
                                Change verification method
                            </button>
                        </div>
                    )}

                    {step === 3 && action !== 'changePassword' && (
                        <div className="text-center py-8">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ${
                                action === 'deleteAccount' 
                                    ? 'bg-red-100 text-red-600 shadow-red-200' 
                                    : 'bg-green-100 text-green-600 shadow-green-200'
                            }`}>
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{getSuccessMessage()}</h3>
                            <p className="text-gray-600">
                                {action === 'verify' && 'Your profile now has the blue tick badge.'}
                                {action === 'deleteAccount' && 'Your account has been permanently deleted.'}
                            </p>
                            <p className="text-gray-500 text-sm mt-3">Redirecting to profile...</p>
                        </div>
                    )}

                    {step === 3 && action === 'changePassword' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-green-200 shadow-xl">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h3>
                            <p className="text-gray-600">Now you can change your password.</p>
                        </div>
                    )}

                    {step === 4 && action === 'changePassword' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Set New Password</h2>
                            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => { handlePasswordChange(e); setError(''); }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={(e) => { handlePasswordChange(e); setError(''); }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => { handlePasswordChange(e); setError(''); }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Password must be at least 6 characters long</p>
                            <button
                                onClick={handleChangePassword}
                                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-2"
                            >
                                Change Password
                            </button>
                        </div>
                    )}

                    {step === 5 && action === 'changePassword' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-green-200 shadow-xl">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Changed!</h3>
                            <p className="text-gray-600">Your password has been updated successfully.</p>
                            <p className="text-gray-500 text-sm mt-3">Redirecting to profile...</p>
                        </div>
                    )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
