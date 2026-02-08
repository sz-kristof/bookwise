import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { BookingsPage } from './pages/admin/BookingsPage';
import { ServicesPage } from './pages/admin/ServicesPage';
import { AvailabilityPage } from './pages/admin/AvailabilityPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
            </Route>

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/bookings" element={<BookingsPage />} />
                <Route path="/admin/services" element={<ServicesPage />} />
                <Route path="/admin/availability" element={<AvailabilityPage />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
