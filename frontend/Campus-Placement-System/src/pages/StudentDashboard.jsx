import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ApplyModal from "../components/ApplyModal";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeJob, setActiveJob] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check directly whether a StudentProfile exists for this account.
    // A 404 here means the student never completed profile setup —
    // redirect immediately rather than waiting for some other endpoint
    // to fail indirectly later.
    api.get("api/users/student-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => {
      if (err.response?.status === 404) {
        navigate("/student/profile-setup");
      }
    });

    api.get("api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data));

    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setAppliedJobIds(list.map(app => app.job));
    }).catch(() => setAppliedJobIds([]));
  }, []);

  useEffect(() => {
    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: search || undefined,
        job_type: jobType || undefined,
      }
    }).then(res => {
      setJobs(res.data.results);
    }).catch(err => {
      if (err.response?.data?.message === "Please complete your profile first") {
        navigate("/student/profile-setup");
      }
    });
  }, [search, jobType]);

  const handleApplied = (jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
    setActiveJob(null);
  };

  const jobTypeColor = (type) => {
    switch (type) {
      case "internship": return "bg-blue-100 text-blue-700";
      case "fulltime": return "bg-green-100 text-green-700";
      case "parttime": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const matchScoreColor = (score) => {
    if (score >= 75) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        subtitle="Find the best opportunities for your career"
        actions={
          <button type="button" onClick={() => navigate("/student/analytics")} className="btn btn-secondary">
            View Analytics
          </button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="interactive-card">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{profile?.full_name || profile?.email || "Student"}</h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{profile?.role?.toUpperCase() || "STUDENT"}</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-base font-medium text-slate-900">{profile?.email || "—"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Profile Status</p>
                <p className="mt-2 text-base font-medium text-slate-900">{profile ? "Complete" : "Pending"}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900 px-4 py-5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Applied</p>
                <p className="mt-3 text-3xl font-semibold">{appliedJobIds.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Open Jobs</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.length}</p>
              </div>
              <div className="rounded-3xl bg-amber-50 px-4 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-600">Role</p>
                <p className="mt-3 text-3xl font-semibold text-amber-700">Student</p>
              </div>
            </div>
          </div>
        </div>

        <div className="interactive-card bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white !border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Job snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold">Your next move</h2>
            </div>
            <div className="rounded-3xl bg-slate-800/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">Quick apply</div>
          </div>
          <div className="mt-7 space-y-4 text-sm text-slate-200">
            <p>Use filters and smart search to narrow down the best roles for your faculty and semester.</p>
            <p className="rounded-3xl bg-slate-800/60 p-4">Tip: set your job type to <span className="font-semibold text-white">internship</span> for part-time roles.</p>
            <button onClick={() => navigate("/student/applications")} className="btn btn-secondary mt-3">
              Review My Applications
            </button>
          </div>
        </div>
      </section>

      <section className="interactive-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live job feed</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Available opportunities</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role or company"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">All types</option>
              <option value="internship">Internship</option>
              <option value="fulltime">Full time</option>
              <option value="parttime">Part time</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {jobs.length === 0 ? (
            <div className="col-span-2 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No eligible jobs available yet. Update your profile to discover more.
            </div>
          ) : (
            jobs.map(job => (
              <article key={job.id} className="interactive-card !p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                      {typeof job.match_score === "number" && (
                        <span className={`badge ${matchScoreColor(job.match_score)}`}>
                          {Math.round(job.match_score)}% match
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${jobTypeColor(job.job_type)}`}>
                      {job.job_type}
                    </span>
                    {job.is_verified ? (
                      <span className="badge bg-green-100 text-green-700">Verified</span>
                    ) : (
                      <span className="badge bg-yellow-100 text-yellow-700">Not yet verified</span>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{job.description}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="rounded-2xl bg-slate-100 px-3 py-2">Deadline: {job.deadline}</span>
                  <span className="rounded-2xl bg-slate-100 px-3 py-2">CGPA: {job.required_cgpa}+</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveJob(job)}
                  disabled={appliedJobIds.includes(job.id)}
                  className={`mt-6 ${appliedJobIds.includes(job.id) ? "btn btn-ghost" : "btn btn-primary"}`}
                >
                  {appliedJobIds.includes(job.id) ? "Already Applied" : "Apply Now"}
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {activeJob && (
        <ApplyModal
          job={activeJob}
          onClose={() => setActiveJob(null)}
          onApplied={handleApplied}
        />
      )}
    </div>
  );
}

export default StudentDashboard;