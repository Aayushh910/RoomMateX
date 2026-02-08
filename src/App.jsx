import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './routes/ProtectedRoute';
import { Navbar } from './components/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { RoommateProfilePage } from './pages/RoommateProfilePage';
import { AddRoomPage } from './pages/AddRoomPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';

// Admin
import { AdminDashboard } from './admin/AdminDashboard';
import { ManageUsers } from './admin/ManageUsers';
import { ManageRooms } from './admin/ManageRooms';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Protected Routes with Navbar */}
          <Route element={<ProtectedRoute><NavbarLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/room/:id" element={<RoomDetailsPage />} />
            <Route path="/roommate/:id" element={<RoommateProfilePage />} />
            <Route path="/add-room" element={<AddRoomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes with Navbar */}
          <Route element={<AdminRoute><NavbarLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/rooms" element={<ManageRooms />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:id" element={<RoomDetailsPage />} />
        <Route path="/roommate/:id" element={<RoommateProfilePage />} />
        <Route path="/add-room" element={<AddRoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/rooms" element={<ManageRooms />} />
      </Routes>
    </>
  );
}

export default App;
