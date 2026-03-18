import { useNavigate } from 'react-router-dom';

export const VerificationWarningModal = ({ 
    isOpen, 
    onClose, 
    title = "Verification Required",
    message = "To access this feature, you need to complete your personal details and verify your identity.",
    primaryAction = "Go to Profile",
    primaryPath = "/profile",
    secondaryAction = "Back",
    secondaryPath = null
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handlePrimaryAction = () => {
        navigate(primaryPath);
    };

    const handleSecondaryAction = () => {
        if (secondaryPath) {
            navigate(secondaryPath);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="space-y-3">
                        <button
                            onClick={handlePrimaryAction}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                        >
                            {primaryAction}
                        </button>
                        <button
                            onClick={handleSecondaryAction}
                            className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            {secondaryAction}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};