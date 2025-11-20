import { useNavigate } from "react-router-dom";
import TickImage from "../assets/tick.png";
import MasterPrimaryButton from "../assets/Master Primary Button (4).png";
import NavbarHome from "./NavbarHome";

const Approved = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarHome />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
          {/* Tick Image */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-50 rounded-full p-6">
              <img
                src={TickImage}
                alt="Success"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Appointment Confirmed!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your appointment has been successfully booked. We've sent a
            confirmation email with all the details.
          </p>

          {/* Transparent Glass Effect Button */}
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 backdrop-blur-md border-2 border-[#d4af37] hover:bg-white/30 text-gray-900 px-8 py-3.5 rounded-full font-medium transition-all shadow-lg flex items-center gap-3 mx-auto"
          >
            <span className="font-semibold">Back to Home</span>
            <img src={MasterPrimaryButton} alt="" className="h-5 w-auto" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Approved;
