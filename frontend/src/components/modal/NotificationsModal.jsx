import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle, CheckCircle, XCircle, Clock, X, Check, Home, FileText } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const StatusBadge = ({ status }) => {
  const config = {
    fixed:    { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Fixed',    cls: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { icon: <XCircle    className="w-3.5 h-3.5" />, label: 'Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
    pending:  { icon: <Clock      className="w-3.5 h-3.5" />, label: 'Pending',  cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  };
  const s = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

const NotificationCard = ({ report, onMarkAsRead, onViewProperty, isOwner }) => (
  <div className={`rounded-xl border bg-white transition-all hover:shadow-sm ${report.is_new ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-200'}`}>
    {/* Card Header */}
    <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {report.is_new && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full uppercase tracking-wide">New</span>}
          <StatusBadge status={report.status} />
        </div>
        <p className="font-semibold text-gray-900 text-sm truncate">{report.property_title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {isOwner ? `Reported by ${report.reporter_name} · ` : ''}
          {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      {report.is_new && (
        <button
          onClick={() => onMarkAsRead(report.id)}
          title="Mark as read"
          className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-400 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </div>

    {/* Reason */}
    <div className="px-4 pb-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{isOwner ? 'Report Reason' : 'Your Report'}</p>
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 line-clamp-2">{report.reason}</p>
    </div>

    {/* Admin / Owner Notice */}
    {(report.admin_notice || report.owner_notice) ? (
      <div className="mx-4 mb-3 rounded-lg border border-primary-100 bg-primary-50 px-3 py-2.5">
        <p className="text-xs font-semibold text-primary-700 mb-0.5">
          {isOwner ? '📋 Admin Notice' : '✅ Admin Response'}
        </p>
        <p className="text-sm text-primary-800">{isOwner ? report.owner_notice : (report.admin_notice || report.owner_notice)}</p>
        <p className="text-[10px] text-primary-500 mt-1">{new Date(report.updated_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    ) : (
      <div className="mx-4 mb-3 rounded-lg border border-yellow-100 bg-yellow-50 px-3 py-2 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
        <p className="text-xs text-yellow-700">Under review — we'll notify you once admin responds.</p>
      </div>
    )}

    {/* Footer */}
    <div className="px-4 pb-4">
      <button
        onClick={() => onViewProperty(report.property_id)}
        className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        View Property
      </button>
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
    if (isOpen) fetchNotifications();
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
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (reportId) => {
    try {
      await notificationService.markAsRead(reportId);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, is_read: true, is_new: false } : r));
      onUnreadCountChange?.();
    } catch {}
  };

  const handleMarkOwnerAsRead = async (reportId) => {
    try {
      await notificationService.markOwnerAsRead(reportId);
      setOwnerReports(prev => prev.map(r => r.id === reportId ? { ...r, owner_is_read: true, is_new: false } : r));
      onUnreadCountChange?.();
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (activeTab === 'reports') {
        await notificationService.markAllAsRead();
        setReports(prev => prev.map(r => ({ ...r, is_read: true, is_new: false })));
      } else {
        await notificationService.markAllOwnerAsRead();
        setOwnerReports(prev => prev.map(r => ({ ...r, owner_is_read: true, is_new: false })));
      }
      onUnreadCountChange?.();
    } catch {}
  };

  const handleViewProperty = (propertyId) => {
    onClose();
    navigate(`/rooms/${propertyId}`);
  };

  const currentList = activeTab === 'reports' ? reports : ownerReports;
  const unreadCount = currentList.filter(r => r.is_new).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col pointer-events-auto" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-400">Report updates & property alerts</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 py-3 border-b border-gray-100 bg-gray-50">
            {[
              { key: 'reports', label: 'My Reports', icon: FileText, count: reports.filter(r => r.is_new).length },
              { key: 'owner',   label: 'My Properties', icon: Home,     count: ownerReports.filter(r => r.is_new).length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key ? 'bg-white text-primary-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <div className="px-5 py-2 bg-primary-50 border-b border-primary-100 flex items-center justify-between">
              <p className="text-xs text-primary-700 font-medium">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
              <button onClick={handleMarkAllAsRead} className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : currentList.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {activeTab === 'reports' ? <FileText className="w-7 h-7 text-gray-400" /> : <Home className="w-7 h-7 text-gray-400" />}
                </div>
                <p className="font-semibold text-gray-700 mb-1">No notifications yet</p>
                <p className="text-sm text-gray-400">
                  {activeTab === 'reports' ? "You haven't reported any properties." : "No reports on your properties."}
                </p>
                {activeTab === 'reports' && (
                  <button onClick={() => { onClose(); navigate('/rooms'); }} className="mt-4 px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors">
                    Browse Properties
                  </button>
                )}
              </div>
            ) : (
              currentList.map(report => (
                <NotificationCard
                  key={report.id}
                  report={report}
                  onMarkAsRead={activeTab === 'reports' ? handleMarkAsRead : handleMarkOwnerAsRead}
                  onViewProperty={handleViewProperty}
                  isOwner={activeTab === 'owner'}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
