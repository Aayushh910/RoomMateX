import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { cities, amenitiesList } from '../data/mockData';
import { propertyService } from '../services/propertyService';
import { getImageUrl } from '../utils/imageUtils';

export const RoomsPage = () => {
    const [filters, setFilters] = useState({
        search: '',
        city: '',
        rentMin: 0,
        rentMax: 100000,
        gender: '',
        amenities: [],
    });
    const [sortBy, setSortBy] = useState('newest');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch properties from API
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProperties();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.city, filters.rentMin, filters.rentMax, filters.amenities]);

    const fetchProperties = async () => {
        setError('');
        
        try {
            const apiFilters = {
                city: filters.city || undefined,
                minRent: filters.rentMin > 0 ? filters.rentMin : undefined,
                maxRent: filters.rentMax || undefined,
                amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
            };
            
            const response = await propertyService.getProperties(apiFilters);
            setRooms(response.data || []);
        } catch (err) {
            console.error('Failed to fetch properties:', err);
            setError('Failed to load properties. Please try again.');
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAmenityChange = (amenity) => {
        setFilters(prev => {
            if (prev.amenities.includes(amenity)) {
                return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...prev.amenities, amenity] };
            }
        });
    };

    // Client-side filtering for search and sorting
    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = filters.search === '' ||
            room.property_title.toLowerCase().includes(filters.search.toLowerCase()) ||
            room.area_locality.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesGender = filters.gender === '' || filters.gender === 'Any' ||
            (filters.gender === 'Male' && (room.preferred_tenant === 'male' || room.preferred_tenant === 'any')) ||
            (filters.gender === 'Female' && (room.preferred_tenant === 'female' || room.preferred_tenant === 'any')) ||
            (filters.gender === 'Family' && (room.preferred_tenant === 'family' || room.preferred_tenant === 'any'));
        
        return matchesSearch && matchesGender;
    }).sort((a, b) => {
        if (sortBy === 'priceLow') return a.monthly_rent - b.monthly_rent;
        if (sortBy === 'priceHigh') return b.monthly_rent - a.monthly_rent;
        return 0;
    });

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Navbar />
            {/* Mobile Filter Toggle (Visible only on small screens) */}
            <div className="md:hidden bg-white p-4 border-b border-gray-200 sticky top-16 z-20">
                <button className="w-full py-2 bg-gray-100 rounded-lg font-bold text-gray-700 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filters
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex gap-8">
                {/* Sidebar Filters (Desktop) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="glass-panel rounded-2xl p-6 sticky top-32 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setFilters({ search: '', city: '', rentMin: 0, rentMax: 100000, gender: '', amenities: [] })}
                                className="text-sm text-primary-600 font-semibold hover:text-primary-700"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* City */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            {/* Rent Range */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rent Range (₹)</label>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={filters.rentMin}
                                        onChange={(e) => setFilters({ ...filters, rentMin: parseInt(e.target.value) })}
                                        min="0"
                                        className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm"
                                        placeholder="Min"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        value={filters.rentMax}
                                        onChange={(e) => setFilters({ ...filters, rentMax: parseInt(e.target.value) })}
                                        min="0"
                                        className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="1000"
                                    value={filters.rentMax}
                                    onChange={(e) => setFilters({ ...filters, rentMax: parseInt(e.target.value) })}
                                    className="w-full accent-primary-600 cursor-pointer"
                                />
                            </div>

                            {/* Gender Preference */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Gender Preference</label>
                                <div className="space-y-2">
                                    {['Any', 'Male', 'Female', 'Family'].map((g) => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                checked={filters.gender === (g === 'Any' ? '' : g)}
                                                onChange={() => setFilters({ ...filters, gender: g === 'Any' ? '' : g })}
                                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-600">{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Amenities</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {amenitiesList.map((amenity) => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.amenities.includes(amenity)}
                                                onChange={() => handleAmenityChange(amenity)}
                                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-600 capitalize">{amenity.replace(/_/g, ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by location, landmark, or building..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600">
                            {loading ? 'Loading...' : `Showing ${filteredRooms.length} results`}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 cursor-pointer hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                disabled={loading}
                            >
                                <option value="newest">Newest First</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-56 bg-gray-200"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredRooms.map((room) => (
                                <Link to={`/rooms/${room.id}`} key={room.id} className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] flex flex-col">
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                                        <img
                                            src={getImageUrl(room.images && room.images.length > 0 ? room.images[0] : null)}
                                            alt={room.property_title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            {room.owner_verified && (
                                                <div className="flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">{room.property_title}</h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {room.area_locality}, {room.city}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded">
                                                {amenity.replace('_', ' ')}
                                            </span>
                                        ))}
                                        {room.amenities && room.amenities.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded">
                                                +{room.amenities.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${room.preferred_tenant === 'female' ? 'bg-pink-100 text-pink-700' : room.preferred_tenant === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {room.preferred_tenant === 'any' ? 'Any' : room.preferred_tenant.charAt(0).toUpperCase() + room.preferred_tenant.slice(1)}
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xl font-bold text-primary-600">
                                            ₹{room.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                        </div>
                                        <button className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-primary-700 transition-all">
                                            View Details <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredRooms.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20 glass-panel rounded-2xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                                <p className="text-gray-500 mb-6">We couldn't find any rooms matching your filters.</p>
                                <button
                                    onClick={() => setFilters({ search: '', city: '', rentMin: 0, rentMax: 100000, gender: '', amenities: [] })}
                                    className="text-primary-600 font-bold hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
