import { useState, useEffect } from "react";
import api from "../../services/api";

const ReceptionistQueue = () => {
  const [queue, setQueue] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchQueue = async (d) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/queue?date=${d}`);
      console.log("Queue API response:", res.data);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.queue || data.data || []);
      setQueue(list);
    } catch (err) {
      console.error("Queue fetch error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to load queue");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(date); }, [date]);

  const updateStatus = async (queueId, newStatus) => {
    setUpdating(queueId);
    try {
      await api.patch(`/queue/${queueId}`, { status: newStatus });
      await fetchQueue(date);
    } catch (err) {
      console.error("Status update error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

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

  const getTimeSlot = (entry) => {
    return entry.timeSlot || entry.appointment?.timeSlot || "—";
  };

  const getActions = (entry) => {
    const s = entry.status?.toLowerCase();
    const id = entry.id || entry._id;
    const isLoading = updating === id;

    if (s === "waiting") {
      return (
        <div className="flex gap-2">
          <button disabled={isLoading} onClick={() => updateStatus(id, "in-progress")} className="px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-medium hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
            {isLoading ? "..." : "Start"}
          </button>
          <button disabled={isLoading} onClick={() => updateStatus(id, "skipped")} className="px-3 py-2 rounded-lg text-xs text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" /></svg>
            Skip
          </button>
        </div>
      );
    }
    if (s === "in_progress" || s === "in-progress") {
      return (
        <button disabled={isLoading} onClick={() => updateStatus(id, "done")} className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {isLoading ? "..." : "Mark Done"}
        </button>
      );
    }
    return <span className="text-slate-500 text-xs">Completed</span>;
  };

  const counts = {
    total: queue.length,
    waiting: queue.filter((e) => e.status?.toLowerCase() === "waiting").length,
    inProgress: queue.filter((e) => ["in_progress", "in-progress"].includes(e.status?.toLowerCase())).length,
    done: queue.filter((e) => e.status?.toLowerCase() === "done").length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            </span>
            Daily Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-13">Manage patient queue for the selected date</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm w-44" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={() => fetchQueue(date)} className="p-2.5 rounded-xl text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer" title="Refresh">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: counts.total, gradient: "from-teal-500 to-cyan-500", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
          { label: "Waiting", value: counts.waiting, gradient: "from-amber-500 to-orange-500", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "In Progress", value: counts.inProgress, gradient: "from-blue-500 to-sky-500", icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" },
          { label: "Done", value: counts.done, gradient: "from-emerald-500 to-green-500", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-2 shadow-lg`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
        </div>
      ) : queue.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          <h3 className="text-slate-400 font-medium text-lg mb-1">No queue entries</h3>
          <p className="text-slate-500 text-sm">No patients in the queue for {new Date(date + "T00:00:00").toLocaleDateString()}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((entry, idx) => {
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
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {getTimeSlot(entry)}
                    </span>
                    {getStatusDisplay(entry.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {getActions(entry)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReceptionistQueue;
