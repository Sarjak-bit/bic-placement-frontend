import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    application: "",
    interview_date: "",
    mode: "online",
    location: "",
    meeting_link: "",
    instructions: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setApplications(res.data.filter(a => a.status === "shortlisted")));
  }, []);

  const fetchInterviews = () => {
    api.get("api/interviews/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setInterviews(res.data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/interviews/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Interview scheduled successfully!");
      setShowForm(false);
      fetchInterviews();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to schedule interview");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;
    try {
      await api.delete(`api/interviews/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInterviews();
    } catch (err) {
      alert("Failed to cancel interview");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f6fb" }}>

      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

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

        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Admin Portal</p>
          <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate("/admin/post-job")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            ➕ Post New Job
          </button>
          <button onClick={() => navigate("/admin/announcements")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📢 Post Announcement
          </button>
          <button onClick={() => navigate("/admin/interviews")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            🎤 Interviews
          </button>
          <button onClick={() => navigate("/admin/analytics")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📊 Analytics
          </button>
        </div>

        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Interview Scheduling</h1>
              <p className="text-gray-500 text-sm mt-1">Schedule interviews for shortlisted candidates</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90"
              style={{ backgroundColor: "#1a2f6e" }}
            >
              {showForm ? "Cancel" : "+ Schedule Interview"}
            </button>
          </div>

          {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          {showForm && (
            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1a2f6e" }}>New Interview</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Application (Shortlisted)</label>
                  <select
                    name="application"
                    value={formData.application}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="">Select application</option>
                    {applications.map(app => (
                      <option key={app.id} value={app.id}>
                        Student {app.student} — {app.job_detail?.title} at {app.job_detail?.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Date & Time</label>
                    <input
                      name="interview_date"
                      type="datetime-local"
                      value={formData.interview_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Mode</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                    >
                      <option value="online">🌐 Online</option>
                      <option value="offline">🏢 Offline</option>
                    </select>
                  </div>
                </div>

                {formData.mode === "online" ? (
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Meeting Link</label>
                    <input
                      name="meeting_link"
                      value={formData.meeting_link}
                      onChange={handleChange}
                      placeholder="e.g. https://meet.google.com/abc-xyz"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Location</label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. BIC Conference Room, 2nd Floor"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Instructions (optional)</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Bring your resume and ID card"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90"
                  style={{ backgroundColor: "#1a2f6e" }}
                >
                  Schedule Interview
                </button>
              </form>
            </div>
          )}

          <h2 className="text-lg font-bold mb-4" style={{ color: "#1a2f6e" }}>Scheduled Interviews ({interviews.length})</h2>
          {interviews.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <p className="text-4xl mb-4">🎤</p>
              <p className="text-gray-500">No interviews scheduled yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviews.map(interview => (
                <div key={interview.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold" style={{ color: "#1a2f6e" }}>{interview.job_title}</h3>
                      <p className="text-gray-500 text-sm">{interview.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyle(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>📅 {new Date(interview.interview_date).toLocaleString()}</p>
                    <p>👤 Student: {interview.student}</p>
                    <p>{interview.mode === "online" ? "🌐 Online" : "🏢 " + interview.location}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(interview.id)}
                    className="mt-1 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Cancel Interview
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default AdminInterviews;