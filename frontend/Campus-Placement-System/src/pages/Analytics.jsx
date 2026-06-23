import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function Analytics() {
  const [stats, setStats] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/users/analytics/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setStats(res.data));
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Analytics"
        subtitle="Overview of placement statistics at BIC"
      />

      {!stats ? (
        <div className="empty-state">
          <div className="mx-auto mb-4 h-8 w-48 rounded-full loading-shimmer" />
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { label: "Total Students", value: stats.total_students, color: "#1a2f6e" },
              { label: "Total Jobs", value: stats.total_jobs, color: "#2563eb" },
              { label: "Total Applications", value: stats.total_applications, color: "#7c3aed" },
              { label: "Shortlisted", value: stats.shortlisted, color: "#e85d1e" },
              { label: "Selected", value: stats.selected, color: "#16a34a" },
              { label: "Rejected", value: stats.rejected, color: "#dc2626" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="h-2 w-14 rounded-full" style={{ backgroundColor: stat.color }} />
                <div>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="interactive-card">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Placement Rate</h2>
            <div className="flex items-center gap-4">
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-4 rounded-full bg-green-500 transition-all"
                  style={{
                    width: `${stats.total_students > 0 ? (stats.selected / stats.total_students) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-lg font-bold text-green-600">
                {stats.total_students > 0
                  ? ((stats.selected / stats.total_students) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{stats.selected} out of {stats.total_students} students placed</p>
          </div>

          <div className="interactive-card">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Application Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Shortlisted", value: stats.shortlisted, total: stats.total_applications, color: "#e85d1e" },
                { label: "Selected", value: stats.selected, total: stats.total_applications, color: "#16a34a" },
                { label: "Rejected", value: stats.rejected, total: stats.total_applications, color: "#dc2626" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="text-slate-400">{item.value} / {item.total}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
