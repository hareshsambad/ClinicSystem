import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddReport = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState("");
  const [testRecommended, setTestRecommended] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!diagnosis.trim()) {
      setError("Diagnosis is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reports/${appointmentId}`, {
        diagnosis: diagnosis.trim(),
        testRecommended: testRecommended.trim(),
        remarks: remarks.trim(),
      });
      setSuccess("Report added successfully!");
      setTimeout(() => navigate("/doctor/queue"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add report");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </span>
            Add Report
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">Appointment #{appointmentId}</p>
        </div>
        <button onClick={() => navigate("/doctor/queue")} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back
        </button>
      </div>

      <div className="glass rounded-xl p-6 max-w-xl">
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Diagnosis *</label>
            <textarea className={`${inputCls} min-h-[100px] resize-y`} placeholder="e.g. Viral Fever" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Test Recommended</label>
            <input className={inputCls} placeholder="e.g. Blood Test" value={testRecommended} onChange={(e) => setTestRecommended(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Remarks</label>
            <textarea className={`${inputCls} min-h-[100px] resize-y`} placeholder="e.g. Rest for 3 days" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 transition-all cursor-pointer">
            {submitting ? "Saving..." : "Save Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReport;
