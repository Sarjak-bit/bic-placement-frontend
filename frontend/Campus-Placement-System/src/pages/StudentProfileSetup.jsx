import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function StudentProfileSetup() {
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    cgpa: "",
    student_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("api/users/student-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
        setIsEditing(true);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Unable to load profile. Please try again.");
        }
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        await api.patch("api/users/student-profile/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Profile updated successfully!");
      } else {
        await api.post("api/users/student-profile/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Profile saved successfully!");
      }
      setTimeout(() => navigate("/student/dashboard"), 1200);
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
        title="Complete Your Profile"
        subtitle="Fill in your academic details to view eligible jobs"
      />

      <div className="mx-auto max-w-md form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Faculty</label>
            <input name="faculty" value={formData.faculty} onChange={handleChange} placeholder="e.g. BCSIT" required />
          </div>
          <div>
            <label className="form-label">Semester</label>
            <input name="semester" type="number" value={formData.semester} onChange={handleChange} placeholder="e.g. 4" required />
          </div>
          <div>
            <label className="form-label">CGPA</label>
            <input name="cgpa" type="number" step="0.01" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 3.50" required />
          </div>
          <div>
            <label className="form-label">Student ID</label>
            <input name="student_id" value={formData.student_id} onChange={handleChange} placeholder="e.g. 2470263" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/student/dashboard")} className="btn btn-ghost flex-1">
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

export default StudentProfileSetup;
