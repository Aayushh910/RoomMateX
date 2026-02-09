import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
    const wishlistIds = user.wishlist || [];
    const wishlistRooms = storedRooms.filter(room => wishlistIds.includes(room.id));
    setWishlist(wishlistRooms);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>

        {wishlist.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start adding rooms to your wishlist to save them for later</p>
            <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {wishlist.map(room => (
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
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{room.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
