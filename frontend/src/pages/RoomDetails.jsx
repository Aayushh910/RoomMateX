import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { rooms } from '../data/rooms';
import { reviews } from '../data/reviews';
import {
  MapPin,
  Star,
  Heart,
  Flag,
  MessageCircle,
  Home,
  Wifi,
  Wind,
  Car,
  Shield,
  Users,
  Calendar,
  IndianRupee,
  CheckCircle,
} from 'lucide-react';

export const RoomDetails = () => {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id);
  const roomReviews = reviews.filter((r) => r.roomId === id);

  const [currentImage, setCurrentImage] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  if (!room) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-display font-bold mb-4">Room not found</h2>
          <Link to="/rooms">
            <Button>Back to Rooms</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const amenityIcons = {
    WiFi: Wifi,
    AC: Wind,
    Parking: Car,
    Security: Shield,
    Kitchen: Home,
    Gym: Users,
  };

  const handleReport = () => {
    if (!reportReason || !reportDescription) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    setAlert({ type: 'success', message: 'Report submitted successfully' });
    setShowReportModal(false);
    setReportReason('');
    setReportDescription('');
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    setAlert({
      type: 'success',
      message: wishlist ? 'Removed from wishlist' : 'Added to wishlist',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        {/* Back Button */}
        <Link to="/rooms">
          <Button variant="ghost">← Back to Rooms</Button>
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={room.images[currentImage]}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              {room.featured && (
                <Badge variant="warning" className="absolute top-4 left-4">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
            {room.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative h-32 lg:h-40 rounded-lg overflow-hidden ${
                  currentImage === index ? 'ring-4 ring-primary-500' : ''
                }`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-display font-bold mb-3">{room.title}</h1>
                  <div className="flex items-center gap-4 text-dark-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">{room.area}, {room.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{room.ownerRating}</span>
                      <span>({room.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={toggleWishlist}>
                    <Heart className={`w-5 h-5 ${wishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" onClick={() => setShowReportModal(true)}>
                    <Flag className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="info">{room.roomType}</Badge>
                <Badge variant="info">{room.gender}</Badge>
                <Badge variant="success">{room.availability}</Badge>
                {room.furnished && <Badge variant="warning">Furnished</Badge>}
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold mb-4">About this room</h2>
              <p className="text-dark-700 leading-relaxed">{room.description}</p>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || CheckCircle;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* House Rules */}
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold mb-4">House Rules</h2>
              <ul className="space-y-2">
                {room.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold mb-6">
                Reviews ({roomReviews.length})
              </h2>
              {roomReviews.length === 0 ? (
                <p className="text-dark-600">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {roomReviews.map((review) => (
                    <div key={review.id} className="border-b border-dark-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.userImage}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.userName}</h4>
                              <p className="text-sm text-dark-600">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-dark-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-dark-700">{review.comment}</p>
                          <button className="text-sm text-dark-600 hover:text-primary-600 mt-2">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-4xl font-display font-bold text-primary-600 mb-1">
                ₹{room.rent.toLocaleString()}
              </div>
              <p className="text-dark-600 mb-6">per month</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">Deposit</span>
                  <span className="font-semibold">₹{room.deposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">Room Type</span>
                  <span className="font-semibold">{room.roomType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">Occupancy</span>
                  <span className="font-semibold">
                    {room.occupants}/{room.maxOccupants}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">Available from</span>
                  <span className="font-semibold">{room.availability}</span>
                </div>
              </div>

              <Button className="w-full mb-3">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Owner
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Visit
              </Button>
            </Card>

            {/* Owner Card */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-lg mb-4">Hosted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {room.ownerName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{room.ownerName}</h4>
                    {room.ownerVerified && (
                      <Badge variant="success" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{room.ownerRating}</span>
                    <span className="text-dark-600">• {room.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <Link to={`/profile/${room.ownerId}`}>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report this listing"
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reason for reporting</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input"
            >
              <option value="">Select a reason</option>
              <option value="misleading">Misleading information</option>
              <option value="fraud">Suspected fraud</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="unavailable">No longer available</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="input min-h-32"
              placeholder="Please provide more details..."
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowReportModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleReport} className="flex-1">
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
