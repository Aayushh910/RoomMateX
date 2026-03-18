import { XCircle, CheckCircle } from 'lucide-react';

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

export const PropertyDetailsModal = ({ property, onClose, onToggleProperty, actionLoading }) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Property Header */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{property.property_title}</h4>
            <p className="text-gray-600 mb-3">{property.area_locality}, {property.city}</p>
            <div className="flex items-center gap-2">
              {property.is_active ? (
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Inactive
                </span>
              )}
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold capitalize">
                {property.property_type.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Property Images */}
          {property.images && property.images.length > 0 && (
            <div>
              <h5 className="text-lg font-bold text-gray-900 mb-3">Images</h5>
              <div className="grid grid-cols-3 gap-3">
                {property.images.slice(0, 6).map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Property Information */}
          <div>
            <h5 className="text-lg font-bold text-gray-900 mb-4">Property Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                <p className="text-xl font-bold text-gray-900">₹{property.monthly_rent.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Deposit</label>
                <p className="text-xl font-bold text-gray-900">₹{property.deposit.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Available From</label>
                <p className="text-gray-900 font-medium">{new Date(property.available_from).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Preferred Tenant</label>
                <p className="text-gray-900 font-medium capitalize">{property.preferred_tenant.replace('_', ' ')}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{property.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          {property.owner && (
            <div>
              <h5 className="text-lg font-bold text-gray-900 mb-4">Owner Information</h5>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold text-gray-900">{property.owner.full_name}</p>
                <p className="text-sm text-gray-600">{property.owner.email}</p>
                <p className="text-sm text-gray-600">{property.owner.phone_number}</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h5 className="text-lg font-bold text-gray-900 mb-3">Amenities</h5>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {property.house_rules && property.house_rules.length > 0 && (
            <div>
              <h5 className="text-lg font-bold text-gray-900 mb-3">House Rules</h5>
              <ul className="space-y-2">
                {property.house_rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onToggleProperty(property.id);
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                property.is_active
                  ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
              disabled={actionLoading}
            >
              {property.is_active ? 'Deactivate Property' : 'Activate Property'}
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
