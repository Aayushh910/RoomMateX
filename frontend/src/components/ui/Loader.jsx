export const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`${sizes[size]} border-4 border-dark-200 border-t-primary-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonCard = () => {
  return (
    <div className="card p-0">
      <div className="skeleton h-48 rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-20 rounded" />
          <div className="skeleton h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};
