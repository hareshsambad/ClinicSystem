import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = ({ user, logout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 glass border-b border-white/10 z-40 flex items-center px-4 gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-slate-300 hover:text-white text-xl p-1 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h2 className="text-base font-semibold text-gradient">🏥 CMS</h2>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/10 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} logout={logout} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 mt-14 md:mt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
