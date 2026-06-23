import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bicLogo from "../assets/BIC_Logo.png";

const routeGroups = {
  student: [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Applications", path: "/student/applications" },
    { label: "Interviews", path: "/student/interviews" },
    { label: "Offer Letters", path: "/student/offer-letters" },
    { label: "Announcements", path: "/student/announcements" },
    { label: "Resume Upload", path: "/student/resume-upload" },
    { label: "My Profile", path: "/student/profile" },
    { label: "Edit Profile", path: "/student/edit-profile" },
    { label: "Analytics", path: "/student/analytics" },
    { label: "Placement", path: "/student/placement" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Applications", path: "/admin/applications" },
    { label: "Verify Companies", path: "/admin/companies" },
    { label: "Post Job", path: "/admin/post-job" },
    { label: "Announcements", path: "/admin/announcements" },
    { label: "Interviews", path: "/admin/interviews" },
    { label: "Placements", path: "/admin/placements" },
    { label: "Analytics", path: "/admin/analytics" },
  ],
  company: [
    { label: "Dashboard", path: "/company/dashboard" },
    { label: "Post Job", path: "/company/post-job" },
    { label: "Company Profile", path: "/company/profile-setup" },
    { label: "Analytics", path: "/company/analytics" },
  ],
};

const roleLabels = {
  student: "Student Portal",
  admin: "Admin Portal",
  company: "Company Portal",
};

function SidebarNav({ items, pathname, onNavigate, onClose }) {
  return (
    <nav className="space-y-1.5">
      {items.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              onNavigate(item.path);
              onClose?.();
            }}
            className={`nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
          >
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function MainLayout() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => routeGroups[role] || [], [role]);

  const homePath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "company"
        ? "/company/dashboard"
        : "/student/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* Top contact bar */}
      <div className="glass-dark text-xs text-white md:text-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 md:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 opacity-90">056-597077, 598892</span>
            <span className="inline-flex items-center gap-1.5 opacity-90">info@bostoncollege.edu.np</span>
          </div>
          <span className="hidden text-slate-300 sm:inline">Campus Placement System</span>
        </div>
      </div>

      {/* Navbar */}
      <header className="glass sticky top-0 z-50 border-b border-white/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-xl bg-white/80 ring-1 ring-slate-200/80 transition hover:bg-white lg:hidden"
              aria-label="Open menu"
            >
              <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
            </button>
            <button
              type="button"
              onClick={() => navigate(homePath)}
              className="group flex items-center gap-3 text-left transition"
            >
              <div className="rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-slate-200/60 transition group-hover:shadow-lg">
                <img
                  src={bicLogo}
                  alt="Boston International College"
                  className="h-11 w-auto object-contain md:h-12"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Placement Portal
                </p>
                <h1 className="text-sm font-bold text-slate-900 md:text-base">
                  Boston International College
                </h1>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="badge badge-primary hidden sm:inline-flex capitalize">{role}</span>
            <button type="button" onClick={() => navigate(homePath)} className="btn btn-ghost hidden px-4 py-2 sm:inline-flex">
              Home
            </button>
            <button type="button" onClick={handleLogout} className="btn btn-primary px-4 py-2 text-xs md:text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        {/* Desktop sidebar */}
        <aside className="glass-strong hidden w-72 shrink-0 rounded-[28px] p-5 lg:block">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {roleLabels[role] || "Navigation"}
            </p>
            <span className="badge badge-accent sm:hidden capitalize">{role}</span>
          </div>
          <SidebarNav items={items} pathname={pathname} onNavigate={navigate} />
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-5 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Quick tip</p>
            <p className="mt-2 text-sm leading-relaxed text-blue-50">
              Use the sidebar to jump between placements, analytics, and role-specific tools.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-8">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-400 sm:text-sm">
        © 2026 Boston International College — Campus Placement System
      </footer>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="glass-strong absolute left-0 top-0 flex h-full w-[min(320px,85vw)] flex-col p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <img src={bicLogo} alt="BIC" className="h-10 w-auto object-contain" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100"
                aria-label="Close menu"
              >
                <span className="absolute h-0.5 w-4 rotate-45 rounded-full bg-slate-600" />
                <span className="absolute h-0.5 w-4 -rotate-45 rounded-full bg-slate-600" />
              </button>
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {roleLabels[role]}
            </p>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                items={items}
                pathname={pathname}
                onNavigate={navigate}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
