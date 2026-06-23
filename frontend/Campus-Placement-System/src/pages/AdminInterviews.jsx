import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

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
  const { token } = useAuth();

  useEffect(() => {
    fetchInterviews();
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setApplications(res.data.filter((a) => a.status === "shortlisted")));
  }, [token]);

  const fetchInterviews = () => {
    api.get("api/interviews/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setInterviews(res.data));
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
    } catch {
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
    } catch {
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
    <div className="space-y-6">
      <PageHeader
        title="Interview Scheduling"
        subtitle="Schedule interviews for shortlisted candidates"
        actions={
          <button type="button" onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "+ Schedule Interview"}
          </button>
        }
      />

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="form-section">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">New Interview</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Application (Shortlisted)</label>
              <select name="application" value={formData.application} onChange={handleChange} required>
                <option value="">Select application</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    Student {app.student} — {app.job_detail?.title} at {app.job_detail?.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Date & Time</label>
                <input name="interview_date" type="datetime-local" value={formData.interview_date} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Mode</label>
                <select name="mode" value={formData.mode} onChange={handleChange}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {formData.mode === "online" ? (
              <div>
                <label className="form-label">Meeting Link</label>
                <input name="meeting_link" value={formData.meeting_link} onChange={handleChange} placeholder="e.g. https://meet.google.com/abc-xyz" />
              </div>
            ) : (
              <div>
                <label className="form-label">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. BIC Conference Room, 2nd Floor" />
              </div>
            )}

            <div>
              <label className="form-label">Instructions (optional)</label>
              <textarea name="instructions" value={formData.instructions} onChange={handleChange} placeholder="e.g. Bring your resume and ID card" rows={3} />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Schedule Interview
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Scheduled Interviews ({interviews.length})</h2>
        {interviews.length === 0 ? (
          <div className="empty-state">
            <p className="text-slate-500">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {interviews.map((interview) => (
              <article key={interview.id} className="interactive-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[var(--primary)]">{interview.job_title}</h3>
                    <p className="text-sm text-slate-500">{interview.company}</p>
                  </div>
                  <span className={`badge capitalize ${getStatusStyle(interview.status)}`}>
                    {interview.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>{new Date(interview.interview_date).toLocaleString()}</p>
                  <p>Student: {interview.student}</p>
                  <p>{interview.mode === "online" ? "Online" : `${interview.location}`}</p>
                </div>
                <button type="button" onClick={() => handleDelete(interview.id)} className="btn btn-danger mt-3 w-full py-2 text-xs">
                  Cancel Interview
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInterviews;
