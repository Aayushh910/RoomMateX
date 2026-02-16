import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockRooms } from '../data/mockData';

export const AdminDashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mock Data for Admin
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'owner', status: 'Active', joined: '2024-01-20' },
        { id: 3, name: 'Mike Ross', email: 'mike@example.com', role: 'user', status: 'Suspended', joined: '2024-02-01' },
    ]);

    const [rooms, setRooms] = useState(mockRooms.map(r => ({ ...r, status: 'Active' })));

    const [messages] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        const mocks = [
            { id: 1, name: 'Alice', email: 'alice@test.com', subject: 'Login Issue', message: 'I cannot reset my password.', date: '2024-02-10', status: 'Pending' },
            { id: 2, name: 'Bob', email: 'bob@test.com', subject: 'Refund Request', message: 'I want a refund for my subscription.', date: '2024-02-09', status: 'Resolved' },
        ];
        return [...stored, ...mocks];
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleRoomStatus = (id) => {
        setRooms(prev => prev.map(room =>
            room.id === id ? { ...room, status: room.status === 'Active' ? 'Inactive' : 'Active' } : room
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Admin Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">RoomMateX <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded ml-1">ADMIN</span></span>
                            </div>
                            <div className="hidden md:flex items-center space-x-1">
                                {['Dashboard', 'All Users', 'All Listed Rooms', 'Messages'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.toLowerCase()
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 font-medium mb-1">Total Users</p>
                                <p className="text-4xl font-bold text-gray-900">{users.length}</p>
                                <span className="text-green-500 text-sm font-bold">+12% this month</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 font-medium mb-1">Active Rooms</p>
                                <p className="text-4xl font-bold text-gray-900">{rooms.filter(r => r.status === 'Active').length}</p>
                                <span className="text-green-500 text-sm font-bold">+5 new today</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 font-medium mb-1">Pending Messages</p>
                                <p className="text-4xl font-bold text-gray-900">{messages.filter(m => m.status === 'Pending').length}</p>
                                <span className="text-yellow-500 text-sm font-bold">Needs attention</span>
                            </div>
                        </div>

                        {/* Visual Data Placeholder */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <p className="text-gray-400 font-medium">User Growth Chart Area</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <p className="text-gray-400 font-medium">Revenue Analytics Area</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'all users' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-sm font-bold text-gray-500">Name</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Email</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Role</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Joined</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase">{user.role}</span></td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{user.status}</span></td>
                                            <td className="p-4 text-gray-500 text-sm">{user.joined}</td>
                                            <td className="p-4">
                                                <button className="text-sm font-bold text-primary-600 hover:text-primary-700">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'all listed rooms' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-sm font-bold text-gray-500">Room Name</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Owner</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Rent</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Location</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                                        <th className="p-4 text-sm font-bold text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900">{room.title}</td>
                                            <td className="p-4 text-gray-600">{room.owner.name}</td>
                                            <td className="p-4 font-bold">₹{room.rent}</td>
                                            <td className="p-4 text-gray-500 text-sm">{room.city}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleRoomStatus(room.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${room.status === 'Active'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {room.status}
                                                </button>
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                <button className="text-sm font-bold text-gray-500 hover:text-gray-700">View</button>
                                                <button className="text-sm font-bold text-red-500 hover:text-red-700">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {messages.map(msg => (
                                <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${msg.status === 'Pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                            <h4 className="font-bold text-gray-900">{msg.subject}</h4>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">{msg.date}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{msg.message}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">From: <span className="font-medium text-gray-900">{msg.name}</span> ({msg.email})</div>
                                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">Reply</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
