import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#1a2f6e", "#e85d1e", "#16a34a", "#dc2626", "#7c3aed", "#0891b2"];

function CompanyAnalytics() {
  const [data, setData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/users/company-analytics/", {
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
        title="Company Analytics"
        subtitle="Performance overview of your job postings and hiring"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: "Total Jobs", value: data.summary?.total_jobs },
          { label: "Active Jobs", value: data.summary?.active_jobs },
          { label: "Pending Verification", value: data.summary?.pending_verification },
          { label: "Total Applications", value: data.summary?.total_applications },
          { label: "Selection Rate", value: `${data.summary?.selection_rate}%` },
        ].map((card, i) => (
          <div key={i} className="stat-card">
            <div>
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="interactive-card">
        <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Monthly Applications</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthly_applications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#1a2f6e" strokeWidth={2} dot={{ fill: "#1a2f6e" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

        <div className="interactive-card">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Applicants by Faculty</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.faculty_breakdown} dataKey="count" nameKey="faculty" cx="50%" cy="50%" outerRadius={80} label>
                {data.faculty_breakdown?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="interactive-card">
        <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Performance per Job</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.jobs_stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="job" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="applications" fill="#1a2f6e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="selected" fill="#e85d1e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CompanyAnalytics;