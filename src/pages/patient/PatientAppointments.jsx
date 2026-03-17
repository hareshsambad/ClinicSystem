import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/appointments/my");
        setAppointments(Array.isArray(res.data) ? res.data : res.data.appointments || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusBadge = (status) => {
    const map = {
      queued: "bg-blue-500/15 text-blue-300 border-blue-500/20",
      waiting: "bg-amber-500/15 text-amber-300 border-amber-500/20",
      in_progress: "bg-teal-500/15 text-teal-300 border-teal-500/20",
      done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
      skipped: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status?.toLowerCase()] || "bg-slate-500/15 text-slate-400 border-slate-500/20"}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Loading appointments...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
            </span>
            My Appointments
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">{appointments.length} appointment(s)</p>
        </div>
        <Link to="/appointments/book" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Book Appointment
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          <h3 className="text-slate-400 font-medium text-lg mb-1">No appointments yet</h3>
          <p className="text-slate-500 text-sm">Book your first appointment to get started.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Time Slot</th>
                  <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Token</th>
                  <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id || apt._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3.5 text-slate-400">{apt.timeSlot || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-400">{apt.queueEntry?.tokenNumber ?? "—"}</td>
                    <td className="px-5 py-3.5">{statusBadge(apt.status)}</td>
                    <td className="px-5 py-3.5">
                      <Link to={`/appointments/${apt.id || apt._id}`} className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
