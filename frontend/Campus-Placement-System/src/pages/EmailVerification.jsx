import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import bicLogo from "../assets/BIC_Logo.png";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | already | error
  const [message, setMessage] = useState("");

  const uid = params.uid || searchParams.get("uid") || "";
  const token = params.token || searchParams.get("token") || "";

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      setMessage("This verification link is missing required information.");
      return;
    }

    api.post("api/users/verify-email/", { uid, token })
      .then((res) => {
        const msg = res.data?.message || "";
        if (msg.toLowerCase().includes("already")) {
          setStatus("already");
        } else {
          setStatus("success");
        }
        setMessage(msg);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification link is invalid or expired.");
      });
  }, [uid, token]);

  return (
    <div className="auth-shell flex flex-col">
      <div className="auth-bg-orb -left-32 -top-32 h-96 w-96 bg-blue-400/30" />
      <div className="auth-bg-orb -bottom-32 -right-32 h-96 w-96 bg-orange-400/25" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="auth-card animate-fade-in-up text-center">
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="rounded-3xl bg-white p-3 shadow-lg ring-1 ring-slate-200/60">
              <img
                src={bicLogo}
                alt="Boston International College"
                className="h-20 w-auto object-contain md:h-24"
              />
            </div>
          </div>

          {status === "verifying" && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Verifying your email...</h1>
              <p className="mt-2 text-slate-500">Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Email Verified</h1>
              <div className="alert alert-success mt-4">{message || "Email verified successfully. You can now login."}</div>
              <button type="button" onClick={() => navigate("/")} className="btn btn-primary mt-6 w-full">
                Go to Login
              </button>
            </>
          )}

          {status === "already" && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Already Verified</h1>
              <div className="alert alert-success mt-4">{message || "Email is already verified."}</div>
              <button type="button" onClick={() => navigate("/")} className="btn btn-primary mt-6 w-full">
                Go to Login
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
              <div className="alert alert-error mt-4">{message}</div>
              <button type="button" onClick={() => navigate("/register")} className="btn btn-secondary mt-6 w-full">
                Back to Register
              </button>
            </>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        © 2026 Boston International College — Campus Placement System
      </footer>
    </div>
  );
}

export default EmailVerification;
