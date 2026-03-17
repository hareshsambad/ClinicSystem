import { useOutletContext, Link } from "react-router-dom";

const roleCards = {
  admin: [
    { title: "Clinic Info", desc: "View clinic details & stats", to: "/admin/clinic", gradient: "from-teal-500 to-cyan-500", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { title: "Manage Users", desc: "Create & manage staff and patients", to: "/admin/users", gradient: "from-violet-500 to-purple-500", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  ],
  patient: [
    { title: "Book Appointment", desc: "Schedule a new visit", to: "/appointments/book", gradient: "from-teal-500 to-cyan-500", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
    { title: "My Appointments", desc: "View your upcoming & past visits", to: "/appointments", gradient: "from-violet-500 to-purple-500", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" },
    { title: "Prescriptions", desc: "View your prescriptions", to: "/prescriptions", gradient: "from-emerald-500 to-green-500", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.609a1.5 1.5 0 01-1.454 1.891H4.252a1.5 1.5 0 01-1.454-1.891L5 14.5" },
    { title: "Reports", desc: "View your medical reports", to: "/reports", gradient: "from-blue-500 to-sky-500", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  ],
  receptionist: [
    { title: "Daily Queue", desc: "Manage today's patient queue", to: "/queue", gradient: "from-teal-500 to-cyan-500", icon: "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  ],
  doctor: [
    { title: "My Queue", desc: "View today's patients", to: "/doctor/queue", gradient: "from-teal-500 to-cyan-500", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  ],
};

const Dashboard = ({ user }) => {
  const role = user?.role?.toLowerCase() || "patient";
  const cards = roleCards[role] || roleCards.patient;

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome, {user?.name || "User"} 👋</h1>
        <p className="text-slate-400 flex items-center gap-2">
          {user?.clinicName || "Clinic"}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/20">
            {role}
          </span>
        </p>
      </div>

      {/* Action cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="group">
            <div className="glass rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/10 hover:border-white/20">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-base mb-1">{card.title}</h3>
              <p className="text-slate-400 text-sm">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info card */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Quick Info</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Clinic</span>
            <span className="text-slate-200 font-medium">{user?.clinicName || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Clinic Code</span>
            <span className="text-slate-200 font-medium">{user?.clinicCode || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Email</span>
            <span className="text-slate-200 font-medium">{user?.email || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Role</span>
            <span className="text-slate-200 font-medium capitalize">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
