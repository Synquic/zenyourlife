import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RentalBooking from './pages/RentalBooking'
import MassageBooking from './pages/MassageBooking'
import Inquiries from './pages/Inquiries'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import Properties from './pages/Properties'
import Users from './pages/Users'
import BookingManagement from './pages/BookingManagement'
import HealthCheck from './pages/HealthCheck'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><RentalBooking /></ProtectedRoute>} />
        <Route path="/admin/massage-appointments" element={<ProtectedRoute><MassageBooking /></ProtectedRoute>} />
        <Route path="/admin/booking-management" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute><HealthCheck /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
