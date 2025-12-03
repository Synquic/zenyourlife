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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<RentalBooking />} />
        <Route path="/massage-appointments" element={<MassageBooking />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
