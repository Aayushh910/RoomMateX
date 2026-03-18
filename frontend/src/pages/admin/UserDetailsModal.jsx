import { XCircle, CheckCircle, Ban } from 'lucide-react';

// Helper function to get correct image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a local path, prepend backend URL
  return `http://localhost:8000${imageUrl}`;
};

export const UserDetailsModal = ({ user, onClose, onBlockUser, actionLoading }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            {user.profile_photo ? (
              <img
                src={getImageUrl(user.profile_photo)}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.full_name?.[0] || 'U'}
              </div>
            )}
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{user.full_name}</h4>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.is_verified && (
                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {!user.is_active && (
                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Ban className="w-3 h-3" />
                    Blocked
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h5 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-gray-900 font-medium">{user.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-gray-900 font-medium">{user.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Occupation</label>
                <p className="text-gray-900 font-medium">{user.occupation || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-gray-900 font-medium">{user.age || 'Not provided'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h5 className="text-lg font-bold text-gray-900 mb-4">Statistics</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-blue-600">Properties Listed</p>
                <p className="text-2xl font-bold text-blue-900">{user.properties_count || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-green-600">Member Since</p>
                <p className="text-sm font-bold text-green-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onBlockUser(user.id);
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                user.is_active
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
              disabled={actionLoading}
            >
              {user.is_active ? 'Block User' : 'Unblock User'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
