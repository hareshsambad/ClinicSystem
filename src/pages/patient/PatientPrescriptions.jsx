import { useState, useEffect } from "react";
import api from "../../services/api";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/prescriptions/my");
        console.log("Prescriptions response:", res.data);
        setPrescriptions(Array.isArray(res.data) ? res.data : res.data.prescriptions || res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Loading prescriptions...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" /></svg>
          </span>
          My Prescriptions
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-13">{prescriptions.length} prescription(s)</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          <h3 className="text-slate-400 font-medium text-lg mb-1">No prescriptions yet</h3>
          <p className="text-slate-500 text-sm">Your prescriptions will appear here after a doctor visit.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prescriptions.map((rx, i) => (
            <div className="glass rounded-xl overflow-hidden" key={rx.id || rx._id || i}>
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Prescription #{rx.appointmentId || rx.id || i + 1}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/20">
                  {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
              <div className="p-6">
                {rx.medicines && rx.medicines.length > 0 && (
                  <div className="mb-4 overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Medicine</th>
                          <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Dosage</th>
                          <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rx.medicines.map((med, j) => (
                          <tr key={j} className="border-b border-white/5">
                            <td className="px-4 py-2.5 text-white font-medium">{typeof med === "string" ? med : med.name}</td>
                            <td className="px-4 py-2.5 text-slate-400">{typeof med === "string" ? "—" : (med.dosage || "—")}</td>
                            <td className="px-4 py-2.5 text-slate-400">{typeof med === "string" ? "—" : (med.duration || "—")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {rx.notes && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block mb-1">Notes</span>
                    <p className="text-slate-300 text-sm">{rx.notes}</p>
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

export default PatientPrescriptions;
