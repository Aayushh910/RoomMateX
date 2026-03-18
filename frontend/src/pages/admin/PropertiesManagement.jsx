import { Search, Filter, Eye, XCircle, CheckCircle } from 'lucide-react';
import { GUJARAT_CITIES } from '../../constants/cities';

export const PropertiesManagement = ({ 
  properties = [], 
  propertiesTotal = 0, 
  propertyFilters, 
  setPropertyFilters, 
  onApplyFilters, 
  onClearFilters,
  onViewProperty,
  onToggleProperty,
  actionLoading 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Properties</h3>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or locality..."
              value={propertyFilters.search}
              onChange={(e) => setPropertyFilters({ ...propertyFilters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* City Filter */}
          <select
            value={propertyFilters.city}
            onChange={(e) => setPropertyFilters({ ...propertyFilters, city: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Cities</option>
            {GUJARAT_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Property Type Filter */}
          <select
            value={propertyFilters.property_type}
            onChange={(e) => setPropertyFilters({ ...propertyFilters, property_type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="pg">PG</option>
            <option value="villa">Villa</option>
          </select>

          {/* Status Filter */}
          <select
            value={propertyFilters.is_active}
            onChange={(e) => setPropertyFilters({ ...propertyFilters, is_active: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Min Rent */}
          <input
            type="number"
            placeholder="Min Rent..."
            value={propertyFilters.min_rent}
            onChange={(e) => setPropertyFilters({ ...propertyFilters, min_rent: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />

          {/* Max Rent */}
          <input
            type="number"
            placeholder="Max Rent..."
            value={propertyFilters.max_rent}
            onChange={(e) => setPropertyFilters({ ...propertyFilters, max_rent: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={onApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{properties.length}</span> of <span className="font-semibold text-gray-900">{propertiesTotal}</span> properties
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rent</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.property_title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">₹{property.monthly_rent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{property.property_type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-sm">
                    {property.is_active ? (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewProperty(property.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                        disabled={actionLoading}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleProperty(property.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          property.is_active 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={property.is_active ? 'Deactivate Property' : 'Activate Property'}
                        disabled={actionLoading}
                      >
                        {property.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
