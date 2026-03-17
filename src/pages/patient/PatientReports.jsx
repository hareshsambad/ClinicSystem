import { useState, useEffect } from "react";
import api from "../../services/api";

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/reports/my");
        console.log("Reports response:", res.data);
        setReports(Array.isArray(res.data) ? res.data : res.data.reports || res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Loading reports...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </span>
          My Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-13">{reports.length} report(s)</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          <h3 className="text-slate-400 font-medium text-lg mb-1">No reports yet</h3>
          <p className="text-slate-500 text-sm">Your medical reports will appear here after a doctor visit.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((rpt, i) => (
            <div className="glass rounded-xl overflow-hidden" key={rpt.id || rpt._id || i}>
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Report #{rpt.appointmentId || rpt.id || i + 1}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/20">
                  {rpt.createdAt ? new Date(rpt.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {rpt.diagnosis && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Diagnosis</span>
                    <span className="text-slate-200 font-medium">{rpt.diagnosis}</span>
                  </div>
                )}
                {rpt.testRecommended && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Test Recommended</span>
                    <span className="text-slate-200 font-medium">{rpt.testRecommended}</span>
                  </div>
                )}
                {rpt.remarks && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Remarks</span>
                    <span className="text-slate-200 font-medium">{rpt.remarks}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientReports;
