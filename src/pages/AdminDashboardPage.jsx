import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  Flame,
  TrendingUp,
  Star,
  Heart
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  const adminData = adminService.getAdminData();

  useEffect(() => {
    // Check if admin is logged in
    if (!adminService.isAdmin() || !localStorage.getItem('admin_access_token')) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeSection === 'dashboard') {
        const [statsData, analyticsData] = await Promise.all([
          adminService.getStats(),
          adminService.getAnalytics()
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } else if (activeSection === 'users') {
        const usersData = await adminService.getUsers();
        setUsers(usersData.users);
      } else if (activeSection === 'properties') {
        const propertiesData = await adminService.getProperties();
        setProperties(propertiesData.properties);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          adminService.logout();
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'properties', label: 'Properties/Listings', icon: Home },
    { id: 'reports', label: 'Reports/Complaints', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">RoomMateX</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
            {sidebarOpen && <span className="font-semibold">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{adminData?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Dashboard Overview with Charts */}
              {activeSection === 'dashboard' && analytics && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.total_users}</h3>
                      <p className="text-sm text-gray-500 font-medium">Total Users</p>
                      <p className="text-xs text-green-600 mt-2">
                        {analytics.summary.verified_users} verified
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.verified_users}</h3>
                      <p className="text-sm text-gray-500 font-medium">Verified Users</p>
                      <p className="text-xs text-gray-600 mt-2">
                        {((analytics.summary.verified_users / analytics.summary.total_users) * 100).toFixed(1)}% of total
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.total_properties}</h3>
                      <p className="text-sm text-gray-500 font-medium">Total Properties</p>
                      <p className="text-xs text-purple-600 mt-2">
                        {analytics.summary.active_properties} active
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Flame className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.active_properties}</h3>
                      <p className="text-sm text-gray-500 font-medium">Active Properties</p>
                      <p className="text-xs text-orange-600 mt-2">
                        {((analytics.summary.active_properties / analytics.summary.total_properties) * 100).toFixed(1)}% active
                      </p>
                    </div>
                  </div>

                  {/* Additional Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Star className="w-8 h-8" />
                        <span className="text-3xl font-bold">{analytics.summary.average_rating}</span>
                      </div>
                      <p className="text-blue-100 font-medium">Average Rating</p>
                      <p className="text-xs text-blue-200 mt-1">{analytics.summary.total_reviews} reviews</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Heart className="w-8 h-8" />
                        <span className="text-3xl font-bold">{analytics.summary.total_wishlists}</span>
                      </div>
                      <p className="text-pink-100 font-medium">Total Wishlists</p>
                      <p className="text-xs text-pink-200 mt-1">User favorites</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="w-8 h-8" />
                        <span className="text-3xl font-bold">{analytics.summary.total_reviews}</span>
                      </div>
                      <p className="text-purple-100 font-medium">Total Reviews</p>
                      <p className="text-xs text-purple-200 mt-1">User feedback</p>
                    </div>
                  </div>

                  {/* Charts Row 1 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Registration Trend */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">User Registration Trend (Last 30 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.users_trend}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip />
                          <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Property Listing Trend */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Property Listing Trend (Last 30 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.properties_trend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="properties" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Charts Row 2 */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Roles Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">User Roles</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics.user_roles}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.user_roles.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Property Types */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Property Types</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics.property_types}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.property_types.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Verification Status */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Status</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics.verification_status}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.verification_status.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#F59E0B'} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Charts Row 3 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* City Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Cities by Properties</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.city_distribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="city" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="properties" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Rent Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Rent Price Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.rent_distribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="range" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#EC4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Management */}
              {activeSection === 'users' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">All Users</h3>
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
                              {user.is_verified ? (
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Verified</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Unverified</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Properties Management */}
              {activeSection === 'properties' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">All Properties</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">City</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rent</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {properties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{property.city}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">₹{property.rent}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{property.property_type}</td>
                            <td className="px-6 py-4 text-sm">
                              {property.is_active ? (
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Active</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Inactive</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports/Complaints */}
              {activeSection === 'reports' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reports & Complaints</h3>
                  <p className="text-gray-500">This section is under development</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
