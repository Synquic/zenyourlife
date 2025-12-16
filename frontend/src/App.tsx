import { Routes, Route } from "react-router-dom";
import MainLanding from "./Pages/MainLanding";
import Home from "./Pages/Home";
import About from "./Pages/About";
import RHome from "./Pages/RentalPages/RHome";
import Booking from "./components/Booking";
import BookingDate from "./components/BookingDate";
import BookingForm from "./components/BookingForm";
import Approved from "./components/Approved";
import RBooking from "./components/Rental/RBooking";
import Servicepage from "./Pages/Servicepage";
import ParticularService from "./Pages/ParticularService";
import PMUPage from "./Pages/PMUPage";
import Privacypolicy from "./Pages/Privacypolicy";
import DPAPage from "./Pages/DPAPage";
import TermsAndConditions from "./Pages/TermsAndConditions";
import CookiePolicy from "./Pages/CookiePolicy";
import Contact from "./Pages/Contact";
import RPrivacy from "./Pages/RentalPages/RPrivacy";
import RContact from "./components/Rental/RContact";
import ParticularProperty from "./Pages/RentalPages/ParticularProperty";

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/service/:id" element={<ParticularService />} />
        <Route path="/Servicepage" element={<Servicepage />} />
        <Route path="/pmu" element={<PMUPage />} />
        <Route path="/rhome" element={<RHome />} />
        <Route path="/RBooking" element={<RBooking />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingdate" element={<BookingDate />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/approved" element={<Approved />} />
        <Route path="/privacy-policy" element={<Privacypolicy />} />
        <Route path="/dpa" element={<DPAPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/rprivacy" element={<RPrivacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rcontact" element={<RContact />} />
         <Route path="/particular-property/:id" element={<ParticularProperty />} />
      </Routes>
    </>
  );
};

export default App;
