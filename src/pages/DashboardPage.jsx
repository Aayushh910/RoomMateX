import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockRooms } from '../data/mockData';
import { Navbar } from '../components/Navbar';
import { Hand } from 'lucide-react';

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [myListings, setMyListings] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistRooms, setWishlistRooms] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [myRequestsCount, setMyRequestsCount] = useState(0);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {
        if (user) {
            setMyListings(mockRooms.slice(0, 2));
            const wishlistIds = user.wishlist || [];
            setWishlistCount(wishlistIds.length);
            setWishlistRooms(mockRooms.filter(room => wishlistIds.includes(room.id)));
            
            const allRequests = JSON.parse(localStorage.getItem('roomRequests') || '[]');
            const myRequests = allRequests.filter(req => req.ownerId === user.email);
            setIncomingRequests(myRequests);
            
            const sentReqs = allRequests.filter(req => req.userId === user.email);
            setSentRequests(sentReqs);
            setMyRequestsCount(sentReqs.length);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteRoom = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setMyListings(prev => prev.filter(room => room.id !== id));
        }
    };

    // Calculate stats
    const recentlyViewedCount = myRequestsCount;
    const availableRoomsCount = mockRooms.length;

    return (
        <div className="min-h-screen flex flex-col pt-24">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">

                {/* Greeting */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 mb-6 text-gray-900 shadow-xl shadow-blue-500/10 relative overflow-hidden border border-blue-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
                            Welcome back, {user?.name || 'User'}! 
                            {/* <Hand className="w-8 h-8 text-yellow-500 inline-block" /> */}
                        </h1>
                        <p className="text-gray-600">Find your perfect room or roommate today</p>
                    </div>
                </div>

                {/* Display Sections (Stats) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">My Listings</p>
                            <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{myListings.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Wishlist</p>
                            <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Recently Viewed</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                    </div>

                    <div onClick={() => setShowRequestsModal(true)} className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">My Requests</p>
                            <p className="text-2xl font-bold text-gray-900">{myRequestsCount}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                    </div>
                </div>

                {/* Two Big Cards: Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Link to="/add-room" className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 text-gray-900 overflow-hidden shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-blue-200">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">List Your Room</h3>
                            <p className="text-gray-600 mb-4">Find the perfect tenant for your property. Quick and easy listing process.</p>
                            <span className="inline-flex items-center gap-2 font-bold bg-blue-600 text-white px-4 py-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                                Start Listing <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    </Link>

                    <Link to="/rooms" className="group relative glass-card p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] rounded-3xl">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-teal-600 group-hover:bg-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Rooms</h3>
                            <p className="text-gray-500 mb-6">Explore available rooms in your city with advanced filters and verified listings.</p>
                            <span className="inline-flex items-center gap-2 font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                                Browse Available Rooms <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-2xl -mr-8 -mb-8 group-hover:scale-125 transition-transform duration-700"></div>
                    </Link>
                </div>

                {/* My Listings Section */}
                {incomingRequests.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Incoming Requests <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                        </h2>
                        <div className="glass-card rounded-2xl p-6">
                            <div className="space-y-4">
                                {incomingRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                {request.userName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900">{request.userName}</p>
                                                    {request.userVerified && (
                                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{request.roomTitle}</p>
                                                <p className="text-xs text-gray-400">{new Date(request.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                                            request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* My Listings Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        My Listings <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{myListings.length}</span>
                    </h2>

                    {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myListings.map((room) => (
                                <div key={room.id} className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01]">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                            ₹{room.rent}/mo
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-1 text-lg truncate">{room.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{room.area}, {room.city}</p>
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <Link to={`/rooms/${room.id}`} className="flex-1 px-3 py-2 text-center bg-gray-50 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                                View
                                            </Link>
                                            <Link to="/add-room" className="flex-1 px-3 py-2 text-center bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteRoom(room.id)}
                                                className="flex-1 px-3 py-2 text-center bg-red-50 text-red-700 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass-panel rounded-3xl border-dashed border-2 border-white/50">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No listings yet</h3>
                            <p className="text-gray-500 mb-6">Share your property with thousands of potential tenants.</p>
                            <Link to="/add-room" className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                                Create Listing
                            </Link>
                        </div>
                    )}
                </div>

                {/* Wishlist Section */}
                {wishlistRooms.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                My Wishlist <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{wishlistRooms.length}</span>
                            </h2>
                            <Link to="/wishlist" className="text-primary-600 font-bold hover:text-primary-700 text-sm flex items-center gap-1">
                                View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistRooms.map((room) => (
                                <Link key={room.id} to={`/rooms/${room.id}`} className="group glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                            ₹{room.rent}/mo
                                        </div>
                                        <div className="absolute top-3 left-3 bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-1 truncate">{room.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{room.area}, {room.city}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Rooms */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
                        <Link to="/rooms" className="text-primary-600 font-bold hover:text-primary-700 text-sm flex items-center gap-1">
                            View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockRooms.slice(2, 5).map((room) => (
                            <Link key={room.id} to={`/rooms/${room.id}`} className="group glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                        ₹{room.rent}/mo
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-1 truncate">{room.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{room.area}, {room.city}</p>
                                    <div className="flex items-center gap-2">

                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            {/* Requests Modal */}
            {showRequestsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRequestsModal(false)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">My Requests</h3>
                            <button onClick={() => setShowRequestsModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Requests Received */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        Requests Received
                                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {incomingRequests.length > 0 ? incomingRequests.map((request) => (
                                            <div key={request.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-bold">
                                                        {request.userName?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-gray-900 text-sm">{request.userName}</p>
                                                            {request.userVerified && (
                                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{request.roomTitle}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-400">{new Date(request.date).toLocaleDateString()}</p>
                                                    <span className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                                                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No requests received yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Requests Sent */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        Requests Sent
                                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{sentRequests.length}</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {sentRequests.length > 0 ? sentRequests.map((request) => (
                                            <div key={request.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="mb-2">
                                                    <p className="font-bold text-gray-900 text-sm">{request.roomTitle}</p>
                                                    <p className="text-xs text-gray-500">Owner: {request.ownerId}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-400">{new Date(request.date).toLocaleDateString()}</p>
                                                    <span className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                                                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No requests sent yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
