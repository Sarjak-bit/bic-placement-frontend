import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function StudentProfileSetup() {
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    cgpa: "",
    student_id: "",
  });
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/users/student-profile/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/student/dashboard");
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
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a2f6e 0%, #2563eb 60%, #e85d1e 100%)" }}>

      {/* Top bar */}
      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

      {/* Header */}
      <div className="w-full bg-white py-3 px-8 flex items-center justify-between shadow">
        <img src={bicLogo} alt="BIC" className="h-20 object-contain" />
        <div className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
          BIC Campus Placement System
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl mb-4" style={{ backgroundColor: "#1a2f6e" }}>
              🎓
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Complete Your Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in your academic details to view eligible jobs</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Faculty</label>
              <input
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="e.g. BCSIT"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Semester</label>
              <input
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                placeholder="e.g. 4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>CGPA</label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 3.50"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Student ID</label>
              <input
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="e.g. 2470263"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: "#1a2f6e" }}
            >
              Save & Continue
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white text-xs py-4 opacity-70">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default StudentProfileSetup;