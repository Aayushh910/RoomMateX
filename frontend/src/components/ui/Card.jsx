export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`card ${hover ? 'hover:shadow-lg cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
