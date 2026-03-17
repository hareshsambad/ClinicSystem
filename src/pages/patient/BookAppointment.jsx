import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BookAppointment = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date || !timeSlot) {
      setError("Please select both date and time slot");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/appointments", { appointmentDate: date, timeSlot });
      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </span>
          Book Appointment
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-13">Schedule a new clinic visit</p>
      </div>

      <div className="glass rounded-xl p-6 max-w-md">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
            <input type="date" className={inputCls} min={today} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Time Slot</label>
            <select className={inputCls} value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="">Select a time slot</option>
              <option value="09:00-09:15">09:00 – 09:15</option>
              <option value="09:15-09:30">09:15 – 09:30</option>
              <option value="09:30-09:45">09:30 – 09:45</option>
              <option value="09:45-10:00">09:45 – 10:00</option>
              <option value="10:00-10:15">10:00 – 10:15</option>
              <option value="10:15-10:30">10:15 – 10:30</option>
              <option value="10:30-10:45">10:30 – 10:45</option>
              <option value="10:45-11:00">10:45 – 11:00</option>
              <option value="11:00-11:15">11:00 – 11:15</option>
              <option value="11:15-11:30">11:15 – 11:30</option>
              <option value="11:30-11:45">11:30 – 11:45</option>
              <option value="11:45-12:00">11:45 – 12:00</option>
              <option value="12:00-12:15">12:00 – 12:15</option>
              <option value="12:15-12:30">12:15 – 12:30</option>
              <option value="14:00-14:15">14:00 – 14:15</option>
              <option value="14:15-14:30">14:15 – 14:30</option>
              <option value="14:30-14:45">14:30 – 14:45</option>
              <option value="14:45-15:00">14:45 – 15:00</option>
              <option value="15:00-15:15">15:00 – 15:15</option>
              <option value="15:15-15:30">15:15 – 15:30</option>
              <option value="15:30-15:45">15:30 – 15:45</option>
              <option value="15:45-16:00">15:45 – 16:00</option>
              <option value="16:00-16:15">16:00 – 16:15</option>
              <option value="16:15-16:30">16:15 – 16:30</option>
              <option value="16:30-16:45">16:30 – 16:45</option>
              <option value="16:45-17:00">16:45 – 17:00</option>
            </select>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 transition-all cursor-pointer">
            {submitting ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
