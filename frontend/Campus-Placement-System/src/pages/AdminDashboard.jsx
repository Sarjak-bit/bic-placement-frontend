import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    api.get("api/applications/", { headers }).then((res) => setApplications(normalizeList(res.data))).catch(() => setApplications([]));
    api.get("api/users/companies/", { headers }).then((res) => setCompanies(normalizeList(res.data))).catch(() => setCompanies([]));
    api.get("api/jobs/", { headers }).then((res) => setJobs(normalizeList(res.data))).catch(() => setJobs([]));
    api.get("api/announcements/", { headers }).then((res) => setAnnouncements(normalizeList(res.data))).catch(() => setAnnouncements([]));
  }, [token]);

  const counts = useMemo(() => ({
    totalApplications: applications.length,
    pendingCompanies: companies.filter((company) => !company.is_verified).length,
    activeJobs: jobs.filter((job) => job.is_active).length,
    announcements: announcements.length,
    applied: applications.filter((app) => app.status === "applied").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted").length,
    selected: applications.filter((app) => app.status === "selected").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  }), [applications, companies, jobs, announcements]);

  const recentApplications = applications.slice(0, 4);

  return (
    <div className="space-y-7">
      <section className="metric-band grid gap-6 p-6 md:grid-cols-4 md:p-8">
        <Metric label="Applications" value={counts.totalApplications} hint="submitted" />
        <Metric label="Active Jobs" value={counts.activeJobs} hint="published" />
        <Metric label="Pending Companies" value={counts.pendingCompanies} hint="need review" />
        <Metric label="Announcements" value={counts.announcements} hint="active updates" />
      </section>

      <section className="dashboard-panel grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] md:p-8">
        <article>
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Placement Operations</h2>
              <p className="mt-1 text-sm text-slate-500">Applications, companies, and jobs at a glance.</p>
            </div>
            <button type="button" onClick={() => navigate("/admin/applications")} className="btn btn-primary">Review Applications</button>
          </header>

          <div className="rounded-3xl bg-white/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold text-slate-900">Application Status</p>
              <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--primary)]" /> Count</span>
                <span className="text-[var(--primary)]">{counts.totalApplications} total</span>
              </div>
            </div>
            <div className="grid h-52 grid-cols-4 items-end gap-6 border-b border-slate-200 px-6">
              {[
                ["Applied", counts.applied],
                ["Shortlist", counts.shortlisted],
                ["Selected", counts.selected],
                ["Rejected", counts.rejected],
              ].map(([label, count]) => {
                const height = Math.max(16, count * 34);
                return (
                  <div key={label} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="text-sm font-bold text-slate-700">{count}</span>
                    <span className="w-9 rounded-t-2xl bg-[var(--primary)] shadow-[0_10px_24px_rgba(26,47,110,0.22)]" style={{ height }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-6 px-6 text-center text-xs font-semibold text-slate-500">
              <span>Applied</span>
              <span>Shortlist</span>
              <span>Selected</span>
              <span>Rejected</span>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <ActionCard title="Company Verification" value={counts.pendingCompanies} action="Open" onClick={() => navigate("/admin/companies")} />
          <ActionCard title="Post New Job" value={counts.activeJobs} action="Post" onClick={() => navigate("/admin/post-job")} />
          <ActionCard title="Publish Update" value={counts.announcements} action="Create" onClick={() => navigate("/admin/announcements")} />
        </aside>
      </section>

      <section className="dashboard-panel p-6 md:p-8">
        <header className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-950">Recent Applications</h2>
          <button type="button" onClick={() => navigate("/admin/applications")} className="text-sm font-bold text-[var(--primary)]">View all</button>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          {recentApplications.length === 0 ? (
            <p className="text-sm text-slate-500">No applications submitted yet.</p>
          ) : recentApplications.map((application) => (
            <article key={application.id} className="rounded-2xl bg-white/70 p-4">
              <p className="font-bold text-slate-950">{application.student_name}</p>
              <p className="mt-1 text-sm text-slate-500">{application.job_detail?.title} • {application.job_detail?.company}</p>
              <span className="badge badge-primary mt-3 capitalize">{application.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, hint }) {
  return (
    <article className="border-l border-white/60 pl-5 first:border-l-0 first:pl-0">
      <p className="text-[0.72rem] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-5 text-4xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{hint}</p>
    </article>
  );
}

function ActionCard({ title, value, action, onClick }) {
  return (
    <article className="rounded-3xl bg-white/72 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-extrabold text-slate-950">{value}</p>
        <button type="button" onClick={onClick} className="text-sm font-bold text-[var(--primary)]">{action}</button>
      </div>
    </article>
  );
}

export default AdminDashboard;
