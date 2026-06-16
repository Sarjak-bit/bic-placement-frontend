import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function CompanyProfileSetup() {
  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if profile already exists
    api.get("api/users/company-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setFormData(res.data);
      setIsEditing(true);
    }).catch(() => {
      setIsEditing(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch("api/users/company-profile/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("api/users/company-profile/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccess("Profile saved successfully!");
      setTimeout(() => navigate("/company/dashboard"), 1500);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to save profile");
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
          Company Portal
        </div>
      </div>

      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Company Portal</p>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            🏢 Company Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex items-start justify-center">
          <div className="bg-white rounded-2xl shadow w-full max-w-xl p-8">

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl mb-4" style={{ backgroundColor: "#1a2f6e" }}>
                🏢
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>
                {isEditing ? "Update Company Profile" : "Setup Company Profile"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEditing ? "Update your company details" : "Complete your profile to start posting jobs"}
              </p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Company Name</label>
                <input
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Leapfrog Technology"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Industry</label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Software"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Website</label>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g. https://lftechnology.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell students about your company..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/company/dashboard")}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                  style={{ backgroundColor: "#1a2f6e" }}
                >
                  {isEditing ? "Update Profile" : "Save & Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default CompanyProfileSetup;