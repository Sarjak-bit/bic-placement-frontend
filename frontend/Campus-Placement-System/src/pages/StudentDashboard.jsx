import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getMediaUrl } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function daysUntil(dateValue) {
  if (!dateValue) return null;
  const target = new Date(`${dateValue}T00:00:00`);
  return Math.ceil((target - new Date()) / 86400000);
}

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    api.get("api/users/student-profile/", { headers })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err.response?.status === 404) navigate("/student/profile-setup");
      });

    api.get("api/users/profile/", { headers }).then((res) => setUser(res.data));
    api.get("api/jobs/", { headers }).then((res) => setJobs(normalizeList(res.data))).catch(() => setJobs([]));
    api.get("api/jobs/recommended/", { headers }).then((res) => setRecommendedJobs(normalizeList(res.data))).catch(() => setRecommendedJobs([]));
    api.get("api/applications/", { headers }).then((res) => setApplications(normalizeList(res.data))).catch(() => setApplications([]));
    api.get("api/announcements/", { headers }).then((res) => setAnnouncements(normalizeList(res.data))).catch(() => setAnnouncements([]));
  }, [token, navigate]);

  const displayName = profile?.full_name || user?.full_name || user?.username || "Student";
  const bestMatch = recommendedJobs[0];
  const nextDeadline = useMemo(
    () => [...jobs].filter((job) => daysUntil(job.deadline) !== null && daysUntil(job.deadline) >= 0).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0],
    [jobs]
  );
  const latestApplication = applications[0];
  const latestAnnouncement = announcements[0];

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.profile_picture,
      profile.full_name || user?.full_name,
      profile.bio,
      profile.faculty,
      profile.semester,
      profile.cgpa,
      profile.resume,
      profile.skills?.length,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile, user]);

  return (
    <div className="space-y-7">
      <section className="metric-band grid gap-8 p-6 md:grid-cols-[1.1fr_1.8fr] md:p-8">
        <article className="flex items-center gap-5">
          <div className="h-28 w-28 overflow-hidden rounded-3xl bg-white shadow-sm ring-4 ring-white/70">
            {profile?.profile_picture ? (
              <img src={getMediaUrl(profile.profile_picture)} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-slate-400">Photo</div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Welcome</p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-950">{displayName}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {profile?.faculty || "Faculty pending"} • Semester {profile?.semester || "—"}
            </p>
          </div>
        </article>

        <section className="grid gap-6 sm:grid-cols-4">
          <Metric label="Profile" value={`${profileCompletion}%`} hint="complete" />
          <Metric label="Open Jobs" value={jobs.length} hint="available" />
          <Metric label="Applied" value={applications.length} hint="submitted" />
          <Metric label="Matches" value={recommendedJobs.length} hint="recommended" />
        </section>
      </section>

      <section className="dashboard-panel grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] md:p-8">
        <article>
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Placement Overview</h2>
              <p className="mt-1 text-sm text-slate-500">Track what needs attention today.</p>
            </div>
            <button type="button" onClick={() => navigate("/student/jobs")} className="btn btn-primary">Browse Jobs</button>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <Insight title="Best Match" value={bestMatch?.title || "No match yet"} note={bestMatch?.company || "Complete your profile for better matching."} />
            <Insight title="Next Deadline" value={nextDeadline ? `${daysUntil(nextDeadline.deadline)} day(s)` : "None"} note={nextDeadline?.title || "No upcoming deadline."} />
            <Insight title="Last Status" value={latestApplication?.status || "No application"} note={latestApplication?.job_detail?.title || "Apply to track progress."} />
          </div>

          <div className="mt-8 rounded-3xl bg-white/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold text-slate-900">Application Activity</p>
              <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--primary)]" /> Count</span>
                <span className="text-[var(--primary)]">{applications.length} total</span>
              </div>
            </div>
            <div className="grid h-44 grid-cols-4 items-end gap-5 border-b border-slate-200 px-4">
              {["Applied", "Shortlisted", "Selected", "Rejected"].map((status) => {
                const count = applications.filter((app) => app.status === status.toLowerCase()).length;
                const height = Math.max(14, count * 34);
                return (
                  <div key={status} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="text-sm font-bold text-slate-700">{count}</span>
                    <span className="w-8 rounded-t-2xl bg-[var(--primary)] shadow-[0_10px_24px_rgba(26,47,110,0.22)]" style={{ height }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-5 px-4 text-center text-xs font-semibold text-slate-500">
              <span>Applied</span>
              <span>Shortlist</span>
              <span>Selected</span>
              <span>Rejected</span>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <SideCard title="Recommended Job" action="View" onClick={() => bestMatch && navigate(`/student/jobs/${bestMatch.id}`)}>
            <p className="font-bold text-slate-950">{bestMatch?.title || "No recommendation yet"}</p>
            <p className="mt-1 text-sm text-slate-500">{bestMatch?.company || "Add skills and resume to improve matches."}</p>
          </SideCard>
          <SideCard title="Latest Announcement" action="Open" onClick={() => navigate("/student/announcements")}>
            <p className="font-bold text-slate-950">{latestAnnouncement?.title || "No announcements"}</p>
            <p className="mt-1 line-clamp-3 text-sm text-slate-500">{latestAnnouncement?.content || "Updates from placement cell will appear here."}</p>
          </SideCard>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value, hint }) {
  return (
    <article className="border-l border-white/60 pl-5 first:border-l-0 first:pl-0">
      <p className="text-[0.72rem] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-5 text-3xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{hint}</p>
    </article>
  );
}

function Insight({ title, value, note }) {
  return (
    <article className="rounded-3xl bg-white/72 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-4 text-lg font-extrabold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </article>
  );
}

function SideCard({ title, action, onClick, children }) {
  return (
    <article className="rounded-3xl bg-white/72 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <button type="button" onClick={onClick} className="text-sm font-bold text-[var(--primary)]">{action}</button>
      </div>
      {children}
    </article>
  );
}

export default StudentDashboard;
