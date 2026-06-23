import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function EditProfile() {
  const [accountData, setAccountData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [academicData, setAcademicData] = useState({
    faculty: "",
    semester: "",
    cgpa: "",
    student_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setAccountData({
        full_name: res.data.full_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
    });

    api.get("api/users/student-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setAcademicData({
        faculty: res.data.faculty || "",
        semester: res.data.semester || "",
        cgpa: res.data.cgpa || "",
        student_id: res.data.student_id || "",
      });
    });
  }, [token]);

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handleAcademicChange = (e) => {
    setAcademicData({ ...academicData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await Promise.all([
        api.patch("api/users/update-profile/", accountData, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.patch("api/users/student-profile/", academicData, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSuccess("Profile updated successfully.");
      setTimeout(() => navigate("/student/dashboard"), 1500);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to update profile.");
      }
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Profile"
        subtitle="Update your account and academic information"
      />

      <div className="mx-auto max-w-lg form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  name="full_name"
                  value={accountData.full_name}
                  onChange={handleAccountChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  placeholder="your.email@bic.edu.np"
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={accountData.phone}
                  onChange={handleAccountChange}
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Academic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Faculty</label>
                <input name="faculty" value={academicData.faculty} onChange={handleAcademicChange} placeholder="e.g. BCSIT" />
              </div>
              <div>
                <label className="form-label">Semester</label>
                <input name="semester" type="number" value={academicData.semester} onChange={handleAcademicChange} placeholder="e.g. 4" />
              </div>
              <div>
                <label className="form-label">CGPA</label>
                <input name="cgpa" type="number" step="0.01" value={academicData.cgpa} onChange={handleAcademicChange} placeholder="e.g. 3.50" />
              </div>
              <div>
                <label className="form-label">Student ID</label>
                <input name="student_id" value={academicData.student_id} onChange={handleAcademicChange} placeholder="e.g. 2470263" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/student/dashboard")} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
