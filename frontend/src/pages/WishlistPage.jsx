import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { wishlistService } from '../services/wishlistService';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';

export const WishlistPage = () => {
    const { user } = useAuth();
    const { showError } = useToast();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        
        try {
            const data = await dashboardService.getWishlist();
            setWishlist(data || []);
        } catch (err) {
            setError('Failed to load wishlist.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (propertyId) => {
        try {
            await wishlistService.removeFromWishlist(propertyId);
            setWishlist(prev => prev.filter(item => item.id !== propertyId));
        } catch (err) {
            showError('Failed to remove from wishlist. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-32">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
                    <p className="text-gray-500">Properties you've saved for later</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start adding rooms you like!</p>
                        <Link
                            to="/rooms"
                            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                        >
                            Browse Rooms
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                                    <img
                                        src={getImageUrl(item.thumbnail_image)}
                                        alt={item.property_title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                        className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-red-600 fill-current" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
                                            {item.property_title}
                                        </h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {item.city}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xl font-bold text-primary-600">
                                            ₹{item.monthly_rent?.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                        </div>
                                        <Link
                                            to={`/rooms/${item.id}`}
                                            className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-primary-700 transition-all"
                                        >
                                            View Details
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
