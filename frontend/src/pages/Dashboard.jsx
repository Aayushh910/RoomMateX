import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { rooms, roommates } from '../data/rooms';
import { MapPin, IndianRupee, Users, Home, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { adminStats } from '../data/admin';

export const Dashboard = () => {
  const { user } = useAuth();

  const renderSeekerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-white/90 text-lg">
          Discover your perfect room today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Available Rooms</p>
              <p className="text-3xl font-display font-bold">1,205</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Wishlist</p>
              <p className="text-3xl font-display font-bold">0</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Messages</p>
              <p className="text-3xl font-display font-bold">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Profile Views</p>
              <p className="text-3xl font-display font-bold">12</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Rooms */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Recommended for You</h2>
          <Link to="/rooms">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.slice(0, 6).map((room) => (
            <Link key={room.id} to={`/room/${room.id}`}>
              <Card hover className="group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {room.featured && (
                    <Badge variant="warning" className="absolute top-3 left-3">
                      Featured
                    </Badge>
                  )}
                  {room.ownerVerified && (
                    <Badge variant="success" className="absolute top-3 right-3">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1">
                    {room.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-dark-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{room.area}, {room.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary-600">
                      ₹{room.rent.toLocaleString()}
                      <span className="text-sm text-dark-600">/mo</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{room.ownerRating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOwnerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-white/90 text-lg">
          Manage your listings and find great roommates
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">My Listings</p>
              <p className="text-3xl font-display font-bold">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Total Views</p>
              <p className="text-3xl font-display font-bold">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Inquiries</p>
              <p className="text-3xl font-display font-bold">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Rating</p>
              <p className="text-3xl font-display font-bold">4.8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg mb-2">
              List Your First Room
            </h3>
            <p className="text-dark-600 mb-4">
              Start finding great roommates by listing your available room today.
            </p>
            <Link to="/add-room">
              <Button>Add Room Listing</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Potential Roommates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Potential Roommates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roommates.map((roommate) => (
            <Card key={roommate.id} hover className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={roommate.image}
                  alt={roommate.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold">{roommate.name}</h3>
                    {roommate.verified && (
                      <Badge variant="success" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-dark-600">{roommate.occupation}</p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{roommate.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-dark-700 mb-3">{roommate.about}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-600">Budget: {roommate.budget}</span>
                <Button size="sm">View Profile</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-display font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-white/90 text-lg">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-display font-bold">{adminStats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+{adminStats.thisMonthSignups} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Total Rooms</p>
              <p className="text-3xl font-display font-bold">{adminStats.totalRooms.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+{adminStats.thisMonthListings} this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Active Listings</p>
              <p className="text-3xl font-display font-bold">{adminStats.activeListings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm mb-1">Pending Reports</p>
              <p className="text-3xl font-display font-bold">{adminStats.pendingReports}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users">
          <Card hover className="p-6 text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Manage Users</h3>
            <p className="text-dark-600 text-sm">View and manage user accounts</p>
          </Card>
        </Link>
        <Link to="/admin/rooms">
          <Card hover className="p-6 text-center">
            <Home className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Manage Rooms</h3>
            <p className="text-dark-600 text-sm">Review and moderate listings</p>
          </Card>
        </Link>
        <Link to="/admin/reports">
          <Card hover className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">View Reports</h3>
            <p className="text-dark-600 text-sm">Handle reported content</p>
          </Card>
        </Link>
      </div>
    </div>
  );

  return (
    <MainLayout>
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'owner' && renderOwnerDashboard()}
      {user?.role === 'seeker' && renderSeekerDashboard()}
    </MainLayout>
  );
};
