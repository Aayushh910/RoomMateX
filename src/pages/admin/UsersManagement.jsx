import { Search, Filter, Eye, Ban, CheckCircle } from 'lucide-react';
import { GUJARAT_CITIES } from '../../constants/cities';

export const UsersManagement = ({ 
  users, 
  usersTotal, 
  userFilters, 
  setUserFilters, 
  onApplyFilters, 
  onClearFilters,
  onViewUser,
  onBlockUser,
  actionLoading 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Users</h3>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={userFilters.search}
              onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Role Filter */}
          <select
            value={userFilters.role}
            onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Roles</option>
            <option value="room_seeker">Room Seeker</option>
            <option value="room_owner">Room Owner</option>
          </select>

          {/* Verification Filter */}
          <select
            value={userFilters.is_verified}
            onChange={(e) => setUserFilters({ ...userFilters, is_verified: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          {/* City Filter */}
          <select
            value={userFilters.city}
            onChange={(e) => setUserFilters({ ...userFilters, city: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Cities</option>
            {GUJARAT_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
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
            Showing <span className="font-semibold text-gray-900">{users.length}</span> of <span className="font-semibold text-gray-900">{usersTotal}</span> users
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.city}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    {user.is_verified ? (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Verified</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Unverified</span>
                    )}
                    {!user.is_active && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">Blocked</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewUser(user.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                      disabled={actionLoading}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onBlockUser(user.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.is_active 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={user.is_active ? 'Block User' : 'Unblock User'}
                      disabled={actionLoading}
                    >
                      {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
