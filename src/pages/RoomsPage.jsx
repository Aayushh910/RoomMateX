import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockRooms, cities, amenitiesList, roomTypes } from '../data/mockData';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: [],
  });

  useEffect(() => {
    // Load rooms from localStorage or use mock data
    const storedRooms = localStorage.getItem('roomatex_rooms');
    const allRooms = storedRooms ? JSON.parse(storedRooms) : mockRooms;
    
    // Only show active rooms
    const activeRooms = allRooms.filter(room => room.active);
    setRooms(activeRooms);
    setFilteredRooms(activeRooms);
    
    // Save to localStorage if not already there
    if (!storedRooms) {
      localStorage.setItem('roomatex_rooms', JSON.stringify(mockRooms));
    }
  }, []);

  useEffect(() => {
    let filtered = rooms;

    if (filters.city) {
      filtered = filtered.filter(room => room.city === filters.city);
    }

    if (filters.minRent) {
      filtered = filtered.filter(room => room.rent >= parseInt(filters.minRent));
    }

    if (filters.maxRent) {
      filtered = filtered.filter(room => room.rent <= parseInt(filters.maxRent));
    }

    if (filters.roomType) {
      filtered = filtered.filter(room => room.roomType === filters.roomType);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(room =>
        filters.amenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    setFilteredRooms(filtered);
  }, [filters, rooms]);

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      amenities: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Room</h1>
          <p className="text-gray-600">Discover amazing living spaces in your preferred location</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Rent Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rent Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minRent}
                      onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxRent}
                      onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="">All Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map(room => (
                  <Link
                    key={room.id}
                    to={`/room/${room.id}`}
                    className="card hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                      {room.owner.verified && (
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center shadow-md">
                          <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {room.area}, {room.city}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge badge-info">{room.roomType}</span>
                        <span className="badge badge-success">{room.furnishing}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Rent/month</p>
                          <p className="text-2xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</p>
                        </div>
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
