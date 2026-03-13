import { Users, UserCheck, Building2, Flame, TrendingUp, Star, Heart, FileText, AlertTriangle, CheckCircle, XCircle, Clock, Activity, Eye, MessageSquare, MapPin } from 'lucide-react';
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
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const AdminDashboard = ({ analytics }) => {
  if (!analytics) return null;

  // Prepare data for radial chart
  const verificationData = [
    {
      name: 'Verified',
      value: analytics.summary.verified_users,
      fill: '#10B981'
    },
    {
      name: 'Unverified',
      value: analytics.summary.unverified_users,
      fill: '#F59E0B'
    }
  ];

  const propertyStatusData = [
    {
      name: 'Active',
      value: analytics.summary.active_properties,
      fill: '#3B82F6'
    },
    {
      name: 'Inactive',
      value: analytics.summary.inactive_properties,
      fill: '#9CA3AF'
    }
  ];

  // Combined trend data for comparison
  const combinedTrendData = analytics.users_trend.map((item, index) => ({
    date: item.date,
    users: item.users,
    properties: analytics.properties_trend[index]?.properties || 0
  }));

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.total_users}</h3>
            <p className="text-sm text-gray-700">Total Users</p>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600">{analytics.summary.verified_users} verified ({((analytics.summary.verified_users / analytics.summary.total_users) * 100).toFixed(1)}%)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.total_properties}</h3>
            <p className="text-sm text-gray-700">Total Properties</p>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-gray-600">{analytics.summary.active_properties} active ({((analytics.summary.active_properties / analytics.summary.total_properties) * 100).toFixed(1)}%)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.total_reports}</h3>
            <p className="text-sm text-gray-700">Total Reports</p>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-xs text-gray-600">{analytics.summary.pending_reports} pending review</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <MessageSquare className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.summary.average_rating}</h3>
            <p className="text-sm text-gray-700">Average Rating</p>
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-xs text-gray-600">{analytics.summary.total_reviews} total reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics with Radial Charts */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">User Verification Rate</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Verified', value: analytics.summary.verified_users, fill: '#10B981' },
                    { name: 'Unverified', value: analytics.summary.unverified_users, fill: '#F3F4F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {[
                    <Cell key="cell-0" fill="#10B981" />,
                    <Cell key="cell-1" fill="#F3F4F6" />
                  ]}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                  {((analytics.summary.verified_users / analytics.summary.total_users) * 100).toFixed(1)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600">{analytics.summary.verified_users} of {analytics.summary.total_users} users</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Property Active Rate</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: analytics.summary.active_properties, fill: '#3B82F6' },
                    { name: 'Inactive', value: analytics.summary.inactive_properties, fill: '#F3F4F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {[
                    <Cell key="cell-0" fill="#3B82F6" />,
                    <Cell key="cell-1" fill="#F3F4F6" />
                  ]}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                  {((analytics.summary.active_properties / analytics.summary.total_properties) * 100).toFixed(1)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600">{analytics.summary.active_properties} of {analytics.summary.total_properties} properties</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Report Resolution Rate</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Resolved', value: analytics.summary.fixed_reports + analytics.summary.rejected_reports, fill: '#10B981' },
                    { name: 'Pending', value: analytics.summary.pending_reports, fill: '#F3F4F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {[
                    <Cell key="cell-0" fill="#10B981" />,
                    <Cell key="cell-1" fill="#F3F4F6" />
                  ]}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                  {analytics.summary.total_reports > 0 ? (((analytics.summary.fixed_reports + analytics.summary.rejected_reports) / analytics.summary.total_reports) * 100).toFixed(1) : 0}%
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600">{analytics.summary.fixed_reports + analytics.summary.rejected_reports} of {analytics.summary.total_reports} resolved</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Engagement Score</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { 
                      name: 'Engagement', 
                      value: Math.min(((analytics.summary.total_wishlists + analytics.summary.total_reviews) / analytics.summary.total_users) * 20, 100), 
                      fill: '#EC4899' 
                    },
                    { 
                      name: 'Remaining', 
                      value: 100 - Math.min(((analytics.summary.total_wishlists + analytics.summary.total_reviews) / analytics.summary.total_users) * 20, 100), 
                      fill: '#F3F4F6' 
                    }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {[
                    <Cell key="cell-0" fill="#EC4899" />,
                    <Cell key="cell-1" fill="#F3F4F6" />
                  ]}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                  {Math.min(((analytics.summary.total_wishlists + analytics.summary.total_reviews) / analytics.summary.total_users) * 20, 100).toFixed(1)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600">{analytics.summary.total_wishlists + analytics.summary.total_reviews} interactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Reports & Complaints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.pending_reports}</h3>
                <p className="text-sm text-gray-700">Pending</p>
              </div>
            </div>
            <div className="h-1 bg-yellow-300 rounded-full mt-3">
              <div 
                className="h-1 bg-yellow-600 rounded-full" 
                style={{ width: `${analytics.summary.total_reports > 0 ? (analytics.summary.pending_reports / analytics.summary.total_reports) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.fixed_reports}</h3>
                <p className="text-sm text-gray-700">Fixed</p>
              </div>
            </div>
            <div className="h-1 bg-green-300 rounded-full mt-3">
              <div 
                className="h-1 bg-green-600 rounded-full" 
                style={{ width: `${analytics.summary.total_reports > 0 ? (analytics.summary.fixed_reports / analytics.summary.total_reports) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.rejected_reports}</h3>
                <p className="text-sm text-gray-700">Rejected</p>
              </div>
            </div>
            <div className="h-1 bg-red-300 rounded-full mt-3">
              <div 
                className="h-1 bg-red-600 rounded-full" 
                style={{ width: `${analytics.summary.total_reports > 0 ? (analytics.summary.rejected_reports / analytics.summary.total_reports) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Trends */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Trends (Last 30 Days)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Combined Growth Overview</h4>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={combinedTrendData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorUsers)"
                  name="New Users"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="properties" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', r: 4 }}
                  name="New Properties"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution Analytics */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Distribution Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-4">User Roles</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.user_roles}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.user_roles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics.user_roles.map((role, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-700">{role.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{role.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Property Types</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.property_types}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.property_types.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics.property_types.map((type, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-700">{type.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{type.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Report Status</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.report_status}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.report_status.map((entry, index) => {
                    const colors = { 'Pending': '#F59E0B', 'Fixed': '#10B981', 'Rejected': '#EF4444' };
                    return <Cell key={`cell-${index}`} fill={colors[entry.name] || COLORS[index]} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics.report_status.map((status, index) => {
                const colors = { 'Pending': '#F59E0B', 'Fixed': '#10B981', 'Rejected': '#EF4444' };
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[status.name] }}></div>
                      <span className="text-gray-700">{status.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{status.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic & Pricing Analytics */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic & Pricing Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-900">Top Cities by Properties</h4>
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.city_distribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={11} />
                <YAxis dataKey="city" type="category" stroke="#9CA3AF" fontSize={11} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="properties" fill="#8B5CF6" radius={[0, 6, 6, 0]}>
                  {analytics.city_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Rent Price Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.rent_distribution}>
                <defs>
                  <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="url(#colorRent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-pink-50 via-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.total_wishlists}</h3>
                <p className="text-sm text-gray-700">Total Wishlists</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-pink-200">
              <p className="text-xs text-gray-600">Avg {(analytics.summary.total_wishlists / analytics.summary.total_users).toFixed(1)} per user</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.verified_users}</h3>
                <p className="text-sm text-gray-700">Verified Users</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-gray-600">{((analytics.summary.verified_users / analytics.summary.total_users) * 100).toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.active_properties}</h3>
                <p className="text-sm text-gray-700">Active Properties</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-xs text-gray-600">{((analytics.summary.active_properties / analytics.summary.total_properties) * 100).toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.summary.total_reviews}</h3>
                <p className="text-sm text-gray-700">Total Reviews</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600">Avg {(analytics.summary.total_reviews / analytics.summary.total_properties).toFixed(1)} per property</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
