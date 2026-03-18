import { BarChart3, Users, Building2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export const AdminSidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'properties', label: 'Properties/Listings', icon: Building2 },
    { id: 'reports', label: 'Reports/Complaints', icon: AlertTriangle },
  ];

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="px-6 py-4 border-b border-gray-200 h-[88px] flex items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/logos/logocrop.png" 
            alt="RoomMateX Logo" 
            className="w-10 h-10 rounded-[18px]"
          />
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
  );
};
