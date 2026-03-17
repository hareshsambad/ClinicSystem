import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

const AppointmentDetail = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        console.log("Appointment detail:", res.data);
        setAppointment(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const statusBadge = (status) => {
    const map = {
      queued: "bg-blue-500/15 text-blue-300 border-blue-500/20",
      waiting: "bg-amber-500/15 text-amber-300 border-amber-500/20",
      in_progress: "bg-teal-500/15 text-teal-300 border-teal-500/20",
      "in-progress": "bg-teal-500/15 text-teal-300 border-teal-500/20",
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
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
      {error}
    </div>
  );

  const apt = appointment;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
            </span>
            Appointment Details
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">Appointment #{apt?.id || apt?._id || id}</p>
        </div>
        <Link to="/appointments" className="px-4 py-2.5 rounded-xl text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back
        </Link>
      </div>

      {/* Appointment Info */}
      <div className="glass rounded-xl overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Appointment Info</h3>
          {statusBadge(apt?.status)}
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Date</span>
            <span className="text-slate-200 font-medium">{apt?.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Time Slot</span>
            <span className="text-slate-200 font-medium">{apt?.timeSlot || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Queue Token</span>
            <span className="text-slate-200 font-medium">{apt?.queueEntry?.tokenNumber ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Status</span>
            <span className="text-slate-200 font-medium capitalize">{apt?.status || "—"}</span>
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="glass rounded-xl overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" /></svg>
            Prescription
          </h3>
        </div>
        {apt?.prescription ? (
          <div className="p-6">
            {apt.prescription.medicines && apt.prescription.medicines.length > 0 && (
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block mb-3">Medicines</span>
                <div className="overflow-x-auto rounded-lg border border-white/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Medicine</th>
                        <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Dosage</th>
                        <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apt.prescription.medicines.map((med, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-4 py-2.5 text-white font-medium">{typeof med === "string" ? med : med.name}</td>
                          <td className="px-4 py-2.5 text-slate-400">{typeof med === "string" ? "—" : (med.dosage || "—")}</td>
                          <td className="px-4 py-2.5 text-slate-400">{typeof med === "string" ? "—" : (med.duration || "—")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {apt.prescription.notes && (
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block mb-1">Notes</span>
                <p className="text-slate-300 text-sm">{apt.prescription.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p className="text-slate-500 text-sm">No prescription added yet</p>
          </div>
        )}
      </div>

      {/* Report */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Report
          </h3>
        </div>
        {apt?.report ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {apt.report.diagnosis && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Diagnosis</span>
                <span className="text-slate-200 font-medium">{apt.report.diagnosis}</span>
              </div>
            )}
            {apt.report.testRecommended && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Test Recommended</span>
                <span className="text-slate-200 font-medium">{apt.report.testRecommended}</span>
              </div>
            )}
            {apt.report.remarks && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Remarks</span>
                <span className="text-slate-200 font-medium">{apt.report.remarks}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p className="text-slate-500 text-sm">No report added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
