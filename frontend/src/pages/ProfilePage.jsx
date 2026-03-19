import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { GUJARAT_CITIES } from '../constants/cities';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { getImageUrl } from '../utils/imageUtils';
import { ImageCropModal } from '../components/modal/ImageCropModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { checkProfileCompleteness } from '../utils/profileUtils';

export const ProfilePage = () => {
    const { user, updateUser, setUser } = useAuth();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [listingsCount, setListingsCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoadingCounts, setIsLoadingCounts] = useState(true);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [profileCompleteness, setProfileCompleteness] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    


    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        occupation: '',
        about: '',
        gender: '',
        age: '',
        budgetMin: '',
        budgetMax: '',
        lifestyle: [],
        interests: []
    });

    // Initialize form data from user context
    useEffect(() => {
        if (user) {
            // Helper function to safely parse JSON
            const safeJSONParse = (str, defaultValue = []) => {
                try {
                    return str ? JSON.parse(str) : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            };

            setFormData({
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
                city: user.city || '',
                occupation: user.occupation || '',
                about: user.bio || '',
                gender: user.gender_preference || '',
                age: user.age || '',
                budgetMin: user.budget_min || '',
                budgetMax: user.budget_max || '',
                lifestyle: safeJSONParse(user.lifestyle, []),
                interests: safeJSONParse(user.interests, [])
            });
        }
    }, [user]);

    // Fetch listings and wishlist counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                setIsLoadingCounts(true);
                const summary = await dashboardService.getSummary();
                setListingsCount(summary.my_listings_count || 0);
                setWishlistCount(summary.wishlist_count || 0);
            } catch (error) {
                // Silently handle count fetch errors
            } finally {
                setIsLoadingCounts(false);
            }
        };

        if (user) {
            fetchCounts();
        }
    }, [user]);

    // Check profile completeness
    useEffect(() => {
        if (user) {
            const completeness = checkProfileCompleteness(user);
            setProfileCompleteness(completeness);
        }
    }, [user, formData]); // Re-check when user or form data changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (category, item) => {
        setFormData(prev => {
            const list = prev[category] || [];
            if (list.includes(item)) {
                return { ...prev, [category]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [category]: [...list, item] };
            }
        });
    };

    const handleSave = async () => {
        if (isSaving) return; // Prevent multiple saves
        
        try {
            setIsSaving(true);
            
            // Construct the updates object
            const updates = {
                occupation: formData.occupation,
                age: formData.age ? parseInt(formData.age) : null,
                bio: formData.about,
                city: formData.city,
                phone_number: formData.phone,
                // Preference fields
                gender_preference: formData.gender || null,
                budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
                budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
                lifestyle: JSON.stringify(formData.lifestyle || []),
                interests: JSON.stringify(formData.interests || [])
            };

            const result = await updateUser(updates);
            
            if (result.success) {
                setIsEditing(false);
                setJustSaved(true);
                showSuccess('Profile updated successfully! Click "Edit Profile" to make more changes.');

                // Reset the justSaved state after 3 seconds
                setTimeout(() => setJustSaved(false), 3000);
            } else {
                // Show error
                showError(result.error || 'Failed to update profile. Please try again.');
            }
        } catch (error) {
            // Handle unexpected errors
            showError('An unexpected error occurred while updating profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Verification Handler
    const handleVerifyClick = () => {
        navigate('/verification?action=verify');
    };

    // Change Password Handler
    const handlePasswordClick = () => {
        navigate('/verification?action=changePassword');
    };

    // Delete Account Handler
    const handleDeleteClick = () => {
        navigate('/verification?action=deleteAccount');
    };

    // Profile Photo Upload Handler
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError('Please upload a valid image file (JPG, JPEG, or PNG)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB');
            return;
        }

        // Read file and show crop modal
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
        
        // Reset file input
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob) => {
        try {
            setShowCropModal(false);
            setIsUploadingPhoto(true);
            
            // Convert blob to file
            const croppedFile = new File([croppedBlob], 'profile-photo.jpg', {
                type: 'image/jpeg',
            });
            
            const updatedUser = await userService.uploadProfilePhoto(croppedFile);
            setUser(updatedUser);
        } catch (error) {
            showError(error.response?.data?.detail || 'Failed to upload profile photo');
        } finally {
            setIsUploadingPhoto(false);
            setSelectedImage(null);
        }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setSelectedImage(null);
    };

    const lifestyleOptions = ['Non-smoker', 'Early Riser', 'Night Owl', 'Pet Friendly', 'Vegetarian', 'Vegan', 'Clean', 'Social', 'Introvert'];
    const interestOptions = ['Reading', 'Gaming', 'Music', 'Cooking', 'Travel', 'Fitness', 'Art', 'Movies', 'Tech', 'Outdoors'];

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 w-full flex-1 overflow-hidden" style={{paddingTop: '88px'}}>
                <div className="flex flex-col md:flex-row gap-8 h-full py-6">

                    {/* Left Sidebar: Profile Card */}
                    <div className="md:w-1/3 flex flex-col overflow-y-auto">
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            <div className="relative inline-block mb-4">
                                <div 
                                    onClick={handlePhotoClick}
                                    className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg mx-auto overflow-hidden relative group cursor-pointer"
                                >
                                    {isUploadingPhoto ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <LoadingSpinner size="md" />
                                        </div>
                                    ) : user?.profile_photo ? (
                                        <img src={getImageUrl(user.profile_photo)} alt={user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-indigo-100 text-primary-600 text-4xl font-bold">
                                            {user?.full_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                </div>
                                {user?.is_verified && (
                                    <div className="absolute bottom-1 right-1/2 translate-x-12 bg-blue-500 text-white p-1.5 rounded-full shadow-md border-2 border-white" title="Verified User">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.full_name}</h2>
                            <p className="text-gray-500 mb-4">{user?.city || 'No Location Set'}</p>

                            {!user?.is_verified ? (
                                <div className="space-y-3 mb-4">
                                    {profileCompleteness && !profileCompleteness.isComplete && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-semibold text-amber-800">Complete profile to verify</span>
                                            </div>
                                            <div className="w-full bg-amber-200 rounded-full h-1.5 mb-2">
                                                <div 
                                                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-300" 
                                                    style={{ width: `${profileCompleteness.completionPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-amber-700">
                                                {profileCompleteness.completionPercentage}% complete - {profileCompleteness.missingFields.length} fields missing
                                            </p>
                                        </div>
                                    )}
                                    <button 
                                        onClick={handleVerifyClick} 
                                        disabled={profileCompleteness && !profileCompleteness.isComplete}
                                        className={`w-full py-2.5 rounded-xl font-bold shadow-lg transition-all text-sm ${
                                            profileCompleteness && !profileCompleteness.isComplete
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-300/20'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {profileCompleteness && !profileCompleteness.isComplete ? 'Complete Profile First' : 'Verify Identity'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="w-full py-2.5 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200 text-sm flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Identity Verified
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    <span className="block font-bold text-xl text-gray-900">
                                        {isLoadingCounts ? '...' : listingsCount}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium uppercase">Listings</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-xl text-gray-900">
                                        {isLoadingCounts ? '...' : wishlistCount}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium uppercase">Wishlisted</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mt-6 space-y-3">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="w-full py-2.5 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 hover:border-primary-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    Preview Profile
                                </button>
                                <button
                                    onClick={handlePasswordClick}
                                    className="w-full py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                    Change Password
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Tabs & Forms */}
                    <div className="md:w-2/3 flex flex-col overflow-hidden">
                        <div className="glass-card rounded-2xl overflow-hidden flex flex-col flex-1">
                            {/* Tab Headers */}
                            <div className="flex border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={`flex-1 py-4 text-sm font-bold text-center capitalize transition-all relative ${activeTab === 'personal' ? 'text-primary-600 bg-primary-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Personal
                                    {activeTab === 'personal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
                                </button>
                                <div className="flex-1 relative group">
                                    <button
                                        onClick={() => setActiveTab('preferences')}
                                        className={`w-full py-4 text-sm font-bold text-center capitalize transition-all relative ${activeTab === 'preferences' ? 'text-primary-600 bg-primary-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Preferences
                                        {activeTab === 'preferences' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
                                        {activeTab !== 'preferences' && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-600 animate-pulse">✨ Fill me</span>
                                        )}
                                    </button>
                                    {activeTab !== 'preferences' && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            <p className="font-semibold mb-0.5">Make your profile attractive! ✨</p>
                                            <p className="text-gray-300">Profiles with preferences get 3x more matches. Add your lifestyle & interests!</p>
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Details</h3>
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                handleSave();
                                            } else {
                                                setIsEditing(true);
                                                setJustSaved(false); // Reset highlight when starting to edit
                                            }
                                        }}
                                        disabled={isSaving}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${isEditing
                                            ? isSaving 
                                                ? 'bg-gray-400 text-white cursor-not-allowed shadow-gray-400/20'
                                                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
                                            : justSaved
                                                ? 'bg-blue-50 text-blue-700 border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-100 animate-pulse'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                                    </button>
                                </div>

                                {/* Personal Info Tab */}
                                {activeTab === 'personal' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    disabled={true}
                                                    placeholder={!formData.name ? 'Not provided' : ''}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all cursor-not-allowed ${formData.name ? 'border-transparent bg-gray-100 text-gray-700 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                    title="Name cannot be changed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled={true}
                                                    placeholder={!formData.email ? 'Not provided' : ''}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all cursor-not-allowed ${formData.email ? 'border-transparent bg-gray-100 text-gray-700 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                    title="Email cannot be changed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    placeholder={!isEditing && !formData.phone ? 'Not provided' : ''}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : formData.phone ? 'border-transparent bg-blue-50 text-gray-900 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : formData.city ? 'border-transparent bg-blue-50 text-gray-900 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                >
                                                    <option value="">Select City</option>
                                                    {GUJARAT_CITIES.map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                                                <input
                                                    type="text"
                                                    name="occupation"
                                                    value={formData.occupation}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    placeholder={!isEditing && !formData.occupation ? 'Not provided' : ''}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : formData.occupation ? 'border-transparent bg-blue-50 text-gray-900 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    placeholder={!isEditing && !formData.age ? 'Not provided' : ''}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : formData.age ? 'border-transparent bg-blue-50 text-gray-900 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                                            <textarea
                                                name="about"
                                                rows="4"
                                                value={formData.about}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder={!isEditing && !formData.about ? 'Not provided' : ''}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : formData.about ? 'border-transparent bg-blue-50 text-gray-900 font-medium' : 'border-transparent bg-gray-50 text-gray-400'}`}
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {/* Preferences Tab */}
                                {activeTab === 'preferences' && (
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range (₹)</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        name="budgetMin"
                                                        placeholder="Min"
                                                        value={formData.budgetMin}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                                    />
                                                    <span className="text-gray-400">-</span>
                                                    <input
                                                        type="number"
                                                        name="budgetMax"
                                                        placeholder="Max"
                                                        value={formData.budgetMax}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Roommate Gender Preference</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all appearance-none ${isEditing ? 'border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                                >
                                                    <option value="">Any</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Non-binary">Non-binary</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Lifestyle</label>
                                            <div className="flex flex-wrap gap-3">
                                                {lifestyleOptions.map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => isEditing && handlePreferenceChange('lifestyle', option)}
                                                        disabled={!isEditing}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${formData.lifestyle.includes(option)
                                                            ? 'bg-primary-50 border-primary-200 text-primary-700'
                                                            : 'bg-white border-gray-200 text-gray-600'
                                                            } ${isEditing ? 'hover:border-primary-300 cursor-pointer' : 'cursor-default opacity-80'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
                                            <div className="flex flex-wrap gap-3">
                                                {interestOptions.map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => isEditing && handlePreferenceChange('interests', option)}
                                                        disabled={!isEditing}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${formData.interests.includes(option)
                                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                            : 'bg-white border-gray-200 text-gray-600'
                                                            } ${isEditing ? 'hover:border-indigo-300 cursor-pointer' : 'cursor-default opacity-80'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-400 font-medium">👁️ This is how others see you</p>
                                <h3 className="text-base font-bold text-gray-900">Profile Preview</h3>
                            </div>
                            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Profile Card */}
                        <div className="p-6">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-100 to-indigo-100">
                                    {user?.profile_photo ? (
                                        <img src={getImageUrl(user.profile_photo)} alt={user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                                            {user?.full_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-lg font-bold text-gray-900 truncate">{user?.full_name || 'No Name'}</h4>
                                        {user?.is_verified && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                                        {formData.occupation && <span>{formData.occupation}</span>}
                                        {formData.age && <span>· {formData.age} yrs</span>}
                                        {formData.city && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {formData.city}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {formData.about && (
                                <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">{formData.about}</p>
                            )}

                            {/* Budget */}
                            {(formData.budgetMin || formData.budgetMax) && (
                                <div className="flex items-center gap-2 mb-4 text-sm">
                                    <span className="text-gray-500">Budget:</span>
                                    <span className="font-semibold text-gray-800">
                                        {formData.budgetMin && formData.budgetMax
                                            ? `₹${formData.budgetMin} – ₹${formData.budgetMax}`
                                            : formData.budgetMin ? `From ₹${formData.budgetMin}` : `Up to ₹${formData.budgetMax}`}
                                    </span>
                                    {formData.gender && formData.gender !== '' && <span className="ml-2 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-full border border-purple-100">{formData.gender} preferred</span>}
                                </div>
                            )}

                            {/* Lifestyle */}
                            {formData.lifestyle?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Lifestyle</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.lifestyle.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interests */}
                            {formData.interests?.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.interests.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {!formData.about && !formData.lifestyle?.length && !formData.interests?.length && (
                                <div className="text-center py-4 text-sm text-gray-400">
                                    <p>Your profile looks a bit empty.</p>
                                    <p className="text-xs mt-1">Add a bio, lifestyle tags & interests to stand out!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Crop Modal */}
            {showCropModal && selectedImage && (
                <ImageCropModal
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};
