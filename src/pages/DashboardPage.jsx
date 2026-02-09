import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockRooms, mockRoommates } from '../data/mockData';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roommates] = useState(mockRoommates);
  const [userListings, setUserListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [viewedRooms, setViewedRooms] = useState([]);

  useEffect(() => {
    // Load rooms from localStorage (includes user's added rooms)
    const storedRooms = localStorage.getItem('roomatex_rooms');
    const allRooms = storedRooms ? JSON.parse(storedRooms) : mockRooms;
    setRooms(allRooms);

    // Get user's listings
    const myListings = allRooms.filter(room => room.owner.id === user.id);
    setUserListings(myListings);

    // Get wishlist
    const wishlistIds = user.wishlist || [];
    const wishlistRooms = allRooms.filter(room => wishlistIds.includes(room.id));
    setWishlist(wishlistRooms);

    // Get viewed rooms
    const viewedIds = user.viewedRooms || [];
    const recentlyViewed = allRooms.filter(room => viewedIds.includes(room.id));
    setViewedRooms(recentlyViewed);
  }, [user]);

  const recommendedRooms = rooms.filter(room => 
    room.active && 
    room.owner.id !== user.id
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-primary-100">Find your perfect room or roommate today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">My Listings</p>
                <p className="text-2xl font-bold text-primary-600">{userListings.length}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Wishlist</p>
                <p className="text-2xl font-bold text-secondary-600">{wishlist.length}</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Recently Viewed</p>
                <p className="text-2xl font-bold text-accent-600">{viewedRooms.length}</p>
              </div>
              <div className="bg-accent-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Rooms</p>
                <p className="text-2xl font-bold text-green-600">{recommendedRooms.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/add-room" className="card p-6 hover:shadow-lg transition-all bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="flex items-center">
              <div className="bg-primary-600 text-white p-4 rounded-lg mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">List Your Room</h3>
                <p className="text-gray-600">Find the perfect tenant for your property</p>
              </div>
            </div>
          </Link>

          <Link to="/rooms" className="card p-6 hover:shadow-lg transition-all bg-gradient-to-br from-secondary-50 to-accent-50">
            <div className="flex items-center">
              <div className="bg-secondary-600 text-white p-4 rounded-lg mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Find Rooms</h3>
                <p className="text-gray-600">Explore available rooms in your city</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recommended Rooms */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Rooms</h2>
            <Link to="/rooms" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedRooms.slice(0, 3).map(room => (
              <Link key={room.id} to={`/room/${room.id}`} className="card hover:shadow-lg transition-all transform hover:-translate-y-1">
                <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                    <span className="badge badge-success">{room.roomType}</span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {room.area}, {room.city}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Roommates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Roommates</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roommates.slice(0, 3).map(roommate => (
              <Link key={roommate.id} to={`/roommate/${roommate.id}`} className="card hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <img 
                      src={roommate.profilePhoto} 
                      alt={roommate.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-lg">{roommate.name}</h3>
                        {roommate.verified && (
                          <svg className="w-5 h-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{roommate.age} yrs • {roommate.occupation}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{roommate.about}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {roommate.city}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      ₹{roommate.lookingFor.budgetMin}k - ₹{roommate.lookingFor.budgetMax}k
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-primary-50 text-primary-600 py-2 rounded-lg hover:bg-primary-100 transition-colors font-medium">
                    View Profile
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Listings - Only if user has listings */}
        {userListings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
              <Link to="/profile" className="text-primary-600 hover:text-primary-700 font-medium">
                Manage All
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {userListings.slice(0, 3).map(room => (
                <div key={room.id} className="card">
                  <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                      <span className={`badge ${room.active ? 'badge-success' : 'badge-warning'}`}>
                        {room.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/room/${room.id}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">
                        View
                      </Link>
                      <Link to={`/add-room?edit=${room.id}`} className="flex-1 text-center py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-sm font-medium">
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this room?')) {
                            const storedRooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
                            const updatedRooms = storedRooms.filter(r => r.id !== room.id);
                            localStorage.setItem('roomatex_rooms', JSON.stringify(updatedRooms));
                            window.location.reload();
                          }
                        }}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed - Only if user has viewed rooms */}
        {viewedRooms.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {viewedRooms.slice(0, 3).map(room => (
                <Link key={room.id} to={`/room/${room.id}`} className="card hover:shadow-lg transition-all">
                  <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{room.area}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist - Only if user has wishlist items */}
        {wishlist.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
              <Link to="/wishlist" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {wishlist.slice(0, 3).map(room => (
                <Link key={room.id} to={`/room/${room.id}`} className="card hover:shadow-lg transition-all relative">
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-white p-2 rounded-full shadow-md">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{room.area}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};
