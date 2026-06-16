import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch company profile
    api.get("api/users/company-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data))
    .catch(() => navigate("/company/profile-setup"));

    // Fetch jobs
    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setJobs(res.data.results));

    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setApplications(res.data));
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.patch(`api/applications/${appId}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const applied = applications.filter(app => app.status === "applied");
  const shortlisted = applications.filter(app => app.status === "shortlisted");
  const selected = applications.filter(app => app.status === "selected");
  const rejected = applications.filter(app => app.status === "rejected");

  const ApplicationCard = ({ app, showActions }) => (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold" style={{ color: "#1a2f6e" }}>{app.job_detail?.title}</h3>
          <p className="text-gray-500 text-sm">{app.job_detail?.company}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(app.applied_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-500">Student: {app.student}</p>
      {showActions && (
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => handleStatusUpdate(app.id, "shortlisted")}
            className="flex-1 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: "#e85d1e" }}
          >
            ⭐ Shortlist
          </button>
          <button
            onClick={() => handleStatusUpdate(app.id, "selected")}
            className="flex-1 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: "#16a34a" }}
          >
            ✅ Select
          </button>
          <button
            onClick={() => handleStatusUpdate(app.id, "rejected")}
            className="flex-1 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: "#dc2626" }}
          >
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  );

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
          <span className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
            🏢 {profile?.company_name || "Company Portal"}
          </span>
          <button
            onClick={handleLogout}
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
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Company Portal</p>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/company/post-job")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            ➕ Post New Job
          </button>
          <button
            onClick={() => navigate("/company/profile-setup")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            🏢 Company Profile
          </button>

          {profile && (
            <div className="mt-auto px-2 pt-8 border-t border-blue-700">
              <p className="text-white text-sm font-semibold">{profile.company_name}</p>
              <p className="text-blue-300 text-xs">{profile.industry}</p>
              {profile.is_verified ? (
                <span className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-green-800 text-green-200">✅ Verified</span>
              ) : (
                <span className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-yellow-800 text-yellow-200">⏳ Pending Verification</span>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Jobs", value: jobs.length, icon: "💼", color: "#1a2f6e" },
              { label: "Applied", value: applied.length, icon: "📨", color: "#2563eb" },
              { label: "Shortlisted", value: shortlisted.length, icon: "⭐", color: "#e85d1e" },
              { label: "Selected", value: selected.length, icon: "✅", color: "#16a34a" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Jobs Section */}
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1a2f6e" }}>Your Posted Jobs</h2>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow mb-8">
              <p className="text-gray-400">No jobs posted yet.</p>
              <button
                onClick={() => navigate("/company/post-job")}
                className="mt-4 px-6 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90"
                style={{ backgroundColor: "#1a2f6e" }}
              >
                Post First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold" style={{ color: "#1a2f6e" }}>{job.title}</h3>
                      <p className="text-gray-500 text-sm">{job.company}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">{job.job_type}</span>
                      {job.is_verified ? (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✅ Verified</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">⏳ Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
                    <span>🎓 {job.required_faculty}</span>
                    <span>📚 Sem {job.required_semester}</span>
                    <span>⭐ CGPA {job.required_cgpa}+</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">📅 Deadline: {job.deadline}</p>
                </div>
              ))}
            </div>
          )}

          {/* Applications */}
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1a2f6e" }}>Applications</h2>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
              📨 New Applications <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{applied.length}</span>
            </h3>
            {applied.length === 0 ? <p className="text-gray-400 text-sm mb-4">No new applications.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {applied.map(app => <ApplicationCard key={app.id} app={app} showActions={true} />)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#e85d1e" }}>
              ⭐ Shortlisted <span className="px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: "#e85d1e" }}>{shortlisted.length}</span>
            </h3>
            {shortlisted.length === 0 ? <p className="text-gray-400 text-sm mb-4">No shortlisted candidates.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {shortlisted.map(app => <ApplicationCard key={app.id} app={app} showActions={true} />)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
              ✅ Selected <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{selected.length}</span>
            </h3>
            {selected.length === 0 ? <p className="text-gray-400 text-sm mb-4">No selected candidates.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {selected.map(app => <ApplicationCard key={app.id} app={app} showActions={false} />)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
              ❌ Rejected <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{rejected.length}</span>
            </h3>
            {rejected.length === 0 ? <p className="text-gray-400 text-sm mb-4">No rejected candidates.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {rejected.map(app => <ApplicationCard key={app.id} app={app} showActions={false} />)}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default CompanyDashboard;