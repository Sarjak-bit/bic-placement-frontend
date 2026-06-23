import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("api/users/password-reset/", { email });
      setSuccess("If an account exists for this email, a password reset link has been sent.");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
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
                Account Recovery
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Forgot Password</h1>
              <p className="mt-2 text-slate-500">
                Enter your email and we will send you a link to reset your password.
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-6">{error}</div>}
          {success && <div className="alert alert-success mb-6">{success}</div>}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="btn btn-secondary w-full"
            >
              I have a reset link
            </button>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-light)]"
            >
              Back to Login
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

export default ForgotPassword;
