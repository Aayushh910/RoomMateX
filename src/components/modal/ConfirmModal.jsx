import { XCircle, AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default: // warning
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};