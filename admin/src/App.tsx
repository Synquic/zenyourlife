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
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><RentalBooking /></ProtectedRoute>} />
        <Route path="/massage-appointments" element={<ProtectedRoute><MassageBooking /></ProtectedRoute>} />
        <Route path="/booking-management" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
        <Route path="/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><HealthCheck /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
