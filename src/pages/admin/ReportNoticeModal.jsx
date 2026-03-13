import { XCircle } from 'lucide-react';

export const ReportNoticeModal = ({ 
  report, 
  noticeStatus, 
  setNoticeStatus, 
  noticeText, 
  setNoticeText, 
  onSend, 
  onClose, 
  actionLoading 
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Send Notice to User</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Report Details */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-bold text-gray-900 mb-2">Report Details</h5>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Property:</span> {report.property_title}</p>
              <p><span className="font-medium">Reported by:</span> {report.user_name} ({report.user_email})</p>
              <p><span className="font-medium">Reason:</span> {report.reason}</p>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={noticeStatus}
              onChange={(e) => setNoticeStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="fixed">Fixed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Notice Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notice Message (Optional)
            </label>
            <textarea
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Enter a message to send to the user about this report..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This message will be visible to the user who submitted the report.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onSend}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              disabled={actionLoading}
            >
              {actionLoading ? 'Sending...' : 'Send Notice & Update Status'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              disabled={actionLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
