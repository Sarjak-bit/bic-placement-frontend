import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    job_type: "fulltime",
    required_faculty: "",
    required_semester: "",
    required_cgpa: "",
    deadline: "",
  });
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
      await api.post("api/jobs/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Job posted successfully!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to post job");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Post a New Job"
        subtitle="Fill in the details to post a job for eligible students"
      />

      <div className="mx-auto max-w-2xl form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Job Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" required />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Tech Nepal Pvt. Ltd." required />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job description..." rows={4} required />
          </div>

          <div>
            <label className="form-label">Job Type</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange}>
              <option value="fulltime">Full Time</option>
              <option value="internship">Internship</option>
              <option value="parttime">Part Time</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">Required Faculty</label>
              <input name="required_faculty" value={formData.required_faculty} onChange={handleChange} placeholder="e.g. BCSIT" />
            </div>
            <div>
              <label className="form-label">Min Semester</label>
              <input name="required_semester" type="number" value={formData.required_semester} onChange={handleChange} placeholder="e.g. 4" />
            </div>
            <div>
              <label className="form-label">Min CGPA</label>
              <input name="required_cgpa" type="number" step="0.01" value={formData.required_cgpa} onChange={handleChange} placeholder="e.g. 2.50" />
            </div>
          </div>

          <div>
            <label className="form-label">Application Deadline</label>
            <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
