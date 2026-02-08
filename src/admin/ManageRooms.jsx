import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';

export const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem('roomatex_rooms') || '[]');
    setRooms(storedRooms);
  }, []);

  const toggleStatus = (roomId) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId ? { ...room, active: !room.active } : room
    );
    setRooms(updatedRooms);
    localStorage.setItem('roomatex_rooms', JSON.stringify(updatedRooms));
    setToast({ message: 'Room status updated', type: 'success' });
  };

  const handleDelete = (roomId) => {
    setRoomToDelete(roomId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedRooms = rooms.filter(room => room.id !== roomToDelete);
    setRooms(updatedRooms);
    localStorage.setItem('roomatex_rooms', JSON.stringify(updatedRooms));
    setShowDeleteModal(false);
    setToast({ message: 'Room deleted successfully', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Rooms</h1>

        {rooms.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No rooms to manage</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="card">
                <img src={room.images[0]} alt={room.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Owner: {room.owner.name}</p>
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
                    <button
                      onClick={() => toggleStatus(room.id)}
                      className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-sm font-medium"
                    >
                      {room.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Room">
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this room? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-outline">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
