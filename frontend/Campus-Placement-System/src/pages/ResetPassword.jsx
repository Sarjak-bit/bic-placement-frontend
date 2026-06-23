import { useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import bicLogo from "../assets/BIC_Logo.png";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  // Support uid/token coming from either the URL path (/reset-password/:uid/:token)
  // or as query params (/reset-password?uid=...&token=...), and fall back to
  // manual entry if neither is present (e.g. the email link did not deep-link cleanly).
  const [uid, setUid] = useState(params.uid || searchParams.get("uid") || "");
  const [token, setToken] = useState(params.token || searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const hasPrefilledLink = Boolean(params.uid || searchParams.get("uid"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!uid || !token) {
      setError("Missing reset link information. Please use the link from your email, or paste the UID and token below.");
      return;
    }

    setLoading(true);
    try {
      await api.post("api/users/password-reset-confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to reset password. The link may have expired.");
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
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Reset Password</h1>
              <p className="mt-2 text-slate-500">
                Choose a new password for your account.
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-6">{error}</div>}
          {success && <div className="alert alert-success mb-6">{success}</div>}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!hasPrefilledLink && (
                <>
                  <div>
                    <label className="form-label">Reset UID</label>
                    <input
                      type="text"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                      placeholder="Paste the UID from your email link"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Reset Token</label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste the token from your email link"
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
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

export default ResetPassword;
