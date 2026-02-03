import { Button } from './Button';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-dark-50 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-dark-400" />
        </div>
      )}
      <h3 className="text-xl font-display font-semibold text-dark-900 mb-2">
        {title}
      </h3>
      <p className="text-dark-600 max-w-md mb-6">
        {description}
      </p>
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
};
