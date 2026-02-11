import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cities, roomTypes, amenitiesList } from '../data/mockData';
import { Toast } from '../components/ui/Toast';

export const AddRoomPage = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: ['', '', ''],
    rent: '',
    deposit: '',
    city: '',
    area: '',
    roomType: '',
    furnishing: 'Fully Furnished',
    amenities: [],
    preferredGender: 'Any',
    rules: [''],
  });

  useEffect(() => {
    if (editId) {
      const rooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
      const room = rooms.find(r => r.id === editId);
      if (room && room.owner.id === user.id) {
        setFormData({
          title: room.title,
          description: room.description,
          images: room.images.length >= 3 ? room.images : [...room.images, ...Array(3 - room.images.length).fill('')],
          rent: room.rent,
          deposit: room.deposit,
          city: room.city,
          area: room.area,
          roomType: room.roomType,
          furnishing: room.furnishing,
          amenities: room.amenities,
          preferredGender: room.preferredGender || 'Any',
          rules: room.rules,
        });
      }
    }
  }, [editId, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length < 3) {
      setToast({ message: 'Please provide at least 3 images', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://127.0.0.1:8000/api/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          rent: Number(formData.rent),
          deposit: Number(formData.deposit),
          city: formData.city,
          area: formData.area,
          room_type: formData.roomType,
          furnishing: formData.furnishing,
          preferred_gender: formData.preferredGender,
          amenities: formData.amenities,
          house_rules: formData.rules.join('\n'),
          image_urls: validImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({ message: data.detail || 'Failed to list room', type: 'error' });
        return;
      }

      setToast({ message: 'Room listed successfully!', type: 'success' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error(error);
      setToast({ message: 'Server error', type: 'error' });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{editId ? 'Edit Room' : 'List Your Room'}</h1>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Title *</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Spacious 2BHK in Koregaon Park"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows="4"
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your room..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Minimum 3 required) *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const readers = files.map(file => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(file);
                    });
                  });
                  Promise.all(readers).then(results => {
                    setFormData({ ...formData, images: results });
                  });
                }}
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
            {formData.images.length > 0 && formData.images[0] && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.images.map((img, idx) => (
                  img && (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx + 1}`} className="h-32 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== idx);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rent (₹/month) *</label>
              <input
                type="number"
                required
                className="input-field"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposit (₹) *</label>
              <input
                type="number"
                required
                className="input-field"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <select required className="input-field" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                <option value="">Select City</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
              <select required className="input-field" value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}>
                <option value="">Select Type</option>
                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing *</label>
              <select required className="input-field" value={formData.furnishing} onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
                      } else {
                        setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender *</label>
            <select required className="input-field" value={formData.preferredGender} onChange={(e) => setFormData({ ...formData, preferredGender: e.target.value })}>
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Rules</label>
            <textarea
              rows="3"
              className="input-field"
              value={formData.rules.join('\n')}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value.split('\n').filter(r => r.trim()) })}
              placeholder="Enter house rules (one per line)&#10;e.g., No smoking&#10;No pets&#10;Quiet hours after 10 PM"
            />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editId ? 'Update Room' : 'List Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
