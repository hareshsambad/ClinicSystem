import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const emptyMedicine = { name: "", dosage: "", duration: "" };

const AddPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { ...emptyMedicine }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) {
      setError("Please add at least one medicine with a name");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/prescriptions/${appointmentId}`, {
        medicines: validMedicines.map((m) => ({
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          duration: m.duration.trim(),
        })),
        notes: notes.trim(),
      });
      setSuccess("Prescription added successfully!");
      setTimeout(() => navigate("/doctor/queue"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" /></svg>
            </span>
            Add Prescription
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">Appointment #{appointmentId}</p>
        </div>
        <button onClick={() => navigate("/doctor/queue")} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back
        </button>
      </div>

      <div className="glass rounded-xl p-6 max-w-3xl">
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

        <form onSubmit={handleSubmit}>
          {/* Medicines */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" /></svg>
                Medicines
              </label>
              <button type="button" onClick={addMedicine} className="px-3 py-1.5 rounded-lg text-xs text-teal-300 border border-teal-500/30 hover:bg-teal-500/10 transition-all flex items-center gap-1.5 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Medicine
              </button>
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 mb-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Medicine Name</label>
                  <input className={inputCls} placeholder="e.g. Paracetamol" value={med.name} onChange={(e) => updateMedicine(index, "name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Dosage</label>
                  <input className={inputCls} placeholder="e.g. 500mg" value={med.dosage} onChange={(e) => updateMedicine(index, "dosage", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Duration</label>
                  <input className={inputCls} placeholder="e.g. 5 days" value={med.duration} onChange={(e) => updateMedicine(index, "duration", e.target.value)} />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={() => removeMedicine(index)} disabled={medicines.length === 1} className="p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-all cursor-pointer" title="Remove">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea className={`${inputCls} min-h-[100px] resize-y`} placeholder="e.g. After food, avoid cold drinks..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 transition-all cursor-pointer">
            {submitting ? "Saving..." : "Save Prescription"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
