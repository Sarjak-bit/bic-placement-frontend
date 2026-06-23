import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function PostAnnouncement() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/announcements/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Announcement posted successfully!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      setError("Failed to post announcement");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Post Announcement"
        subtitle="Broadcast a message to all students"
      />

      <div className="mx-auto max-w-2xl form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Leapfrog Campus Drive" required />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Write your announcement here..." rows={6} required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Post Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostAnnouncement;
