import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { getMediaUrl } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function JobApplication() {
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      api.get(`api/jobs/${id}/`, { headers }),
      api.get("api/users/student-profile/", { headers }),
      api.get("api/users/profile/", { headers }),
    ]).then(([jobRes, profileRes, userRes]) => {
      setJob(jobRes.data);
      setProfile(profileRes.data);
      setUser(userRes.data);
    }).catch(() => setError("Unable to load application details."));
  }, [id, token]);

  const uploadResume = async () => {
    if (!resumeFile) return true;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    setUploading(true);
    setError("");
    try {
      const res = await api.post("api/users/resume-upload/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile((prev) => ({ ...prev, resume: res.data.resume || prev?.resume }));
      setResumeFile(null);
      return true;
    } catch {
      setError("Resume upload failed. You can still submit with the saved resume.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const submitApplication = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (!profile.resume && !resumeFile) {
        setError("Please upload your resume before submitting this application.");
        setSubmitting(false);
        return;
      }
      if (resumeFile) {
        const uploaded = await uploadResume();
        if (!uploaded && !profile.resume) {
          setSubmitting(false);
          return;
        }
      }
      await api.post("api/applications/", { job: job.id, cover_letter: coverLetter }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Application submitted successfully.");
      setTimeout(() => navigate("/student/applications"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
      setSubmitting(false);
    }
  };

  if (error && (!job || !profile)) return <div className="alert alert-error">{error}</div>;
  if (!job || !profile) return <div className="empty-state text-slate-500">Loading application...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Apply for ${job.title}`}
        subtitle={`${job.company} will receive the student summary below.`}
      />

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.8fr]">
        <div className="interactive-card">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Student Summary</h2>
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
              {profile.profile_picture ? (
                <img src={getMediaUrl(profile.profile_picture)} alt={profile.full_name || user?.full_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-slate-400">Photo</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold text-slate-900">{profile.full_name || user?.full_name || user?.username}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Field label="Faculty" value={profile.faculty} />
                <Field label="Semester" value={profile.semester} />
                <Field label="GPA" value={profile.cgpa} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SummaryBlock title="Skills">
              {profile.skills?.length ? profile.skills.map((skill) => <span key={skill.id} className="badge badge-primary">{skill.name}</span>) : <p className="text-sm text-slate-500">No skills added.</p>}
            </SummaryBlock>
            <SummaryBlock title="Experience">
              {profile.experiences?.length ? profile.experiences.slice(0, 3).map((exp) => (
                <p key={exp.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{exp.title || exp.role} at {exp.company}</p>
              )) : <p className="text-sm text-slate-500">No experience added.</p>}
            </SummaryBlock>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Resume</p>
            {profile.resume ? (
              <a href={getMediaUrl(profile.resume)} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-semibold text-[var(--primary)] hover:underline">View saved resume</a>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No resume saved yet.</p>
            )}
          </div>
        </div>

        <div className="interactive-card">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Application</h2>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4">
            <label className="form-label">Resume</label>
            <p className="mb-3 text-sm text-slate-500">
              {profile.resume ? "Your saved resume will be included. Choose a new PDF if you want to replace it for this application." : "Upload a PDF resume before submitting."}
            </p>
            <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0] || null)} />
            <button type="button" onClick={uploadResume} disabled={!resumeFile || uploading} className="btn btn-ghost mt-3 w-full">
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

          <div className="mt-5">
            <label className="form-label">Cover Letter (optional)</label>
            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={7} placeholder="Write a short note for the company..." />
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => navigate(`/student/jobs/${job.id}`)} className="btn btn-ghost flex-1">Back</button>
            <button type="button" onClick={submitApplication} disabled={submitting} className="btn btn-primary flex-1">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

function SummaryBlock({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default JobApplication;
