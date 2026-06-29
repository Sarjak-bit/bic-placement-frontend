import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const STUDENT_DOMAIN = "@student.bic.edu.np";

  const detectRole = (email) => {
    return email.toLowerCase().endsWith(STUDENT_DOMAIN) ? "student" : "company";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const role = detectRole(formData.email);

    // TEMPORARY WORKAROUND: kept until confirmed the backend no longer
    // requires `username` on register. Remove this block once confirmed
    // unnecessary.
    const emailPrefix = formData.email.split("@")[0] || "user";
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const payload = {
      ...formData,
      role,
      username: `${emailPrefix}_${randomSuffix}`,
    };

    try {
      await api.post("api/users/register/", payload);
      setRegistered(true);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Registration failed");
      }
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
                Join the Portal
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {registered ? "Check Your Email" : "Create Your Account"}
              </h1>
              <p className="mt-2 text-slate-500">
                {registered
                  ? "We've sent a verification link to your email address. Please verify your account before logging in."
                  : "Register for access to placements, company hiring, and analytics."}
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          {registered ? (
            <div className="space-y-5">
              <div className="alert alert-success">
                Registration successful. Please check {formData.email} for a verification link, then log in.
              </div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn btn-primary w-full"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="form-label">Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
                  <p className="mt-1 text-xs text-slate-400">
                    {formData.email
                      ? `Will register as ${detectRole(formData.email) === "student" ? "Student" : "Company"}.`
                      : `Use a ${STUDENT_DOMAIN} email to register as a student. Any other email registers as a company.`}
                  </p>
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
          )}

          {!registered && (
            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-light)]"
              >
                Login here
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        © 2026 Boston International College — Campus Placement System
      </footer>
    </div>
  );
}

export default RegisterPage;