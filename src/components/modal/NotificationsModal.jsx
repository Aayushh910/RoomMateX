import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle, CheckCircle, XCircle, Clock, X, Check, Home, FileText } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

// Reporter Notification Card Component
const ReporterNotificationCard = ({ report, onMarkAsRead, onViewProperty, getStatusIcon, getStatusColor }) => (
  <div
    className={`bg-gray-50 rounded-xl overflow-hidden border transition-all hover:shadow-md ${
      report.is_new ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'
    }`}
  >
    <div className="p-4 bg-white border-b border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {report.is_new && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">NEW</span>
            )}
            <h3 className="text-base font-bold text-gray-900 line-clamp-1">{report.property_title}</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Reported on {new Date(report.created_at).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(report.status)}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div>
        <h4 className="text-xs font-bold text-gray-700 mb-1">Your Report:</h4>
        <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">{report.reason}</p>
      </div>

      {report.admin_notice && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-green-900 mb-1">Admin Response:</h4>
              <p className="text-sm text-green-800">{report.admin_notice}</p>
              <p className="text-xs text-green-600 mt-1">
                Updated {new Date(report.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {report.owner_notice && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-orange-900 mb-1">Notice Sent to Owner:</h4>
              <p className="text-sm text-orange-800">{report.owner_notice}</p>
              <p className="text-xs text-orange-600 mt-1">(This message was sent to the property owner)</p>
            </div>
          </div>
        </div>
      )}

      {!report.admin_notice && !report.owner_notice && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-800 font-medium">
              Your report is under review. We'll notify you once admin takes action.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onViewProperty(report.property_id)}
          className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors"
        >
          View Property
        </button>
        {report.is_new && (
          <button
            onClick={() => onMarkAsRead(report.id)}
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center gap-1"
            title="Mark as Read"
          >
            <Check className="w-4 h-4" />
            Read
          </button>
        )}
      </div>
    </div>
  </div>
);

// Owner Notification Card Component
const OwnerNotificationCard = ({ report, onMarkAsRead, onViewProperty, getStatusIcon, getStatusColor }) => (
  <div
    className={`bg-gray-50 rounded-xl overflow-hidden border transition-all hover:shadow-md ${
      report.is_new ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'
    }`}
  >
    <div className="p-4 bg-white border-b border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {report.is_new && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">NEW</span>
            )}
            <h3 className="text-base font-bold text-gray-900 line-clamp-1">{report.property_title}</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Reported by {report.reporter_name} on {new Date(report.created_at).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(report.status)}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div>
        <h4 className="text-xs font-bold text-gray-700 mb-1">Report Reason:</h4>
        <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">{report.reason}</p>
      </div>

      {report.owner_notice && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-orange-900 mb-1">Admin Notice:</h4>
              <p className="text-sm text-orange-800">{report.owner_notice}</p>
              <p className="text-xs text-orange-600 mt-1">
                Updated {new Date(report.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {!report.owner_notice && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-800 font-medium">
              This report is under admin review.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onViewProperty(report.property_id)}
          className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors"
        >
          View Property
        </button>
        {report.is_new && (
          <button
            onClick={() => onMarkAsRead(report.id)}
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center gap-1"
            title="Mark as Read"
          >
            <Check className="w-4 h-4" />
            Read
          </button>
        )}
      </div>
    </div>
  </div>
);

export const NotificationsModal = ({ isOpen, onClose, onUnreadCountChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [ownerReports, setOwnerReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [reportsData, ownerData] = await Promise.all([
        notificationService.getMyReports(),
        notificationService.getOwnerReports()
      ]);
      setReports(reportsData.reports);
      setOwnerReports(ownerData.reports);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (reportId) => {
    try {
      await notificationService.markAsRead(reportId);
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, is_read: true, is_new: false } : report
      ));
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (err) {
      // Silently handle mark as read errors
    }
  };

  const handleMarkOwnerAsRead = async (reportId) => {
    try {
      await notificationService.markOwnerAsRead(reportId);
      setOwnerReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, owner_is_read: true, is_new: false } : report
      ));
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (err) {
      // Silently handle mark as read errors
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (activeTab === 'reports') {
        await notificationService.markAllAsRead();
        setReports(prev => prev.map(report => ({ ...report, is_read: true, is_new: false })));
      } else {
        await notificationService.markAllOwnerAsRead();
        setOwnerReports(prev => prev.map(report => ({ ...report, owner_is_read: true, is_new: false })));
      }
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (err) {
      // Silently handle mark all as read errors
    }
  };

  const handleViewProperty = (propertyId) => {
    onClose();
    navigate(`/rooms/${propertyId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fixed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fixed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-600">Updates on reports and properties</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {((activeTab === 'reports' && reports.some(r => r.is_new)) || 
                  (activeTab === 'owner' && ownerReports.some(r => r.is_new))) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark All as Read
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Reports
                {reports.filter(r => r.is_new).length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {reports.filter(r => r.is_new).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('owner')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'owner' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Home className="w-4 h-4" />
                My Properties
                {ownerReports.filter(r => r.is_new).length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {ownerReports.filter(r => r.is_new).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading notifications...</p>
              </div>
            ) : activeTab === 'reports' ? (
              reports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Reports</h3>
                  <p className="text-gray-600 mb-6">You haven't reported any properties yet</p>
                  <button
                    onClick={() => { onClose(); navigate('/rooms'); }}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <ReporterNotificationCard
                      key={report.id}
                      report={report}
                      onMarkAsRead={handleMarkAsRead}
                      onViewProperty={handleViewProperty}
                      getStatusIcon={getStatusIcon}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )
            ) : (
              ownerReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Home className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Reports</h3>
                  <p className="text-gray-600">No reports on your properties</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownerReports.map((report) => (
                    <OwnerNotificationCard
                      key={report.id}
                      report={report}
                      onMarkAsRead={handleMarkOwnerAsRead}
                      onViewProperty={handleViewProperty}
                      getStatusIcon={getStatusIcon}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
