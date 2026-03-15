import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/modal/ConfirmModal';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { UsersManagement } from './UsersManagement';
import { PropertiesManagement } from './PropertiesManagement';
import { ReportsManagement } from './ReportsManagement';
import { UserDetailsModal } from './UserDetailsModal';
import { PropertyDetailsModal } from './PropertyDetailsModal';
import { UpdateReporterModal } from './UpdateReporterModal';
import { NotifyOwnerModal } from './NotifyOwnerModal';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [userFilters, setUserFilters] = useState({ search: '', role: '', is_verified: '', city: '' });
  const [propertyFilters, setPropertyFilters] = useState({ search: '', city: '', property_type: '', is_active: '', min_rent: '', max_rent: '' });
  const [reportFilters, setReportFilters] = useState({ search: '', status: '', date_from: '', date_to: '' });
  
  // Pagination and counts
  const [usersTotal, setUsersTotal] = useState(0);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  const [reportsTotal, setReportsTotal] = useState(0);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Report modals
  const [showUpdateReporterModal, setShowUpdateReporterModal] = useState(false);
  const [showNotifyOwnerModal, setShowNotifyOwnerModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [ownerMessage, setOwnerMessage] = useState('');
  const [reportStatus, setReportStatus] = useState('pending');

  // Confirmation modals
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showTogglePropertyConfirm, setShowTogglePropertyConfirm] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [propertyToToggle, setPropertyToToggle] = useState(null);

  const adminData = adminService.getAdminData();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users Management' },
    { id: 'properties', label: 'Properties/Listings' },
    { id: 'reports', label: 'Reports/Complaints' },
  ];

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
        // Build filters object, excluding empty values
        const filters = {};
        if (reportFilters.search) filters.search = reportFilters.search;
        if (reportFilters.status) filters.status = reportFilters.status;
        if (reportFilters.date_from) filters.date_from = reportFilters.date_from;
        if (reportFilters.date_to) filters.date_to = reportFilters.date_to;
        
        const reportsData = await adminService.getReports(1, 20, filters);
        setReports(reportsData.reports);
        setReportsTotal(reportsData.total);
      }
    } catch (error) {
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
    setUserToBlock(userId);
    setShowBlockConfirm(true);
  };

  const confirmBlockUser = async () => {
    if (!userToBlock) return;
    
    setActionLoading(true);
    try {
      await adminService.blockUser(userToBlock);
      setError(null);
      fetchData();
      showSuccess('User status updated successfully');
    } catch (error) {
      setError('Failed to block/unblock user');
    } finally {
      setActionLoading(false);
      setShowBlockConfirm(false);
      setUserToBlock(null);
    }
  };

  const handleViewUser = async (userId) => {
    setActionLoading(true);
    try {
      const userData = await adminService.getUserDetails(userId);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
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
    setPropertyToToggle(propertyId);
    setShowTogglePropertyConfirm(true);
  };

  const confirmToggleProperty = async () => {
    if (!propertyToToggle) return;
    
    setActionLoading(true);
    try {
      await adminService.togglePropertyActive(propertyToToggle);
      setError(null);
      fetchData();
      showSuccess('Property status updated successfully');
    } catch (error) {
      setError('Failed to activate/deactivate property');
    } finally {
      setActionLoading(false);
      setShowTogglePropertyConfirm(false);
      setPropertyToToggle(null);
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    setActionLoading(true);
    try {
      await adminService.updateReportStatus(reportId, newStatus);
      setError(null);
      fetchData();
    } catch (error) {
      setError('Failed to update report status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenUpdateReporterModal = (report) => {
    setSelectedReport(report);
    setReportStatus(report.status);
    setUpdateMessage(report.admin_notice || '');
    setShowUpdateReporterModal(true);
  };

  const handleSendUpdateToReporter = async () => {
    if (!selectedReport) return;
    
    setActionLoading(true);
    try {
      await adminService.updateReportStatus(selectedReport.id, reportStatus, updateMessage);
      setError(null);
      setShowUpdateReporterModal(false);
      setSelectedReport(null);
      setUpdateMessage('');
      fetchData();
      showSuccess('Update sent to reporter successfully');
    } catch (error) {
      setError('Failed to send update to reporter');
    } finally {
      setActionLoading(false);
    }
  };

  const closeUpdateReporterModal = () => {
    setShowUpdateReporterModal(false);
    setSelectedReport(null);
    setUpdateMessage('');
  };

  const handleOpenNotifyOwnerModal = (report) => {
    setSelectedReport(report);
    setOwnerMessage('');
    setShowNotifyOwnerModal(true);
  };

  const handleSendNoticeToOwner = async () => {
    if (!selectedReport) return;
    
    setActionLoading(true);
    try {
      // Send notice to property owner
      await adminService.notifyPropertyOwner(selectedReport.property_id, ownerMessage);
      setError(null);
      setShowNotifyOwnerModal(false);
      setSelectedReport(null);
      setOwnerMessage('');
      showSuccess('Notice sent to property owner successfully');
    } catch (error) {
      setError('Failed to send notice to property owner');
    } finally {
      setActionLoading(false);
    }
  };

  const closeNotifyOwnerModal = () => {
    setShowNotifyOwnerModal(false);
    setSelectedReport(null);
    setOwnerMessage('');
  };

  const handleLogout = () => {
    adminService.logout();
    navigate('/login');
  };

  const handleClearUserFilters = () => {
    setUserFilters({ search: '', role: '', is_verified: '', city: '' });
    setTimeout(fetchData, 100);
  };

  const handleClearPropertyFilters = () => {
    setPropertyFilters({ search: '', city: '', property_type: '', is_active: '', min_rent: '', max_rent: '' });
    setTimeout(fetchData, 100);
  };

  const handleClearReportFilters = () => {
    setReportFilters({ search: '', status: '', date_from: '', date_to: '' });
    setTimeout(fetchData, 100);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 h-[88px] flex items-center flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-gray-500">Manage your platform</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Admin Profile Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-2.5 flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-500">Welcome back</p>
                  <p className="text-sm font-bold text-gray-900">Admin</p>
                </div>
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
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {activeSection === 'dashboard' && <AdminDashboard analytics={analytics} />}
              
              {activeSection === 'users' && (
                <UsersManagement
                  users={users}
                  usersTotal={usersTotal}
                  userFilters={userFilters}
                  setUserFilters={setUserFilters}
                  onApplyFilters={fetchData}
                  onClearFilters={handleClearUserFilters}
                  onViewUser={handleViewUser}
                  onBlockUser={handleBlockUser}
                  actionLoading={actionLoading}
                />
              )}
              
              {activeSection === 'properties' && (
                <PropertiesManagement
                  properties={properties}
                  propertiesTotal={propertiesTotal}
                  propertyFilters={propertyFilters}
                  setPropertyFilters={setPropertyFilters}
                  onApplyFilters={fetchData}
                  onClearFilters={handleClearPropertyFilters}
                  onViewProperty={handleViewProperty}
                  onToggleProperty={handleToggleProperty}
                  actionLoading={actionLoading}
                />
              )}
              
              {activeSection === 'reports' && (
                <ReportsManagement
                  reports={reports}
                  reportsTotal={reportsTotal}
                  reportFilters={reportFilters}
                  setReportFilters={setReportFilters}
                  onApplyFilters={fetchData}
                  onClearFilters={handleClearReportFilters}
                  onUpdateStatus={handleUpdateReportStatus}
                  onUpdateReporter={handleOpenUpdateReporterModal}
                  onNotifyOwner={handleOpenNotifyOwnerModal}
                  actionLoading={actionLoading}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeUserModal}
          onBlockUser={handleBlockUser}
          actionLoading={actionLoading}
        />
      )}

      {showPropertyModal && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={closePropertyModal}
          onToggleProperty={handleToggleProperty}
          actionLoading={actionLoading}
        />
      )}

      {showNotifyOwnerModal && (
        <NotifyOwnerModal
          report={selectedReport}
          ownerMessage={ownerMessage}
          setOwnerMessage={setOwnerMessage}
          onSend={handleSendNoticeToOwner}
          onClose={closeNotifyOwnerModal}
          actionLoading={actionLoading}
        />
      )}

      {showUpdateReporterModal && (
        <UpdateReporterModal
          report={selectedReport}
          updateMessage={updateMessage}
          setUpdateMessage={setUpdateMessage}
          reportStatus={reportStatus}
          setReportStatus={setReportStatus}
          onSend={handleSendUpdateToReporter}
          onClose={closeUpdateReporterModal}
          actionLoading={actionLoading}
        />
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={confirmBlockUser}
        title="Block/Unblock User"
        message="Are you sure you want to block/unblock this user?"
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmModal
        isOpen={showTogglePropertyConfirm}
        onClose={() => setShowTogglePropertyConfirm(false)}
        onConfirm={confirmToggleProperty}
        title="Toggle Property Status"
        message="Are you sure you want to activate/deactivate this property?"
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
