import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { GUJARAT_CITIES } from '../constants/cities';
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
  Heart,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter
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
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [userFilters, setUserFilters] = useState({ search: '', role: '', is_verified: '', city: '' });
  const [propertyFilters, setPropertyFilters] = useState({ search: '', city: '', property_type: '', is_active: '', min_rent: '', max_rent: '' });
  
  // Pagination and counts
  const [usersTotal, setUsersTotal] = useState(0);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  
  // Modal states
  const [viewModal, setViewModal] = useState({ open: false, type: '', data: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
        // Build filters object, excluding empty values
        const filters = {};
        if (userFilters.search) filters.search = userFilters.search;
        if (userFilters.role) filters.role = userFilters.role;
        if (userFilters.is_verified !== '') filters.is_verified = userFilters.is_verified;
        if (userFilters.city) filters.city = userFilters.city;
        
        const usersData = await adminService.getUsers(1, 20, filters);
        setUsers(usersData.users);
        setUsersTotal(usersData.total);
      } else if (activeSection === 'properties') {
        // Build filters object, excluding empty values
        const filters = {};
        if (propertyFilters.search) filters.search = propertyFilters.search;
        if (propertyFilters.city) filters.city = propertyFilters.city;
        if (propertyFilters.property_type) filters.property_type = propertyFilters.property_type;
        if (propertyFilters.is_active !== '') filters.is_active = propertyFilters.is_active;
        if (propertyFilters.min_rent) filters.min_rent = propertyFilters.min_rent;
        if (propertyFilters.max_rent) filters.max_rent = propertyFilters.max_rent;
        
        const propertiesData = await adminService.getProperties(1, 20, filters);
        setProperties(propertiesData.properties);
        setPropertiesTotal(propertiesData.total);
      } else if (activeSection === 'reports') {
        const reportsData = await adminService.getReports();
        setReports(reportsData.reports);
      } else if (activeSection === 'contacts') {
        const contactsData = await adminService.getContactRequests();
        setContacts(contactsData.contacts);
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

  const handleBlockUser = async (userId) => {
    if (!confirm('Are you sure you want to block/unblock this user?')) return;
    
    setActionLoading(true);
    try {
      await adminService.blockUser(userId);
      setError(null);
      fetchData(); // Refresh the list
      alert('User status updated successfully');
    } catch (error) {
      console.error('Failed to block user:', error);
      setError('Failed to block/unblock user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    setActionLoading(true);
    try {
      const userData = await adminService.getUserDetails(userId);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setError('Failed to load user details');
    } finally {
      setActionLoading(false);
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleViewProperty = async (propertyId) => {
    setActionLoading(true);
    try {
      const propertyData = await adminService.getPropertyDetails(propertyId);
      setSelectedProperty(propertyData);
      setShowPropertyModal(true);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      setError('Failed to load property details');
    } finally {
      setActionLoading(false);
    }
  };

  const closePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleToggleProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to activate/deactivate this property?')) return;
    
    setActionLoading(true);
    try {
      await adminService.togglePropertyActive(propertyId);
      setError(null);
      fetchData(); // Refresh the list
      alert('Property status updated successfully');
    } catch (error) {
      console.error('Failed to toggle property:', error);
      setError('Failed to activate/deactivate property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (type, id) => {
    try {
      let data;
      if (type === 'user') {
        data = await adminService.getUserDetails(id);
      } else if (type === 'property') {
        data = await adminService.getPropertyDetails(id);
      }
      setViewModal({ open: true, type, data });
    } catch (error) {
      console.error('Failed to fetch details:', error);
      alert('Failed to load details');
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
    { id: 'contacts', label: 'Contact Requests', icon: FileText },
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All Users</h3>
                    
                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by name, email, phone..."
                          value={userFilters.search}
                          onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* Role Filter */}
                      <select
                        value={userFilters.role}
                        onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Roles</option>
                        <option value="room_seeker">Room Seeker</option>
                        <option value="room_owner">Room Owner</option>
                      </select>

                      {/* Verification Filter */}
                      <select
                        value={userFilters.is_verified}
                        onChange={(e) => setUserFilters({ ...userFilters, is_verified: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                      </select>

                      {/* City Filter */}
                      <select
                        value={userFilters.city}
                        onChange={(e) => setUserFilters({ ...userFilters, city: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Cities</option>
                        {GUJARAT_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={fetchData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                        >
                          <Filter className="w-4 h-4" />
                          Apply Filters
                        </button>
                        <button
                          onClick={() => {
                            setUserFilters({ search: '', role: '', is_verified: '', city: '' });
                            setTimeout(fetchData, 100);
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                        >
                          Clear Filters
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{users.length}</span> of <span className="font-semibold text-gray-900">{usersTotal}</span> users
                      </div>
                    </div>
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
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
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
                              <div className="flex flex-col gap-1">
                                {user.is_verified ? (
                                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Verified</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Unverified</span>
                                )}
                                {!user.is_active && (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">Blocked</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewUser(user.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                  disabled={actionLoading}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleBlockUser(user.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.is_active 
                                      ? 'text-red-600 hover:bg-red-50' 
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                  title={user.is_active ? 'Block User' : 'Unblock User'}
                                  disabled={actionLoading}
                                >
                                  {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              </div>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All Properties</h3>
                    
                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Search */}
                      <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by title or locality..."
                          value={propertyFilters.search}
                          onChange={(e) => setPropertyFilters({ ...propertyFilters, search: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* City Filter */}
                      <select
                        value={propertyFilters.city}
                        onChange={(e) => setPropertyFilters({ ...propertyFilters, city: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Cities</option>
                        {GUJARAT_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      {/* Property Type Filter */}
                      <select
                        value={propertyFilters.property_type}
                        onChange={(e) => setPropertyFilters({ ...propertyFilters, property_type: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="pg">PG</option>
                        <option value="villa">Villa</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={propertyFilters.is_active}
                        onChange={(e) => setPropertyFilters({ ...propertyFilters, is_active: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>

                      {/* Min Rent */}
                      <input
                        type="number"
                        placeholder="Min Rent..."
                        value={propertyFilters.min_rent}
                        onChange={(e) => setPropertyFilters({ ...propertyFilters, min_rent: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />

                      {/* Max Rent */}
                      <input
                        type="number"
                        placeholder="Max Rent..."
                        value={propertyFilters.max_rent}
                        onChange={(e) => setPropertyFilters({ ...propertyFilters, max_rent: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={fetchData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                        >
                          <Filter className="w-4 h-4" />
                          Apply Filters
                        </button>
                        <button
                          onClick={() => {
                            setPropertyFilters({ search: '', city: '', property_type: '', is_active: '', min_rent: '', max_rent: '' });
                            setTimeout(fetchData, 100);
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                        >
                          Clear Filters
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{properties.length}</span> of <span className="font-semibold text-gray-900">{propertiesTotal}</span> properties
                      </div>
                    </div>
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
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {properties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.property_title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{property.city}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">₹{property.monthly_rent.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{property.property_type.replace('_', ' ')}</td>
                            <td className="px-6 py-4 text-sm">
                              {property.is_active ? (
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Active</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Inactive</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewProperty(property.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                  disabled={actionLoading}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleProperty(property.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    property.is_active 
                                      ? 'text-orange-600 hover:bg-orange-50' 
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                  title={property.is_active ? 'Deactivate Property' : 'Activate Property'}
                                  disabled={actionLoading}
                                >
                                  {property.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              </div>
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
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Property Reports & Complaints</h3>
                  </div>
                  {reports.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No reports found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reported By</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.property_title}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{report.user_name}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{report.user_email}</td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{report.reason}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Requests */}
              {activeSection === 'contacts' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Contact Requests</h3>
                  </div>
                  {contacts.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No contact requests found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">From</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">To (Owner)</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.property_title}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div>{contact.sender_name}</div>
                                <div className="text-xs text-gray-400">{contact.sender_email}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div>{contact.owner_name}</div>
                                <div className="text-xs text-gray-400">{contact.owner_email}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{contact.message || 'No message'}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                  contact.status === 'accepted' ? 'bg-green-50 text-green-600' :
                                  contact.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                  'bg-yellow-50 text-yellow-600'
                                }`}>
                                  {contact.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(contact.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={closeUserModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                {selectedUser.profile_photo ? (
                  <img
                    src={`http://localhost:8000${selectedUser.profile_photo}`}
                    alt={selectedUser.full_name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser.full_name?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.full_name}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedUser.is_verified && (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {!selectedUser.is_active && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        Blocked
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                      {selectedUser.role}
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
                    <p className="text-gray-900 font-medium">{selectedUser.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900 font-medium">{selectedUser.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Occupation</label>
                    <p className="text-gray-900 font-medium">{selectedUser.occupation || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900 font-medium">{selectedUser.age || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Bio</label>
                    <p className="text-gray-900">{selectedUser.bio || 'No bio provided'}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h5 className="text-lg font-bold text-gray-900 mb-4">Statistics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-blue-600">Properties Listed</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedUser.properties_count || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-green-600">Member Since</p>
                    <p className="text-sm font-bold text-green-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleBlockUser(selectedUser.id);
                    closeUserModal();
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    selectedUser.is_active
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                  disabled={actionLoading}
                >
                  {selectedUser.is_active ? 'Block User' : 'Unblock User'}
                </button>
                <button
                  onClick={closeUserModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
              <button
                onClick={closePropertyModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Property Header */}
              <div className="pb-6 border-b border-gray-200">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.property_title}</h4>
                <p className="text-gray-600 mb-3">{selectedProperty.area_locality}, {selectedProperty.city}</p>
                <div className="flex items-center gap-2">
                  {selectedProperty.is_active ? (
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
                    {selectedProperty.property_type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Images</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedProperty.images.slice(0, 6).map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8000${image}`}
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
                    <p className="text-xl font-bold text-gray-900">₹{selectedProperty.monthly_rent.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deposit</label>
                    <p className="text-xl font-bold text-gray-900">₹{selectedProperty.deposit.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Available From</label>
                    <p className="text-gray-900 font-medium">{new Date(selectedProperty.available_from).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Tenant</label>
                    <p className="text-gray-900 font-medium capitalize">{selectedProperty.preferred_tenant.replace('_', ' ')}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{selectedProperty.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              {selectedProperty.owner && (
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-4">Owner Information</h5>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900">{selectedProperty.owner.full_name}</p>
                    <p className="text-sm text-gray-600">{selectedProperty.owner.email}</p>
                    <p className="text-sm text-gray-600">{selectedProperty.owner.phone_number}</p>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Amenities</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {selectedProperty.house_rules && selectedProperty.house_rules.length > 0 && (
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">House Rules</h5>
                  <ul className="space-y-2">
                    {selectedProperty.house_rules.map((rule, index) => (
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
                    handleToggleProperty(selectedProperty.id);
                    closePropertyModal();
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    selectedProperty.is_active
                      ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                  disabled={actionLoading}
                >
                  {selectedProperty.is_active ? 'Deactivate Property' : 'Activate Property'}
                </button>
                <button
                  onClick={closePropertyModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
