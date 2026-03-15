import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { ConfirmModal } from '../components/modal/ConfirmModal';
import { dashboardService } from '../services/dashboardService';
import { propertyService } from '../services/propertyService';
import { getImageUrl } from '../utils/imageUtils';

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [summary, setSummary] = useState({
        my_listings_count: 0,
        wishlist_count: 0,
        total_rooms_count: 0
    });
    const [myListings, setMyListings] = useState([]);
    const [wishlistRooms, setWishlistRooms] = useState([]);
    const [recommendedRooms, setRecommendedRooms] = useState([]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [summaryData, listingsData, wishlistData, recommendedData, totalRoomsCount] = await Promise.all([
                dashboardService.getSummary(),
                dashboardService.getMyListings(),
                dashboardService.getWishlist(),
                dashboardService.getRecommended(),
                dashboardService.getTotalRoomsCount()
            ]);

            setSummary({ ...summaryData, total_rooms_count: totalRoomsCount });
            setMyListings(listingsData);
            setWishlistRooms(wishlistData);
            setRecommendedRooms(recommendedData);
        } catch (err) {
            // Silently handle dashboard data fetch errors
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteRoom = async (id) => {
        setRoomToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteRoom = async () => {
        if (!roomToDelete) return;
        
        try {
            await propertyService.deleteProperty(roomToDelete);
            setMyListings(prev => prev.filter(room => room.id !== roomToDelete));
            // Refresh summary
            const summaryData = await dashboardService.getSummary();
            setSummary(summaryData);
            showSuccess('Property deleted successfully');
        } catch (err) {
            showError('Failed to delete property. Please try again.');
        } finally {
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const response = await propertyService.togglePropertyActive(id);
            // Update the listing in state
            setMyListings(prev => prev.map(room => 
                room.id === id ? { ...room, is_active: response.is_active } : room
            ));
            showSuccess(response.message);
        } catch (err) {
            showError('Failed to update property status. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-24">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">

                {/* Greeting */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 mb-6 text-gray-900 shadow-xl shadow-blue-500/10 relative overflow-hidden border border-blue-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
                            Welcome back, {user?.full_name || 'User'}! 
                            {/* <Hand className="w-8 h-8 text-yellow-500 inline-block" /> */}
                        </h1>
                        <p className="text-gray-600">Find your perfect room or roommate today</p>
                    </div>
                </div>

                {/* Display Sections (Stats) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">My Listings</p>
                            <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {loading ? '...' : summary.my_listings_count}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Wishlist</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : summary.wishlist_count}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Total Rooms Available</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : summary.total_rooms_count}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
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
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        My Listings <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{loading ? '...' : myListings.length}</span>
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-card overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : myListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myListings.map((room) => (
                                <div key={room.id} className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] flex flex-col">
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                                        <img 
                                            src={getImageUrl(room.thumbnail_image)} 
                                            alt={room.property_title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Status Badge */}
                                        <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                                            room.is_active 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-500 text-white'
                                        }`}>
                                            {room.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">{room.property_title}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {room.city}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="text-xl font-bold text-primary-600 mb-4">
                                                ₹{room.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Link to={`/rooms/${room.id}`} className="flex-1 px-3 py-2 text-center bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors">
                                                    View
                                                </Link>
                                                <Link to={`/edit-room/${room.id}`} className="flex-1 px-3 py-2 text-center bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors">
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
                                <Link key={room.id} to={`/rooms/${room.id}`} className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] flex flex-col">
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                                        <img 
                                            src={getImageUrl(room.thumbnail_image)} 
                                            alt={room.property_title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20 bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">{room.property_title}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {room.city}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="text-xl font-bold text-primary-600">
                                                ₹{room.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                            </div>
                                            <span className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-primary-700 transition-all">
                                                View Details <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Rooms */}
                {!loading && recommendedRooms.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {recommendedRooms.slice(0, 6).map((room) => (
                                <Link key={room.id} to={`/rooms/${room.id}`} className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] flex flex-col">
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                                        <img 
                                            src={getImageUrl(room.thumbnail_image)} 
                                            alt={room.property_title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                            New
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">{room.property_title}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {room.city}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="text-xl font-bold text-primary-600">
                                                ₹{room.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                            </div>
                                            <span className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-primary-700 transition-all">
                                                View <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link to="/rooms" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5">
                                Explore More Rooms
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                )}

            </main>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteRoom}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};
