import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bicLogo from "../assets/BIC_Logo.png";

const navItems = {
  student: [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Applications", path: "/student/applications" },
    { label: "Interviews", path: "/student/interviews" },
    { label: "Offer Letters", path: "/student/offer-letters" },
    { label: "Announcements", path: "/student/announcements" },
    { label: "Resume Upload", path: "/student/resume-upload" },
    { label: "Profile", path: "/student/profile" },
    { label: "Analytics", path: "/student/analytics" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Post Job", path: "/admin/post-job" },
    { label: "Announcements", path: "/admin/announcements" },
    { label: "Interviews", path: "/admin/interviews" },
    { label: "Placements", path: "/admin/placements" },
    { label: "Analytics", path: "/admin/analytics" },
  ],
  company: [
    { label: "Dashboard", path: "/company/dashboard" },
    { label: "Post Job", path: "/company/post-job" },
    { label: "Profile", path: "/company/profile-setup" },
    { label: "Analytics", path: "/company/analytics" },
  ],
};

function PageShell({ title, subtitle, actions, children, hideSidebar }) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = useMemo(() => navItems[role] || [], [role]);

  return (
    <div className="min-h-screen bg-hero-surface text-slate-900">
      <div className="bg-primary text-white text-xs md:text-sm px-6 py-3 flex flex-col md:flex-row justify-between gap-3 items-center shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2">056-597077, 598892</span>
          <span className="inline-flex items-center gap-2">info@bostoncollege.edu.np</span>
        </div>
        <div className="text-slate-200 opacity-90">Campus Placement System — Modern placement experience</div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6 px-6 py-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[30px] border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <img src={bicLogo} alt="BIC" className="h-16 w-auto rounded-2xl shadow-sm" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
                <p className="text-slate-500 mt-1">{subtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3"> 
              {actions}
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 px-6 pb-8">
        {!hideSidebar && (
          <aside className="w-full lg:w-72 shrink-0 rounded-4xl border border-slate-200/80 bg-white/90 p-5 shadow-xl backdrop-blur-xl overflow-hidden">
            <div className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-[0.18em]">{role?.toUpperCase()} NAV</div>
            <div className="space-y-2">
              {items.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left rounded-2xl px-4 py-3 transition-all duration-200 ${pathname === item.path ? "bg-slate-900 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </aside>
        )}

        <main className="flex-1 space-y-6">
          {children}
        </main>
      </div>

      <footer className="text-center py-6 text-slate-400 text-xs sm:text-sm">© 2026 Boston International College — Campus Placement System</footer>
    </div>
  );
}

export default PageShell;
