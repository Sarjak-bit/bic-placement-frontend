import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/users/register/", formData);
      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Registration failed");
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
        <img src={bicLogo} alt="Boston International College" className="h-20 object-contain" />
        <div className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
          BIC Campus Placement System
        </div>
      </div>

      {/* Register Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4" style={{ backgroundColor: "#1a2f6e" }}>
              📝
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Register for the placement portal</p>
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90"
              style={{ backgroundColor: "#1a2f6e" }}
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="font-semibold cursor-pointer hover:underline"
              style={{ color: "#e85d1e" }}
            >
              Login here
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white text-xs py-4 opacity-70">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default RegisterPage;