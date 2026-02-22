import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { propertyService } from '../services/propertyService';
import { reviewService } from '../services/reviewService';
import { wishlistService } from '../services/wishlistService';
import { getImageUrl } from '../utils/imageUtils';

export const RoomDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeImage, setActiveImage] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    // Fetch property details
    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    // Track property view when user is logged in
    useEffect(() => {
        if (user && id) {
            propertyService.trackPropertyView(id);
        }
    }, [user, id]);

    // Check verification status
    useEffect(() => {
        if (!user?.is_verified) {
            setShowVerificationWarning(true);
        }
    }, [user]);

    // Check if property is wishlisted
    useEffect(() => {
        if (user && room) {
            checkWishlistStatus();
        }
    }, [user, room]);

    const fetchPropertyDetails = async () => {
        setLoading(true);
        setError('');
        
        try {
            const data = await propertyService.getPropertyById(id);
            setRoom(data);
            
            // Fetch reviews
            const reviewsData = await reviewService.getPropertyReviews(id);
            setReviews(reviewsData.data || []);
        } catch (err) {
            console.error('Failed to fetch property:', err);
            setError('Failed to load property details.');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const wishlist = await wishlistService.getWishlist();
            // wishlistService.getWishlist() returns response.data which is the array
            const isInWishlist = wishlist.some(item => item.property_id === id);
            setIsWishlisted(isInWishlist);
        } catch (err) {
            console.error('Failed to check wishlist:', err);
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted) {
                await wishlistService.removeFromWishlist(id);
                setIsWishlisted(false);
            } else {
                await wishlistService.addToWishlist(id);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error('Failed to toggle wishlist:', err);
            alert('Failed to update wishlist. Please try again.');
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!reportReason) {
            alert('Please select a reason');
            return;
        }

        setSubmitting(true);
        try {
            const reason = reportDescription 
                ? `${reportReason}: ${reportDescription}` 
                : reportReason;
            await propertyService.reportProperty(id, reason);
            alert('Property reported successfully. We will review it.');
            setShowReportModal(false);
            setReportReason('');
            setReportDescription('');
        } catch (err) {
            console.error('Failed to report property:', err);
            alert('Failed to report property. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (reviewRating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await reviewService.createReview(id, {
                rating: reviewRating,
                comment: reviewText,
            });
            
            // Refresh reviews
            const reviewsData = await reviewService.getPropertyReviews(id);
            setReviews(reviewsData.data || []);
            
            setShowReviewModal(false);
            setReviewRating(0);
            setReviewText('');
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading property details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {error || 'Room not found'}
                        </h2>
                        <Link to="/rooms" className="text-primary-600 hover:text-primary-700 font-medium">
                            Back to Rooms
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="py-6 relative flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-5 flex justify-end">
                        <Link to="/rooms" className="inline-flex items-center px-4 py-2 bg-transparent border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Search
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Gallery */}
                            <div className="glass-card rounded-2xl overflow-hidden">
                                <div 
                                    className="h-[350px] relative bg-gray-100 flex items-center justify-center cursor-zoom-in group"
                                    onClick={() => setShowImageModal(true)}
                                >
                                    <img
                                        src={getImageUrl(room.images && room.images.length > 0 ? room.images[activeImage] : null)}
                                        alt={room.property_title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg">
                                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex p-3 gap-3 overflow-x-auto">
                                    {room.images && room.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary-600 ring-2 ring-primary-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                                }`}
                                        >
                                            <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.property_title}</h1>
                                        <p className="text-lg text-gray-500 flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {room.area_locality}, {room.city}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(room.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-base font-bold text-gray-900">{room.rating || 0}</span>
                                            <span className="text-sm text-gray-500">({room.total_reviews || 0} reviews)</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary-600">₹{room.monthly_rent.toLocaleString()}</p>
                                        <p className="text-gray-500 font-medium">per month</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-100 mb-8">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Deposit</p>
                                        <p className="font-bold text-gray-900">₹{room.deposit.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Available From</p>
                                        <p className="font-bold text-gray-900">{new Date(room.available_from).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Property Type</p>
                                        <p className="font-bold text-gray-900">{room.property_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Preferred Tenant</p>
                                        <p className="font-bold text-gray-900 capitalize">{room.preferred_tenant.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {room.description && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{room.description}</p>
                                        </div>
                                    )}

                                    {room.amenities && room.amenities.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {room.amenities.map((amenity) => (
                                                    <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                        <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                                        <span className="font-medium text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {room.house_rules && room.house_rules.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">House Rules</h3>
                                            <ul className="space-y-2">
                                                {room.house_rules.map((rule, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-gray-600">
                                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                                        <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
                                    </div>
                                    {user && (
                                        <button
                                            onClick={() => setShowReviewModal(true)}
                                            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:-translate-y-0.5"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    {reviews.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                            {review.user_name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{review.user_name}</p>
                                                            <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Owner Card */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-2xl p-6 sticky top-32">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Owner</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border border-gray-200">
                                        {room.owner.full_name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            {room.owner.full_name}
                                            {room.owner.is_verified && (
                                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-sm capitalize">{room.owner.role.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="w-full py-3 rounded-xl font-bold bg-primary-600 text-white transition-all flex items-center justify-center gap-2 hover:bg-primary-700 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg shadow-primary-600/20"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Contact Details
                                    </button>

                                    <button
                                        onClick={handleToggleWishlist}
                                        className={`w-full py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] ${isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-600 shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        <svg className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 mt-4 py-2 rounded-lg transition-all font-semibold"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Report this listing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


            {/* Image Zoom Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    <button 
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={getImageUrl(room.images && room.images.length > 0 ? room.images[activeImage] : null)}
                        alt={room.property_title}
                        className="max-w-full max-h-full object-contain"
                    />
                    {room.images && room.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveImage((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setActiveImage((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Report Listing</h3>
                                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleReportSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Spam or misleading">Spam or misleading</option>
                                        <option value="Fake listing">Fake listing</option>
                                        <option value="Offensive content">Offensive content</option>
                                        <option value="Incorrect information">Incorrect information</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                                    <textarea
                                        rows="3"
                                        value={reportDescription}
                                        onChange={(e) => setReportDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                        placeholder="Please provide more details..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowReportModal(false)} 
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <svg className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review (Optional)</label>
                                    <textarea
                                        rows="4"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                        placeholder="Share your experience..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowReviewModal(false)} 
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20 disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            {/* Verification Warning Modal */}
            {showVerificationWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                        <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Verification Required</h3>
                                <p className="text-gray-600 mb-6">To access room details, you need to complete your personal details and verify your identity.</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                                    >
                                        Go to Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/rooms')}
                                        className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Back to Rooms
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Contact Details Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Contact Owner</h3>
                            <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <a href={`mailto:${room.owner.email}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 break-all">
                                        {room.owner.email}
                                    </a>
                                </div>
                            </div>

                            {room.owner.phone && (
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <a href={`tel:${room.owner.phone}`} className="text-sm font-semibold text-green-600 hover:text-green-700">
                                            {room.owner.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowContactModal(false)}
                            className="w-full mt-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
