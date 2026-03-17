import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DoctorQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/queue");
      console.log("Doctor queue response:", res.data);
      const data = res.data;
      setQueue(Array.isArray(data) ? data : (data.queue || data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const statusStyles = {
    waiting: { label: "Waiting", cls: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
    in_progress: { label: "In Progress", cls: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
    "in-progress": { label: "In Progress", cls: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
    done: { label: "Done", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
    skipped: { label: "Skipped", cls: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  };

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase();
    const cfg = statusStyles[s] || { label: status, cls: "bg-slate-500/15 text-slate-400 border-slate-500/20" };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>;
  };

  const getPatientName = (entry) => {
    return entry.patientName || entry.patient?.name || entry.appointment?.patient?.name || `Patient #${entry.patientId || entry.appointment?.patientId || "—"}`;
  };

  const getAppointmentId = (entry) => {
    return entry.appointmentId || entry.appointment_id || entry.appointment?.id || entry.id;
  };

  const getTimeSlot = (entry) => {
    return entry.timeSlot || entry.appointment?.timeSlot || "";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Loading queue...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </span>
            My Queue — Today
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">{queue.length} patient(s) in queue</p>
        </div>
        <button onClick={fetchQueue} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          <h3 className="text-slate-400 font-medium text-lg mb-1">No patients today</h3>
          <p className="text-slate-500 text-sm">Your queue is empty for today.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((entry, idx) => {
            const aptId = getAppointmentId(entry);
            const s = entry.status?.toLowerCase();
            const isActive = s === "in_progress" || s === "in-progress";
            const isDone = s === "done";
            const isSkipped = s === "skipped";

            return (
              <div
                key={entry.id || entry._id || idx}
                className={`glass rounded-xl p-5 flex items-center gap-4 flex-wrap transition-all duration-300 ${
                  isActive ? "border-l-4 border-l-blue-400 bg-blue-500/5" :
                  isDone ? "opacity-60 border-l-4 border-l-emerald-400" :
                  isSkipped ? "opacity-50 border-l-4 border-l-slate-500" : ""
                }`}
              >
                {/* Token */}
                <div className="min-w-[56px] text-center">
                  <span className="text-2xl font-bold text-gradient">#{entry.tokenNumber ?? idx + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    {getPatientName(entry)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    {getTimeSlot(entry) && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {getTimeSlot(entry)}
                      </span>
                    )}
                    {getStatusDisplay(entry.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/doctor/prescriptions/${aptId}`)}
                    disabled={!aptId}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-medium hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" /></svg>
                    Medicines
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/reports/${aptId}`)}
                    disabled={!aptId}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-medium hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
