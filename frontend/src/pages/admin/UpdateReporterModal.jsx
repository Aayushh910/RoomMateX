import { XCircle } from 'lucide-react';

export const UpdateReporterModal = ({ 
  report, 
  updateMessage,
  setUpdateMessage,
  reportStatus,
  setReportStatus,
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
          <h3 className="text-xl font-bold text-gray-900">Update Reporter</h3>
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
              <p><span className="font-medium">Reporter:</span> {report.user_name} ({report.user_email})</p>
              <p><span className="font-medium">Reason:</span> {report.reason}</p>
              <p><span className="font-medium">Current Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                  report.status === 'fixed' ? 'bg-green-50 text-green-600' :
                  report.status === 'rejected' ? 'bg-red-50 text-red-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {report.status}
                </span>
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Update Report Status
            </label>
            <select
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending - Under Review</option>
              <option value="fixed">Fixed - Issue Resolved</option>
              <option value="rejected">Rejected - No Action Needed</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This status will be visible to the reporter
            </p>
          </div>

          {/* Update Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message to Reporter
            </label>
            <textarea
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Enter a message to inform the reporter about the status of their report..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This message will be sent to {report.user_name} at {report.user_email}
            </p>
          </div>

          {/* Suggested Messages */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Suggested Messages:</p>
            <div className="space-y-2">
              <button
                onClick={() => setUpdateMessage("Thank you for reporting this property. We have reviewed your report and taken appropriate action. The property has been removed from our platform.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                ✓ Report accepted - Property removed
              </button>
              <button
                onClick={() => setUpdateMessage("Thank you for your report. After careful review, we found that the property meets our guidelines and standards. If you have additional concerns, please provide more details.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                ✗ Report rejected - Property is valid
              </button>
              <button
                onClick={() => setUpdateMessage("We have received your report and are currently investigating the issue. We will update you once our review is complete. Thank you for your patience.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                ⏳ Under investigation
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onSend}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={actionLoading || !updateMessage.trim()}
            >
              {actionLoading ? 'Sending...' : 'Send Update to Reporter'}
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
