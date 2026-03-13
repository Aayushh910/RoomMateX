import { XCircle } from 'lucide-react';

export const NotifyOwnerModal = ({ 
  report, 
  ownerMessage,
  setOwnerMessage,
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
          <h3 className="text-xl font-bold text-gray-900">Notify Property Owner</h3>
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
            <h5 className="font-bold text-gray-900 mb-2">Report Information</h5>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Property:</span> {report.property_title}</p>
              <p><span className="font-medium">Property ID:</span> {report.property_id}</p>
              <p><span className="font-medium">Reported By:</span> {report.user_name}</p>
              <p><span className="font-medium">Report Reason:</span> {report.reason}</p>
              <p><span className="font-medium">Report Date:</span> {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-orange-900 mb-1">⚠️ Important Notice</p>
            <p className="text-xs text-orange-700">
              This message will be sent to the property owner. Please be professional and clear about the issue and any required actions.
            </p>
          </div>

          {/* Owner Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message to Property Owner
            </label>
            <textarea
              value={ownerMessage}
              onChange={(e) => setOwnerMessage(e.target.value)}
              placeholder="Enter a message to notify the property owner about this report..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This message will be sent to the property owner
            </p>
          </div>

          {/* Suggested Messages */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Suggested Messages:</p>
            <div className="space-y-2">
              <button
                onClick={() => setOwnerMessage("We have received a report about your property listing. Please review your listing and ensure all information is accurate and complies with our guidelines. If you have any questions, please contact our support team.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                📋 General review request
              </button>
              <button
                onClick={() => setOwnerMessage("Your property listing has been reported for potentially misleading information. Please verify that all details, photos, and amenities listed are accurate. Failure to comply may result in listing removal.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                ⚠️ Misleading information warning
              </button>
              <button
                onClick={() => setOwnerMessage("We have received a report about your property. After review, we have temporarily deactivated your listing. Please contact us to resolve this issue and provide any necessary documentation.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                🚫 Listing deactivated notice
              </button>
              <button
                onClick={() => setOwnerMessage("Your property has been reported for violating our community guidelines. Please review our terms of service and update your listing accordingly. Repeated violations may result in account suspension.")}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                ❌ Policy violation warning
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onSend}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={actionLoading || !ownerMessage.trim()}
            >
              {actionLoading ? 'Sending...' : 'Send Notice to Owner'}
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
