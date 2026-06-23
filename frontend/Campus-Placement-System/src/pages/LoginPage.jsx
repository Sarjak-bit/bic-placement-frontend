import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("api/users/login/", { email, password });
      const { access, refresh, role } = response.data;

      login(access, refresh, role);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex flex-col">
      <div className="auth-bg-orb -left-32 -top-32 h-96 w-96 bg-blue-400/30" />
      <div className="auth-bg-orb -bottom-32 -right-32 h-96 w-96 bg-orange-400/25" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="auth-card animate-fade-in-up">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-3xl bg-white p-3 shadow-lg ring-1 ring-slate-200/60">
              <img
                src={bicLogo}
                alt="Boston International College"
                className="h-20 w-auto object-contain md:h-24"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Campus Placement System
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-2 text-slate-500">Sign in to your placement and hiring dashboard.</p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-6">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-light)]"
            >
              Register here
            </button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        © 2026 Boston International College — Campus Placement System
      </footer>
    </div>
  );
}

export default LoginPage;
