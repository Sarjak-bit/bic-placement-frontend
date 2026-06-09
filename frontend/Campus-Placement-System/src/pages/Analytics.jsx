import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function Analytics() {
  const [stats, setStats] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/users/analytics/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setStats(res.data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f6fb" }}>

      {/* Top bar */}
      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

      {/* Header */}
      <div className="w-full bg-white py-3 px-8 flex items-center justify-between shadow">
        <img src={bicLogo} alt="BIC" className="h-20 object-contain" />
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>Admin Panel</span>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "#e85d1e" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Admin Portal</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/post-job")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            ➕ Post New Job
          </button>
          <button
            onClick={() => navigate("/admin/announcements")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📢 Post Announcement
          </button>
          <button
            onClick={() => navigate("/admin/analytics")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            📊 Analytics
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a2f6e" }}>Placement Analytics</h1>
          <p className="text-gray-500 text-sm mb-8">Overview of placement statistics at BIC</p>

          {!stats ? (
            <p className="text-gray-400">Loading analytics...</p>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Total Students", value: stats.total_students, icon: "🎓", color: "#1a2f6e" },
                  { label: "Total Jobs", value: stats.total_jobs, icon: "💼", color: "#2563eb" },
                  { label: "Total Applications", value: stats.total_applications, icon: "📨", color: "#7c3aed" },
                  { label: "Shortlisted", value: stats.shortlisted, icon: "⭐", color: "#e85d1e" },
                  { label: "Selected", value: stats.selected, icon: "✅", color: "#16a34a" },
                  { label: "Rejected", value: stats.rejected, icon: "❌", color: "#dc2626" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl" style={{ backgroundColor: stat.color }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Placement Rate */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4" style={{ color: "#1a2f6e" }}>Placement Rate</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div
                      className="h-4 rounded-full transition-all"
                      style={{
                        width: `${stats.total_students > 0 ? (stats.selected / stats.total_students) * 100 : 0}%`,
                        backgroundColor: "#16a34a"
                      }}
                    />
                  </div>
                  <span className="text-lg font-bold" style={{ color: "#16a34a" }}>
                    {stats.total_students > 0
                      ? ((stats.selected / stats.total_students) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{stats.selected} out of {stats.total_students} students placed</p>
              </div>

              {/* Application Breakdown */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold mb-4" style={{ color: "#1a2f6e" }}>Application Breakdown</h2>
                <div className="space-y-3">
                  {[
                    { label: "Shortlisted", value: stats.shortlisted, total: stats.total_applications, color: "#e85d1e" },
                    { label: "Selected", value: stats.selected, total: stats.total_applications, color: "#16a34a" },
                    { label: "Rejected", value: stats.rejected, total: stats.total_applications, color: "#dc2626" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-600">{item.label}</span>
                        <span className="text-gray-400">{item.value} / {item.total}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                            backgroundColor: item.color
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
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default Analytics;