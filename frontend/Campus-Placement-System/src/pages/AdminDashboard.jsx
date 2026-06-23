import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    { label: "Applications", title: "Review student applications", path: "/admin/applications", btn: "View Applications" },
    { label: "Companies", title: "Verify registered companies", path: "/admin/companies", btn: "Verify Companies" },
    { label: "Jobs", title: "Manage open positions", path: "/admin/post-job", btn: "Post Job" },
    { label: "Announcements", title: "Share updates with students", path: "/admin/announcements", btn: "Post Announcement" },
    { label: "Interviews", title: "Schedule interviews", path: "/admin/interviews", btn: "Manage Interviews" },
    { label: "Placements", title: "View placement records", path: "/admin/placements", btn: "View Placements" },
    { label: "Analytics", title: "System-wide insights", path: "/admin/analytics", btn: "View Analytics" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of platform activity and quick actions"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.path} className="interactive-card group cursor-pointer" onClick={() => navigate(card.path)}>
            <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition group-hover:w-16" />
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{card.title}</h2>
              <button type="button" className="btn btn-primary mt-4 px-4 py-2 text-xs" onClick={(e) => { e.stopPropagation(); navigate(card.path); }}>
                {card.btn}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
