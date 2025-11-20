import { Routes, Route } from "react-router-dom";
import MainLanding from "./Pages/MainLanding";
import Home from "./Pages/Home";
import About from "./Pages/About";
import RHome from "./Pages/RentalPages/RHome";
import Booking from "./components/Booking";
import BookingDate from "./components/BookingDate";
import BookingForm from "./components/BookingForm";
import Approved from "./components/Approved";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rhome" element={<RHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingdate" element={<BookingDate />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/approved" element={<Approved />} />
      </Routes>
    </>
  );
};

export default App;
