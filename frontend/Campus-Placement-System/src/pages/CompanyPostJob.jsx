import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function CompanyPostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    job_type: "fulltime",
    required_faculty: "",
    required_semester: "",
    required_cgpa: "",
    deadline: "",
    salary: "",
    location: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
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
      setSuccess("Job posted successfully! Waiting for admin verification.");
      setTimeout(() => navigate("/company/dashboard"), 2000);
    } catch {
      setError("Failed to post job. Please check all fields.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Post a New Job"
        subtitle="Fill in the details below. Job will be visible after admin verification."
      />

      <div className="mx-auto max-w-2xl form-section">
        {success && <div className="alert alert-success mb-4">{success}</div>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Job Title</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
          </div>
          <div>
            <label className="form-label">Company Name</label>
            <input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Leapfrog Technology" required />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the role..." rows={4} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Job Type</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange}>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="form-label">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kathmandu" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">Required Faculty</label>
              <input name="required_faculty" value={formData.required_faculty} onChange={handleChange} placeholder="e.g. BIT" />
            </div>
            <div>
              <label className="form-label">Required Semester</label>
              <input name="required_semester" type="number" value={formData.required_semester} onChange={handleChange} placeholder="e.g. 6" />
            </div>
            <div>
              <label className="form-label">Min CGPA</label>
              <input name="required_cgpa" type="number" step="0.1" value={formData.required_cgpa} onChange={handleChange} placeholder="e.g. 3.0" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Salary (optional)</label>
              <input name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. 25000" />
            </div>
            <div>
              <label className="form-label">Application Deadline</label>
              <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyPostJob;
