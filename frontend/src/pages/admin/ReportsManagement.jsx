import { FileText, Search, Filter, Bell, UserCheck } from 'lucide-react';

export const ReportsManagement = ({ 
  reports, 
  reportsTotal,
  reportFilters,
  setReportFilters,
  onApplyFilters,
  onClearFilters,
  onUpdateStatus, 
  onUpdateReporter,
  onNotifyOwner,
  actionLoading 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Property Reports & Complaints</h3>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <Search className="absolute left-3 top-1/2 transform translate-y-0.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search property or user..."
              value={reportFilters.search}
              onChange={(e) => setReportFilters({ ...reportFilters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={reportFilters.status}
              onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="fixed">Fixed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={reportFilters.date_from}
              onChange={(e) => setReportFilters({ ...reportFilters, date_from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={reportFilters.date_to}
              min={reportFilters.date_from || undefined}
              onChange={(e) => setReportFilters({ ...reportFilters, date_to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={onApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{reports.length}</span> of <span className="font-semibold text-gray-900">{reportsTotal}</span> reports
          </div>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{report.property_title}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {report.property_id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{report.user_name}</div>
                    <div className="text-xs text-gray-500">{report.user_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="line-clamp-2" title={report.reason}>{report.reason}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={report.status}
                      onChange={(e) => onUpdateStatus(report.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer ${
                        report.status === 'fixed' ? 'bg-green-50 text-green-600' :
                        report.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}
                      disabled={actionLoading}
                    >
                      <option value="pending">Pending</option>
                      <option value="fixed">Fixed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateReporter(report)}
                        className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
                        title="Send update to reporter"
                        disabled={actionLoading}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Update Reporter
                      </button>
                      <button
                        onClick={() => onNotifyOwner(report)}
                        className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
                        title="Send notice to property owner"
                        disabled={actionLoading}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Notify Owner
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
