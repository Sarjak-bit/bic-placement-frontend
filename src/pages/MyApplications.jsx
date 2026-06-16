import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   api.get("api/applications/", {
  headers: { Authorization: `Bearer ${token}` },
}).then(res => setApplications(res.data));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700";
      case "shortlisted": return "bg-orange-100 text-orange-700";
      case "selected": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied": return "📨";
      case "shortlisted": return "⭐";
      case "selected": return "✅";
      case "rejected": return "❌";
      default: return "📋";
    }
  };

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
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Student Portal</p>

          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/student/applications")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            📋 My Applications
          </button>
          <button
            onClick={() => navigate("/student/edit-profile")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            👤 Edit Profile
          </button>

          <button onClick={() => navigate("/student/offer-letters")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
  📜 Offer Letters
</button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a2f6e" }}>My Applications</h1>
          <p className="text-gray-500 text-sm mb-6">Track the status of your job applications</p>

          {applications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="mt-4 px-6 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90"
                style={{ backgroundColor: "#1a2f6e" }}
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map(app => (
                <div key={app.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#1a2f6e" }}>{app.job_detail?.title}</h3>
                      <p className="text-gray-500 text-sm">{app.job_detail?.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyle(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>💼 {app.job_detail?.job_type}</span>
                    <span>📅 Deadline: {app.job_detail?.deadline}</span>
                  </div>
                  <div className="text-xs text-gray-400 border-t pt-3">
                    Applied on: {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default MyApplications;