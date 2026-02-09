import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToWishlist, removeFromWishlist, addViewedRoom } = useAuth();
  const [room, setRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Load room data
    const storedRooms = localStorage.getItem('roomatex_rooms');
    const rooms = storedRooms ? JSON.parse(storedRooms) : [];
    const foundRoom = rooms.find(r => r.id === id);
    
    if (!foundRoom) {
      navigate('/rooms');
      return;
    }

    setRoom(foundRoom);
    
    // Mark as viewed
    if (user) {
      addViewedRoom(id);
    }

    // Check if in wishlist
    if (user && user.wishlist) {
      setIsInWishlist(user.wishlist.includes(id));
    }
  }, [id, navigate, user, addViewedRoom]);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(id);
      setIsInWishlist(false);
      setToast({ message: 'Removed from wishlist', type: 'success' });
    } else {
      addToWishlist(id);
      setIsInWishlist(true);
      setToast({ message: 'Added to wishlist', type: 'success' });
    }
  };

  const handleReport = () => {
    setShowReportModal(false);
    setToast({ message: 'Report submitted successfully', type: 'success' });
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/rooms" className="hover:text-primary-600">Rooms</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{room.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="card mb-6">
              <div className="relative">
                <img
                  src={room.images[currentImageIndex]}
                  alt={room.title}
                  className="w-full h-96 object-cover"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === idx ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div className="card p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.title}</h1>
              
              <div className="flex items-center mb-6">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-gray-700">{room.area}, {room.city}</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="badge badge-info">{room.roomType}</span>
                <span className="badge badge-success">{room.furnishing}</span>
                <span className="badge badge-warning">{room.preferredTenant}</span>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">House Rules</h3>
                <ul className="space-y-2">
                  {room.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="card p-6 mb-6 sticky top-20">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Rent per month</p>
                <p className="text-4xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</p>
                <p className="text-gray-600 mt-2">Deposit: ₹{room.deposit.toLocaleString()}</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Owner
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`w-full btn-outline flex items-center justify-center ${
                    isInWishlist ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100' : ''
                  }`}
                >
                  <svg
                    className={`w-5 h-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`}
                    fill={isInWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Report Listing
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-3">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type</span>
                    <span className="font-medium">{room.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Furnishing</span>
                    <span className="font-medium">{room.furnishing}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Card */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Property Owner</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg mr-3">
                  {room.owner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-semibold">{room.owner.name}</p>
                    {room.owner.verified && (
                      <svg className="w-5 h-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Property Owner</p>
                </div>
              </div>
              {room.owner.verified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Owner
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Owner">
        <div className="space-y-4">
          <p className="text-gray-700">You can contact the property owner using the details below:</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-semibold">{room.owner.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <a href={`tel:${room.owner.phone}`} className="font-semibold text-primary-600 hover:text-primary-700">
                {room.owner.phone}
              </a>
            </div>
          </div>
          <button onClick={() => setShowContactModal(false)} className="w-full btn-primary">
            Close
          </button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Listing">
        <div className="space-y-4">
          <p className="text-gray-700">Please select a reason for reporting this listing:</p>
          <div className="space-y-2">
            {['Fake listing', 'Incorrect information', 'Inappropriate content', 'Already rented', 'Other'].map(reason => (
              <label key={reason} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="report-reason" className="mr-3" />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowReportModal(false)} className="flex-1 btn-outline">
              Cancel
            </button>
            <button onClick={handleReport} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
