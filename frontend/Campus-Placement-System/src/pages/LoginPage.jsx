import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("api/users/login/", { username, password });
      const profileRes = await api.get("api/users/profile/", {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });
      login(response.data.access, response.data.refresh, profileRes.data.role);
    if (profileRes.data.role === "admin") {
  navigate("/admin/dashboard");
} else if (profileRes.data.role === "company") {
  navigate("/company/dashboard");
} else {
  navigate("/student/dashboard");
}
    } catch (err) {
      setError("Invalid username or password");
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
      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4" style={{ backgroundColor: "#1a2f6e" }}>
              🎓
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your placement portal</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": "#1a2f6e" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#1a2f6e" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90"
              style={{ backgroundColor: "#1a2f6e" }}
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-semibold cursor-pointer hover:underline"
              style={{ color: "#e85d1e" }}
            >
              Register here
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

export default LoginPage;