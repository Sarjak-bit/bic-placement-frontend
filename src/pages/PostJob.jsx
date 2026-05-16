import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f6fb" }}>

      {/* Top bar */}
      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

      {/* Header */}
      <div className="w-full bg-white py-3 px-8 flex items-center justify-between shadow">
        <img src={bicLogo} alt="BIC" className="h-20 object-contain" />
        <div className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
          Admin Panel
        </div>
      </div>

      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Admin Portal</p>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/post-job")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            ➕ Post New Job
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex items-start justify-center">
          <div className="bg-white rounded-2xl shadow w-full max-w-2xl p-8">

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl mb-4" style={{ backgroundColor: "#1a2f6e" }}>
                💼
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Post a New Job</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details to post a job for eligible students</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Job Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer Intern"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Company</label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Tech Nepal Pvt. Ltd."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Job description..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Job Type</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="fulltime">Full Time</option>
                  <option value="internship">Internship</option>
                  <option value="parttime">Part Time</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Required Faculty</label>
                  <input
                    name="required_faculty"
                    value={formData.required_faculty}
                    onChange={handleChange}
                    placeholder="e.g. BCSIT"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Min Semester</label>
                  <input
                    name="required_semester"
                    type="number"
                    value={formData.required_semester}
                    onChange={handleChange}
                    placeholder="e.g. 4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Min CGPA</label>
                  <input
                    name="required_cgpa"
                    type="number"
                    step="0.01"
                    value={formData.required_cgpa}
                    onChange={handleChange}
                    placeholder="e.g. 2.50"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Application Deadline</label>
                <input
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                  style={{ backgroundColor: "#1a2f6e" }}
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default PostJob;