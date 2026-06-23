import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#1a2f6e", "#e85d1e", "#16a34a", "#dc2626", "#7c3aed"];

function StudentAnalytics() {
  const [data, setData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/users/student-analytics/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setData(res.data));
  }, [token]);

  if (!data) {
    return (
      <div className="empty-state">
        <div className="mx-auto mb-4 h-8 w-48 rounded-full loading-shimmer" />
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Analytics"
        subtitle="Track your placement journey"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Applications", value: data.summary?.total_applications, color: "#1a2f6e" },
          { label: "Shortlisted", value: data.summary?.shortlisted, color: "#e85d1e" },
          { label: "Selected", value: data.summary?.selected, color: "#16a34a" },
          { label: "Success Rate", value: `${data.summary?.success_rate}%`, color: "#7c3aed" },
        ].map((card, i) => (
          <div key={i} className="stat-card">
            <div className="h-2 w-12 rounded-full" style={{ backgroundColor: card.color }} />
            <div>
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Interviews", value: data.summary?.interviews },
          { label: "Rejected", value: data.summary?.rejected },
          { label: "Pending", value: data.summary?.pending },
        ].map((card, i) => (
          <div key={i} className="interactive-card flex items-center gap-3 !p-4">
            <div>
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="text-xl font-bold text-[var(--primary)]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="interactive-card">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Monthly Applications</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthly_applications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#1a2f6e" strokeWidth={2} dot={{ fill: "#1a2f6e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="interactive-card">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.status_breakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                {data.status_breakdown?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data.recent_applications?.length > 0 && (
        <div className="interactive-card">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-2 px-3 text-left font-semibold text-slate-500">Job</th>
                  <th className="py-2 px-3 text-left font-semibold text-slate-500">Company</th>
                  <th className="py-2 px-3 text-left font-semibold text-slate-500">Status</th>
                  <th className="py-2 px-3 text-left font-semibold text-slate-500">Applied</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_applications.map((app, i) => (
                  <tr key={i} className="border-b border-slate-50 transition hover:bg-white/80">
                    <td className="py-2 px-3 font-semibold text-[var(--primary)]">{app.job_title}</td>
                    <td className="py-2 px-3 text-slate-500">{app.company}</td>
                    <td className="py-2 px-3">
                      <span className={`badge capitalize ${
                        app.status === "selected" ? "bg-green-100 text-green-700" :
                        app.status === "shortlisted" ? "bg-orange-100 text-orange-700" :
                        app.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAnalytics;
