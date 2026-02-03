import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { RoleRoute } from './routes/RoleRoute';

// Public Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Protected Pages
import { Dashboard } from './pages/Dashboard';
import { Rooms } from './pages/Rooms';
import { RoomDetails } from './pages/RoomDetails';
import { AddRoom } from './pages/AddRoom';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { Reviews } from './pages/Reviews';
import { Wishlist } from './pages/Wishlist';
import { Info } from './pages/Info';

// Admin Pages
import { AdminUsers } from './admin/AdminUsers';
import { AdminRooms } from './admin/AdminRooms';
import { AdminReports } from './admin/AdminReports';

// 404
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/rooms" element={
            <PrivateRoute>
              <Rooms />
            </PrivateRoute>
          } />
          <Route path="/room/:id" element={
            <PrivateRoute>
              <RoomDetails />
            </PrivateRoute>
          } />
          <Route path="/add-room" element={
            <RoleRoute allowedRoles={['owner']}>
              <AddRoom />
            </RoleRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          <Route path="/reviews" element={
            <PrivateRoute>
              <Reviews />
            </PrivateRoute>
          } />
          <Route path="/wishlist" element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          } />
          <Route path="/info" element={
            <PrivateRoute>
              <Info />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/users" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminUsers />
            </RoleRoute>
          } />
          <Route path="/admin/rooms" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminRooms />
            </RoleRoute>
          } />
          <Route path="/admin/reports" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminReports />
            </RoleRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
