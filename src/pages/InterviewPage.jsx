import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function InterviewPage() {
  const [interviews, setInterviews] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/interviews/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setInterviews(res.data));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled": return "📅";
      case "completed": return "✅";
      case "cancelled": return "❌";
      default: return "📋";
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
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Student Portal</p>
          <button onClick={() => navigate("/student/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate("/student/applications")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📋 My Applications
          </button>
          <button onClick={() => navigate("/student/interviews")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            🎤 Interviews
          </button>
          <button onClick={() => navigate("/student/offer-letters")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📜 Offer Letters
          </button>
          <button onClick={() => navigate("/student/announcements")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📢 Announcements
          </button>
          <button onClick={() => navigate("/student/resume-upload")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📄 Upload Resume
          </button>
          <button onClick={() => navigate("/student/offer-letters")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
  📜 Offer Letters
</button>
          <button onClick={() => navigate("/student/edit-profile")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            👤 Edit Profile
          </button>
        </div>

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a2f6e" }}>My Interviews</h1>
          <p className="text-gray-500 text-sm mb-6">Track your scheduled and completed interviews</p>

          {interviews.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <p className="text-4xl mb-4">🎤</p>
              <p className="text-gray-500">No interviews scheduled yet.</p>
              <p className="text-gray-400 text-sm mt-1">Keep applying to jobs to get interview calls!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviews.map(interview => (
                <div key={interview.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#1a2f6e" }}>{interview.job_title}</h3>
                      <p className="text-gray-500 text-sm">{interview.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyle(interview.status)}`}>
                      {getStatusIcon(interview.status)} {interview.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(interview.interview_date).toLocaleDateString()} at {new Date(interview.interview_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Mode</p>
                      <p className="font-semibold text-gray-700 capitalize">
                        {interview.mode === "online" ? "🌐 Online" : "🏢 Offline"}
                      </p>
                    </div>
                  </div>

                  {interview.mode === "offline" && interview.location && (
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <p className="text-blue-400 text-xs mb-1">Location</p>
                      <p className="font-semibold text-blue-700">📍 {interview.location}</p>
                    </div>
                  )}

                  {interview.mode === "online" && interview.meeting_link && (
                    <button
                      onClick={() => window.open(interview.meeting_link, "_blank")}
                      className="bg-blue-50 rounded-lg p-3 text-sm flex items-center gap-2 hover:bg-blue-100 transition w-full text-left"
                    >
                      <span className="text-blue-700 font-semibold">🔗 Join Meeting</span>
                    </button>
                  )}

                  {interview.instructions && (
                    <div className="border-t pt-3">
                      <p className="text-gray-400 text-xs mb-1">Instructions</p>
                      <p className="text-gray-600 text-sm">{interview.instructions}</p>
                    </div>
                  )}
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

export default InterviewPage;