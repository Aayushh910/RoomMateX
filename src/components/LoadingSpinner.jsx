export const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8', 
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
            {text && <p className="text-gray-500 mt-2 text-sm">{text}</p>}
        </div>
    );
};