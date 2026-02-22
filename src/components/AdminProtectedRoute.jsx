import { Navigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

export const AdminProtectedRoute = ({ children }) => {
  const isAdmin = adminService.isAdmin();
  
  if (!isAdmin) {
    // Redirect to login if not admin
    return <Navigate to="/login" replace />;
  }

  return children;
};
