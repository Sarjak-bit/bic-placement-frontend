import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Post a New Job</h2>
      <button onClick={() => navigate("/admin/dashboard")}>← Back</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>
        <div>
          <label>Company</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Tech Nepal Pvt. Ltd."
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job description..."
            rows={4}
          />
        </div>
        <div>
          <label>Job Type</label>
          <select name="job_type" value={formData.job_type} onChange={handleChange}>
            <option value="fulltime">Full Time</option>
            <option value="internship">Internship</option>
            <option value="parttime">Part Time</option>
          </select>
        </div>
        <div>
          <label>Required Faculty</label>
          <input
            name="required_faculty"
            value={formData.required_faculty}
            onChange={handleChange}
            placeholder="e.g. BCSIT"
          />
        </div>
        <div>
          <label>Required Semester</label>
          <input
            name="required_semester"
            type="number"
            value={formData.required_semester}
            onChange={handleChange}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <label>Minimum CGPA</label>
          <input
            name="required_cgpa"
            type="number"
            step="0.01"
            value={formData.required_cgpa}
            onChange={handleChange}
            placeholder="e.g. 2.50"
          />
        </div>
        <div>
          <label>Application Deadline</label>
          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;