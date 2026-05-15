import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "blue" }}>Register here</span></p>
    </div>
  );
}

export default LoginPage;