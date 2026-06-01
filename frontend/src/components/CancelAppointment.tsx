import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";
import { API_BASE_URL } from "../config/api";

type Appointment = {
  _id: string;
  serviceTitle: string;
  appointmentDate: string;
  appointmentTime: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  service?: { duration?: number };
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    timeZone: "Europe/Brussels",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

const CancelAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/appointments/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.message || "Appointment not found.");
        } else {
          setAppointment(json.data);
          if (json.data.status === "cancelled") setCancelled(true);
        }
      } catch {
        setError("Could not load your appointment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const confirmCancel = async () => {
    if (!id || !token) {
      setError("Invalid cancellation link.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Could not cancel the appointment.");
      } else {
        setAppointment(json.data);
        setCancelled(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavbarHome />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
          {loading && (
            <p className="text-center text-gray-600">Loading your appointment…</p>
          )}

          {!loading && error && !appointment && (
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                We couldn't find this booking
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="bg-[#d4af37] hover:bg-[#c9a032] text-white px-6 py-3 rounded-full font-medium"
              >
                Back to home
              </button>
            </div>
          )}

          {!loading && appointment && cancelled && (
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                Appointment cancelled
              </h1>
              <p className="text-gray-600 mb-6">
                Your booking for <strong>{appointment.serviceTitle}</strong> on{" "}
                <strong>{formatDate(appointment.appointmentDate)}</strong> at{" "}
                <strong>{appointment.appointmentTime}</strong> has been cancelled.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-[#d4af37] hover:bg-[#c9a032] text-white px-6 py-3 rounded-full font-medium"
              >
                Back to home
              </button>
            </div>
          )}

          {!loading && appointment && !cancelled && (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                Cancel your appointment?
              </h1>
              <p className="text-gray-600 mb-6 text-center">
                Please review your booking details before confirming.
              </p>

              <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Service: </span>
                  <span className="text-gray-900">{appointment.serviceTitle}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date: </span>
                  <span className="text-gray-900">
                    {formatDate(appointment.appointmentDate)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Time: </span>
                  <span className="text-gray-900">{appointment.appointmentTime}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Name: </span>
                  <span className="text-gray-900">
                    {appointment.firstName} {appointment.lastName}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-center mb-4">{error}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/")}
                  disabled={submitting}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-medium disabled:opacity-50"
                >
                  Keep appointment
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={submitting}
                  className="bg-[#B71C1C] hover:bg-[#8b1414] text-white px-6 py-3 rounded-full font-medium disabled:opacity-50"
                >
                  {submitting ? "Cancelling…" : "Yes, cancel it"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CancelAppointment;
