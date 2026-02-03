import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { rooms } from '../data/rooms';
import { MapPin, Star, Filter, Search } from 'lucide-react';

export const Rooms = () => {
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    gender: '',
    roomType: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    if (filters.city && room.city !== filters.city) return false;
    if (filters.minRent && room.rent < parseInt(filters.minRent)) return false;
    if (filters.maxRent && room.rent > parseInt(filters.maxRent)) return false;
    if (filters.gender && filters.gender !== 'Any' && room.gender !== filters.gender) return false;
    if (filters.roomType && room.roomType !== filters.roomType) return false;
    if (filters.search && !room.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Find Your Room</h1>
            <p className="text-dark-600">{filteredRooms.length} rooms available</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="input"
                  >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rent Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minRent}
                      onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxRent}
                      onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender Preference</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className="input"
                  >
                    <option value="">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                    className="input"
                  >
                    <option value="">All Types</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({
                    city: '',
                    minRent: '',
                    maxRent: '',
                    gender: '',
                    roomType: '',
                    search: '',
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            {filteredRooms.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-dark-400" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">No rooms found</h3>
                <p className="text-dark-600 mb-4">Try adjusting your filters</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    city: '',
                    minRent: '',
                    maxRent: '',
                    gender: '',
                    roomType: '',
                    search: '',
                  })}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <Link key={room.id} to={`/room/${room.id}`}>
                    <Card hover className="group h-full">
                      <div className="relative h-56 overflow-hidden">
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
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1">
                          {room.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-dark-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{room.area}, {room.city}</span>
                        </div>
                        <p className="text-sm text-dark-600 mb-4 line-clamp-2">
                          {room.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-dark-100">
                          <div>
                            <div className="text-2xl font-bold text-primary-600">
                              ₹{room.rent.toLocaleString()}
                            </div>
                            <div className="text-xs text-dark-600">per month</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{room.ownerRating}</span>
                            <span className="text-sm text-dark-600">({room.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
