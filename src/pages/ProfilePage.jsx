import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [rooms, setRooms] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
    const userListings = storedRooms.filter(room => room.owner.id === user.id);
    setRooms(userListings);

    const wishlistIds = user.wishlist || [];
    const wishlistRooms = storedRooms.filter(room => wishlistIds.includes(room.id));
    setWishlist(wishlistRooms);

    setEditData({ name: user.name, email: user.email, phone: user.phone, city: user.city });
    setProfilePhoto(user.profilePhoto);
  }, [user]);

  const profileCompletion = () => {
    let score = 0;
    let total = 4;
    if (user.name) score += 25;
    if (user.email) score += 25;
    if (user.phone) score += 25;
    if (user.city) score += 25;
    return score;
  };

  const handleSave = () => {
    updateUser({ ...editData, profilePhoto });
    setIsEditing(false);
    setToast({ message: 'Profile updated successfully', type: 'success' });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.current === passwordData.new) {
      setToast({ message: 'Current password and new password cannot be the same', type: 'error' });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    setToast({ message: 'Password updated successfully', type: 'success' });
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteRoom = (roomId) => {
    setRoomToDelete(roomId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const storedRooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
    const updatedRooms = storedRooms.filter(room => room.id !== roomToDelete);
    localStorage.setItem('roomatex_rooms', JSON.stringify(updatedRooms));
    
    setRooms(updatedRooms.filter(room => room.owner.id === user.id));
    setShowDeleteModal(false);
    setToast({ message: 'Room deleted successfully', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl mx-auto mb-4">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <label htmlFor="profilePhotoUpload" className="absolute bottom-4 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="profilePhotoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-bold text-primary-600">{profileCompletion()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${profileCompletion()}%` }}></div>
                </div>
              </div>

              <nav className="space-y-1">
                {(user.role === 'admin' ? ['profile', 'settings'] : ['profile', 'listings', 'wishlist', 'settings']).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize ${
                      activeTab === tab ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-primary">Edit Profile</button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="input-field"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="input-field"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        className="input-field"
                        value={editData.city}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setIsEditing(false)} className="flex-1 btn-outline">Cancel</button>
                      <button onClick={handleSave} className="flex-1 btn-primary">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b">
                      <span className="text-gray-600">Name</span>
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-semibold">{user.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <span className="text-gray-600">City</span>
                      <span className="font-semibold">{user.city}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Listings ({rooms.length})</h2>
                  <Link to="/add-room" className="btn-primary">Add New Room</Link>
                </div>

                {rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">You haven't listed any rooms yet</p>
                    <Link to="/add-room" className="btn-primary">List Your First Room</Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {rooms.map(room => (
                      <div key={room.id} className="card">
                        <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                        <div className="p-5">
                          <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                            <span className={`badge ${room.active ? 'badge-success' : 'badge-warning'}`}>
                              {room.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/room/${room.id}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">
                              View
                            </Link>
                            <Link to={`/add-room?edit=${room.id}`} className="flex-1 text-center py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-sm font-medium">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium flex items-center justify-center gap-1"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h2>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                    <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {wishlist.map(room => (
                      <Link key={room.id} to={`/room/${room.id}`} className="card hover:shadow-lg transition-all">
                        <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                        <div className="p-5">
                          <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">{room.area}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="input-field" placeholder="Enter current password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" className="input-field" placeholder="Enter new password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" className="input-field" placeholder="Confirm new password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                      </div>
                      <button onClick={handlePasswordChange} className="btn-primary">Update Password</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Room">
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this room listing? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-outline">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
