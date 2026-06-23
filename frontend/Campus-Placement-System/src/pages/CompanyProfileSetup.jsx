import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

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
    api.get("api/users/company-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setFormData(res.data);
      setIsEditing(true);
    }).catch(() => {
      setIsEditing(false);
    });
  }, [token]);

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
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Update Company Profile" : "Setup Company Profile"}
        subtitle={isEditing ? "Update your company details" : "Complete your profile to start posting jobs"}
      />

      <div className="mx-auto max-w-xl form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Company Name</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="e.g. Leapfrog Technology" required />
          </div>
          <div>
            <label className="form-label">Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Software" />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kathmandu, Nepal" />
          </div>
          <div>
            <label className="form-label">Website</label>
            <input name="website" value={formData.website} onChange={handleChange} placeholder="e.g. https://lftechnology.com" />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell students about your company..." rows={4} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/company/dashboard")} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {isEditing ? "Update Profile" : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfileSetup;
