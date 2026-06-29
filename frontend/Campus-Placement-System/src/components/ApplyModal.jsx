import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function ApplyModal({ job, onClose, onApplied }) {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("api/users/student-profile/", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("api/users/profile/", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([profileRes, userRes]) => {
        if (cancelled) return;
        setProfile(profileRes.data);
        setUser(userRes.data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your profile. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    setUploadingResume(true);
    setError("");
    try {
      await api.post("api/users/resume-upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumeUploaded(true);
    } catch {
      setError("Failed to upload resume. You can still apply without it.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleConfirmApply = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post(
        "api/applications/",
        { job: job.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onApplied(job.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
      setSubmitting(false);
    }
  };

  const goEditProfile = () => {
    onClose();
    navigate("/student/edit-profile");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="glass-strong relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Application Review</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{job.company}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && <div className="alert alert-error mt-5">{error}</div>}

        {loadingProfile ? (
          <div className="mt-6 empty-state">
            <p className="text-slate-500">Loading your profile...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="rounded-[20px] bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Your Profile</h3>
                <button type="button" onClick={goEditProfile} className="text-xs font-semibold text-[var(--primary)] hover:underline">
                  Edit Profile
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Full Name" value={user?.full_name} />
                <Field label="Email" value={user?.email} />
                <Field label="Student ID" value={profile?.student_id} />
                <Field label="Faculty" value={profile?.faculty} />
                <Field label="Semester" value={profile?.semester} />
                <Field label="CGPA" value={profile?.cgpa} />
                <Field label="Phone" value={profile?.phone} />
              </div>

              {profile?.skills?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill.id} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-slate-400">
                This is the information that will be shared with the employer. If anything is incorrect, edit your profile before applying.
              </p>
            </div>

            <div className="rounded-[20px] border-2 border-dashed border-slate-200 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Resume (optional)</h3>
              {resumeUploaded ? (
                <p className="mt-3 text-sm font-semibold text-green-700">Resume uploaded.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    className="text-sm text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleResumeUpload}
                    disabled={!resumeFile || uploadingResume}
                    className="btn btn-secondary px-4 py-2 text-xs"
                  >
                    {uploadingResume ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400">PDF only. You can apply without uploading a resume.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmApply} disabled={submitting} className="btn btn-primary flex-1">
                {submitting ? "Submitting..." : "Confirm & Apply"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default ApplyModal;
