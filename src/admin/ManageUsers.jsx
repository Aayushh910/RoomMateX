import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/ui/Toast';

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', verified: true, city: 'Pune' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', verified: false, city: 'Mumbai' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', verified: true, city: 'Bangalore' },
];

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([currentUser, ...mockUsers]);
  const [toast, setToast] = useState(null);

  const toggleVerification = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    setToast({ message: 'User verification status updated', type: 'success' });
  };

  const changeRole = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setToast({ message: 'User role updated', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={user.id === currentUser.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${user.verified ? 'badge-success' : 'badge-warning'}`}>
                      {user.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleVerification(user.id)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      {user.verified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
