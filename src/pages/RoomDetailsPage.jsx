import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockRooms } from '../data/mockData';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

export const RoomDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const room = mockRooms.find(r => r.id === id);
    const { user } = useAuth();
    const [activeImage, setActiveImage] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([
        { id: 1, name: 'Sarah Johnson', rating: 5, date: '2024-01-15', text: 'Amazing place! Very clean and the owner is super responsive. Highly recommend!', verified: true },
        { id: 2, name: 'Mike Chen', rating: 4, date: '2024-01-10', text: 'Good location and amenities. The room is exactly as described in the photos.', verified: true },
        { id: 3, name: 'Priya Sharma', rating: 5, date: '2023-12-28', text: 'Loved staying here! Great neighborhood and all facilities are well maintained.', verified: false }
    ]);
    const [requestSent, setRequestSent] = useState(false);
    const [requestExpiry, setRequestExpiry] = useState(null);
    const [requestStatus, setRequestStatus] = useState('pending'); // 'pending', 'approved', 'declined'

    // Form states
    const [message, setMessage] = useState('Hi, I am interested in your room. Is it still available?');
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        if (!user?.verified) {
            setShowVerificationWarning(true);
        }
    }, [user]);

    useEffect(() => {
        if (requestExpiry && Date.now() > requestExpiry) {
            setRequestSent(false);
            setRequestExpiry(null);
        }
    }, [requestExpiry]);

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Room not found</h2>
                    <Link to="/rooms" className="text-primary-600 hover:text-primary-700 font-medium">Back to Rooms</Link>
                </div>
            </div>
        );
    }

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setShowContactModal(false);
    };

    const handleSendRequest = () => {
        const newRequest = {
            id: Date.now(),
            roomId: room.id,
            roomTitle: room.title,
            userId: user?.email,
            userName: user?.name,
            userVerified: user?.verified,
            status: 'pending',
            date: new Date().toISOString(),
            ownerId: room.owner.email
        };
        
        const existingRequests = JSON.parse(localStorage.getItem('roomRequests') || '[]');
        localStorage.setItem('roomRequests', JSON.stringify([...existingRequests, newRequest]));
        
        setRequestSent(true);
        setRequestStatus('pending');
        setRequestExpiry(Date.now() + 24 * 60 * 60 * 1000);
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        setShowReportModal(false);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewRating === 0) {
            return;
        }
        const newReview = {
            id: reviews.length + 1,
            name: user?.name || 'Anonymous',
            rating: reviewRating,
            date: new Date().toISOString().split('T')[0],
            text: reviewText,
            verified: user?.verified || false
        };
        setReviews([newReview, ...reviews]);
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText('');
    };

    // Check if user can review (request approved)
    const canReview = requestSent && requestStatus === 'approved';

    return (
        <div className="min-h-screen flex flex-col pt-32">
            <Navbar />
            <div className="py-2 relative flex-1">
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
                                <div className="h-[350px] relative bg-black">
                                    <img
                                        src={room.images[activeImage]}
                                        alt={room.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex p-3 gap-3 overflow-x-auto">
                                    {room.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary-600 ring-2 ring-primary-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.title}</h1>
                                        <p className="text-lg text-gray-500 flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {room.area}, {room.city}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(room.rating || 4.5) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-base font-bold text-gray-900">{room.rating || 4.5}</span>
                                            <span className="text-sm text-gray-500">({room.reviews || 12} reviews)</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</p>
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
                                        <p className="font-bold text-gray-900">{new Date(room.availableFrom).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{room.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {room.amenities.map((amenity) => (
                                                <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                                    <span className="font-medium text-gray-700">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">House Rules</h3>
                                        <ul className="space-y-2">
                                            {room.rules.map((rule, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-gray-600">
                                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                                        <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
                                    </div>
                                    {canReview && (
                                        <button
                                            onClick={() => setShowReviewModal(true)}
                                            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:-translate-y-0.5"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>
                                {!canReview && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                        <p className="text-amber-800 text-sm font-medium">Only users with approved requests can leave reviews</p>
                                    </div>
                                )}
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                        {review.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-gray-900">{review.name}</p>
                                                            {review.verified && (
                                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                                            <p className="text-gray-700 leading-relaxed">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Owner Card */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-2xl p-6 sticky top-32">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Owner</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border border-gray-200">
                                        {room.owner.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            {room.owner.name}
                                            {room.owner.verified && (
                                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-sm">Property Owner</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        Contact Owner
                                    </button>
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
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

                                <p className="text-xs text-center text-gray-300 mt-4">
                                    By contacting, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Modal */}
                {showContactModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Contact Owner</h3>
                                <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            {/* Request Status Section */}
                            <div className="mb-6">
                                {!requestSent ? (
                                    <button
                                        onClick={handleSendRequest}
                                        className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-primary-700 hover:to-indigo-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        Send Request
                                    </button>
                                ) : (
                                    <div className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 ${
                                        requestStatus === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                        requestStatus === 'approved' ? 'bg-green-50 border-green-200 text-green-700' :
                                        'bg-red-50 border-red-200 text-red-700'
                                    }`}>
                                        {requestStatus === 'pending' && (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                Request Pending
                                            </>
                                        )}
                                        {requestStatus === 'approved' && (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Request Approved
                                            </>
                                        )}
                                        {requestStatus === 'declined' && (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Request Declined
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                        {room.owner.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            {room.owner.name}
                                            {room.owner.verified && (
                                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-sm">Property Owner</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-semibold text-gray-900">{room.owner.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-semibold text-gray-900">{room.owner.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowContactModal(false)} className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">Close</button>
                            </div>
                        </div>
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
                                        <option value="spam">Spam or misleading</option>
                                        <option value="fake">Fake listing</option>
                                        <option value="offensive">Offensive content</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                        placeholder="Please provide more details..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/20">Submit Report</button>
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review</label>
                                    <textarea
                                        rows="4"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                        placeholder="Share your experience..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20">Submit Review</button>
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
            </div>
        </div>
    );
};
