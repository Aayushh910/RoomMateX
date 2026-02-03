import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Upload, X } from 'lucide-react';

export const AddRoom = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    city: '',
    area: '',
    gender: 'Any',
    roomType: 'Private Room',
    furnished: true,
    amenities: [],
    rules: '',
    deposit: '',
    preferredAge: '',
  });

  const amenitiesList = ['WiFi', 'AC', 'Kitchen', 'Parking', 'Security', 'Washing Machine', 'Gym', 'Power Backup'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length < 3) {
      setAlert({ type: 'error', message: 'Please upload at least 3 photos' });
      return;
    }
    setAlert({ type: 'success', message: 'Room listed successfully!' });
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      setAlert({ type: 'error', message: 'Maximum 10 images allowed' });
      return;
    }
    setImages([...images, ...files.map(file => URL.createObjectURL(file))]);
  };

  const toggleAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">List Your Room</h1>
          <p className="text-dark-600">Fill in the details to create your listing</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Room Title"
                required
                placeholder="e.g., Cozy Studio in Downtown"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  className="input min-h-32"
                  placeholder="Describe your room..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Monthly Rent (₹)"
                  type="number"
                  required
                  placeholder="12000"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                />
                <Input
                  label="Security Deposit (₹)"
                  type="number"
                  required
                  placeholder="24000"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                required
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="Area"
                required
                placeholder="Bandra West"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Room Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <select
                    className="input"
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender Preference</label>
                  <select
                    className="input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                  className="rounded"
                />
                <span className="font-medium">Furnished</span>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-dark-200 hover:border-dark-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Photos (Minimum 3)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-dark-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                  <Upload className="w-8 h-8 text-dark-400 mb-2" />
                  <span className="text-sm text-dark-600">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">House Rules</h2>
            <textarea
              className="input min-h-24"
              placeholder="e.g., No smoking, No pets, No loud music after 10 PM"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
            />
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => navigate('/dashboard')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
