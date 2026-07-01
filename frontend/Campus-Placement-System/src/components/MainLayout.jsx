import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import bicLogo from "../assets/BIC_Logo.png";

const navGroups = {
  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: "⌂" },
    {
      label: "Jobs",
      icon: "◇",
      children: [
        { label: "Job Opportunities", path: "/student/jobs" },
        { label: "Applications", path: "/student/applications" },
      ],
    },
    {
      label: "Updates",
      icon: "!",
      children: [
        { label: "Announcements", path: "/student/announcements" },
        { label: "Interviews", path: "/student/interviews" },
        { label: "Offer Letters", path: "/student/offer-letters" },
      ],
    },
    { label: "Profile", path: "/student/profile", icon: "◎" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
    {
      label: "Placement",
      icon: "□",
      children: [
        { label: "Applications", path: "/admin/applications" },
        { label: "Placements", path: "/admin/placements" },
      ],
    },
    {
      label: "Companies",
      icon: "◇",
      children: [
        { label: "Verify Companies", path: "/admin/companies" },
        { label: "Post Job", path: "/admin/post-job" },
      ],
    },
    {
      label: "Communication",
      icon: "!",
      children: [
        { label: "Announcements", path: "/admin/announcements" },
        { label: "Interviews", path: "/admin/interviews" },
      ],
    },
    { label: "Analytics", path: "/admin/analytics", icon: "↗" },
  ],
  company: [
    { label: "Dashboard", path: "/company/dashboard", icon: "⌂" },
    {
      label: "Hiring",
      icon: "◇",
      children: [
        { label: "Post Job", path: "/company/post-job" },
        { label: "Interviews", path: "/company/interviews" },
        { label: "Company Profile", path: "/company/profile-setup" },
      ],
    },
    { label: "Analytics", path: "/company/analytics", icon: "↗" },
  ],
};

const roleLabels = {
  student: "Student Portal",
  admin: "Admin Portal",
  company: "Company Portal",
};

const roleSubtitles = {
  student: "Track jobs, applications, and placement updates.",
  admin: "Monitor placement activity, companies, and hiring progress.",
  company: "Manage profile, hiring activity, and job posts.",
};

function flattenItems(items) {
  return items.flatMap((item) => item.children || [item]);
}

function isActivePath(pathname, path) {
  if (path === "/student/jobs") return pathname === path || pathname.startsWith("/student/jobs/");
  return pathname === path;
}

function isGroupActive(pathname, item) {
  if (item.path) return isActivePath(pathname, item.path);
  return item.children?.some((child) => isActivePath(pathname, child.path));
}

function MainLayout() {
  const { role, token, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const navItems = useMemo(() => navGroups[role] || [], [role]);
  const activeItem = flattenItems(navItems).find((item) => isActivePath(pathname, item.path));

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const exportSnapshot = async () => {
    if (role !== "admin") return;
    const response = await api.get("api/applications/export/", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "placement_applications.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const toggleGroup = (label) => {
    setOpenGroup((current) => (current === label ? "" : label));
  };

  const isGroupOpen = (item) => {
    if (!item.children) return false;
    return openGroup === item.label || (!openGroup && isGroupActive(pathname, item));
  };

  return (
    <main className="portal-shell">
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      <aside className={`portal-sidebar ${menuOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}`}>
        <button type="button" onClick={() => goTo(flattenItems(navItems)[0]?.path || "/")} className="mb-10 flex items-center gap-3 text-left">
          <img src={bicLogo} alt="Boston International College" className="h-12 w-auto" />
          <span>
            <span className="block text-xl font-extrabold text-slate-950">BIC</span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Placement</span>
          </span>
        </button>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
        <nav className="portal-nav-scroll space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => (item.children ? toggleGroup(item.label) : goTo(item.path))}
                className={`portal-nav-item ${isGroupActive(pathname, item) ? "portal-nav-active" : ""}`}
                aria-expanded={item.children ? isGroupOpen(item) : undefined}
              >
                <span className="portal-nav-icon">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <span className={`text-sm text-slate-400 transition-transform duration-200 ${isGroupOpen(item) ? "rotate-0" : "-rotate-90"}`}>
                    ˅
                  </span>
                )}
              </button>
              {item.children && (
                <div className={`ml-12 grid transition-all duration-300 ease-out ${isGroupOpen(item) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="mt-1 space-y-1 pb-1">
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          type="button"
                          onClick={() => goTo(child.path)}
                          className={`portal-subnav-item ${isActivePath(pathname, child.path) ? "portal-subnav-active" : ""}`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="portal-sidebar-bottom">
          <section className="rounded-3xl bg-white/88 p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-900">{roleLabels[role]}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">BIC placement workspace.</p>
          </section>
          <button type="button" onClick={logout} className="portal-logout-row" aria-label="Logout">
            <span className="portal-logout-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {menuOpen && <button type="button" className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <section className="portal-content">
        <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[2rem] font-extrabold leading-tight text-slate-950">{activeItem?.label || roleLabels[role]}</h1>
            <p className="mt-2 text-[0.95rem] text-slate-500">{roleSubtitles[role]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="dashboard-toolbar">
              Jul 1 - Jul 31, 2026
            </button>
            {role === "admin" && (
              <button type="button" onClick={exportSnapshot} className="dashboard-toolbar dashboard-toolbar-primary">
                Export Snapshot
              </button>
            )}
          </div>
        </header>
        <Outlet />
      </section>
    </main>
  );
}

export default MainLayout;
