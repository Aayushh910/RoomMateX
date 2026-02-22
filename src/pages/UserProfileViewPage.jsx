import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

export const UserProfileViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            setError('Failed to load user profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-32">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col pt-32">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error || 'User not found'}</p>
                        <button onClick={() => navigate(-1)} className="text-primary-600 font-bold hover:underline">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-12">
            <Navbar />
            <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Requests
                </button>

                <div className="glass-card rounded-2xl p-8">
                    {/* Header with Avatar and Name */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                        {user.profile_photo ? (
                            <img 
                                src={getImageUrl(user.profile_photo)} 
                                alt={user.full_name} 
                                className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 text-4xl font-bold flex-shrink-0">
                                {user.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                                {user.is_verified && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>
                                )}
                            </div>
                            {user.role && (
                                <p className="text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-3">
                            {user.email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            
                            {user.phone_number && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="text-gray-900 font-medium">{user.phone_number}</p>
                                    </div>
                                </div>
                            )}
                            
                            {user.city && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="text-gray-900 font-medium">{user.city}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {user.age && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Age</p>
                                    <p className="text-gray-900 font-medium">{user.age} years</p>
                                </div>
                            )}
                            
                            {user.occupation && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Occupation</p>
                                    <p className="text-gray-900 font-medium">{user.occupation}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preferences */}
                    {(user.gender_preference || user.budget_min || user.budget_max || user.lifestyle || user.interests) && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
                            <div className="space-y-4">
                                {user.gender_preference && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Gender Preference</p>
                                        <p className="text-gray-900 font-medium capitalize">{user.gender_preference}</p>
                                    </div>
                                )}
                                
                                {(user.budget_min || user.budget_max) && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Budget Range</p>
                                        <p className="text-gray-900 font-medium">
                                            ₹{user.budget_min || 0} - ₹{user.budget_max || 'No limit'}
                                        </p>
                                    </div>
                                )}
                                
                                {user.lifestyle && (() => {
                                    try {
                                        const lifestyleArray = JSON.parse(user.lifestyle);
                                        return lifestyleArray.length > 0 && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-2">Lifestyle</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {lifestyleArray.map((item, index) => (
                                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    } catch (e) {
                                        return null;
                                    }
                                })()}
                                
                                {user.interests && (() => {
                                    try {
                                        const interestsArray = JSON.parse(user.interests);
                                        return interestsArray.length > 0 && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-2">Interests</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {interestsArray.map((item, index) => (
                                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    } catch (e) {
                                        return null;
                                    }
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Bio */}
                    {user.bio && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State for Bio */}
                    {!user.bio && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                            <div className="p-8 bg-gray-50 rounded-lg text-center">
                                <p className="text-gray-400">No bio available</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
