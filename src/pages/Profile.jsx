import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { User, Mail, Phone, MapPin, Edit, Save, Shield, Star } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    setAlert({ type: 'success', message: 'Profile updated successfully' });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <Card className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-display font-bold">{user?.name}</h1>
                  {user?.verified && (
                    <Badge variant="success">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-dark-600 capitalize">{user?.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-dark-600">Trust Score</span>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? <><Save className="w-4 h-4 mr-2" />Save</> : <><Edit className="w-4 h-4 mr-2" />Edit</>}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
                  <User className="w-5 h-5 text-dark-600" />
                  <div>
                    <div className="text-sm text-dark-600">Name</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
                  <Mail className="w-5 h-5 text-dark-600" />
                  <div>
                    <div className="text-sm text-dark-600">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
                  <Phone className="w-5 h-5 text-dark-600" />
                  <div>
                    <div className="text-sm text-dark-600">Phone</div>
                    <div className="font-medium">{user?.phone || 'Not provided'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-dark-600" />
                  <div>
                    <div className="text-sm text-dark-600">City</div>
                    <div className="font-medium">{user?.city || 'Not provided'}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-display font-bold text-primary-600 mb-1">0</div>
            <div className="text-dark-600">Listings</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-display font-bold text-primary-600 mb-1">0</div>
            <div className="text-dark-600">Reviews</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-display font-bold text-primary-600 mb-1">0</div>
            <div className="text-dark-600">Wishlist</div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
