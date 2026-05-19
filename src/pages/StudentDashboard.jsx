import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data));

    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const ids = res.data.map(app => app.job);
      setAppliedJobIds(ids);
    });
  }, []);

  useEffect(() => {
    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: search || undefined,
        job_type: jobType || undefined,
      }
    }).then(res => {
      setJobs(res.data.results);
    }).catch(err => {
      if (err.response?.data?.message === "Please complete your profile first") {
        navigate("/student/profile-setup");
      }
    });
  }, [search, jobType]);

  const handleApply = async (jobId) => {
    try {
      await api.post("api/applications/", { job: jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobIds([...appliedJobIds, jobId]);
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const jobTypeColor = (type) => {
    switch (type) {
      case "internship": return "bg-blue-100 text-blue-700";
      case "fulltime": return "bg-green-100 text-green-700";
      case "parttime": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
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
          <span className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
            👋 Welcome, {profile?.username}
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
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Student Portal</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/student/applications")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📋 My Applications
          </button>
          <button
            onClick={() => navigate("/student/edit-profile")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            👤 Edit Profile
          </button>
          <button
            onClick={() => navigate("/student/announcements")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📢 Announcements
          </button>
          <button
            onClick={() => navigate("/student/resume-upload")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📄 Upload Resume
          </button>
          {profile && (
            <div className="mt-auto px-2 pt-8 border-t border-blue-700">
              <p className="text-white text-sm font-semibold">{profile.username}</p>
              <p className="text-blue-300 text-xs">{profile.email}</p>
              <span className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-blue-800 text-blue-200 capitalize">{profile.role}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2f6e" }}>Available Jobs</h1>
              <p className="text-gray-500 text-sm">Jobs you are eligible to apply for based on your profile</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by job title or company..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white shadow-sm"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white shadow-sm"
            >
              <option value="">All Types</option>
              <option value="internship">Internship</option>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
            </select>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500">No eligible jobs available right now.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later or update your profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#1a2f6e" }}>{job.title}</h3>
                      <p className="text-gray-500 text-sm">{job.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${jobTypeColor(job.job_type)}`}>
                      {job.job_type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{job.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>📅 Deadline: {job.deadline}</span>
                    <span>🎓 CGPA: {job.required_cgpa}+</span>
                  </div>
                  {appliedJobIds.includes(job.id) ? (
                    <button
                      disabled
                      className="mt-2 w-full py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      ✓ Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="mt-2 w-full py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                      style={{ backgroundColor: "#1a2f6e" }}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;