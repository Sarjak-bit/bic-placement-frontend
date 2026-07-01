import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function daysUntil(dateValue) {
  if (!dateValue) return null;
  const target = new Date(`${dateValue}T00:00:00`);
  return Math.ceil((target - new Date()) / 86400000);
}

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    faculty: "",
    company: "",
    job_type: "",
    deadline: "",
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    api.get("api/jobs/recommended/", { headers }).then((res) => setRecommendedJobs(normalizeList(res.data))).catch(() => setRecommendedJobs([]));
    api.get("api/applications/", { headers }).then((res) => setApplications(normalizeList(res.data))).catch(() => setApplications([]));
  }, [token]);

  useEffect(() => {
    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: filters.search || filters.company || undefined,
        faculty: filters.faculty || undefined,
        job_type: filters.job_type || undefined,
      },
    }).then((res) => setJobs(normalizeList(res.data)))
      .catch((err) => {
        if (err.response?.data?.message === "Please complete your profile first") navigate("/student/profile-setup");
      });
  }, [filters.search, filters.company, filters.faculty, filters.job_type, token, navigate]);

  const appliedJobIds = useMemo(() => applications.map((app) => app.job), [applications]);

  const visibleJobs = useMemo(() => {
    const source = activeTab === "recommended" ? recommendedJobs : jobs;
    return source.filter((job) => {
      const companyOk = !filters.company || job.company?.toLowerCase().includes(filters.company.toLowerCase());
      const deadlineDays = daysUntil(job.deadline);
      const deadlineOk =
        !filters.deadline ||
        (filters.deadline === "week" && deadlineDays !== null && deadlineDays <= 7) ||
        (filters.deadline === "month" && deadlineDays !== null && deadlineDays <= 30);
      return companyOk && deadlineOk;
    });
  }, [activeTab, filters.company, filters.deadline, jobs, recommendedJobs]);

  const clearFilters = () => setFilters({ search: "", faculty: "", company: "", job_type: "", deadline: "" });

  return (
    <div className="space-y-6">
      <section className="liquid-glass rounded-[28px] p-6 md:p-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Job Opportunities</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Find placement openings</h1>
          </div>
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by title or company"
            className="lg:max-w-sm"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button type="button" onClick={() => setActiveTab("all")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === "all" ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500"}`}>
              All
            </button>
            <button type="button" onClick={() => setActiveTab("recommended")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === "recommended" ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500"}`}>
              Recommended
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <Filter label="Job Type">
              <select value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}>
                <option value="">Any type</option>
                <option value="internship">Internship</option>
                <option value="fulltime">Full time</option>
                <option value="parttime">Part time</option>
              </select>
            </Filter>
            <Filter label="Deadline">
              <select value={filters.deadline} onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}>
                <option value="">Any deadline</option>
                <option value="week">Due in 7 days</option>
                <option value="month">Due in 30 days</option>
              </select>
            </Filter>
            <Filter label="Faculty">
              <input value={filters.faculty} onChange={(e) => setFilters({ ...filters, faculty: e.target.value })} placeholder="e.g. BCSIT" />
            </Filter>
            <Filter label="Company">
              <input value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} placeholder="Company name" />
            </Filter>
            <button type="button" onClick={clearFilters} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-900">
              Clear filters
            </button>
          </div>
        </aside>

        <section className="grid gap-4 md:grid-cols-2">
          {visibleJobs.length === 0 ? (
            <div className="empty-state md:col-span-2">
              <p className="text-slate-500">No jobs match the current filters.</p>
            </div>
          ) : (
            visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} applied={appliedJobIds.includes(job.id)} onOpen={() => navigate(`/student/jobs/${job.id}`)} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function Filter({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function JobCard({ job, applied, onOpen }) {
  return (
    <article className="flex min-h-[230px] flex-col rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)]">
          {job.company?.slice(0, 2).toUpperCase() || "CO"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{job.company}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{job.title}</h3>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="badge bg-slate-100 text-slate-700">{job.job_type}</span>
        <span className="badge bg-orange-50 text-orange-700">Deadline {job.deadline}</span>
        {typeof job.match_score === "number" && <span className="badge bg-emerald-50 text-emerald-700">{Math.round(job.match_score)}% match</span>}
      </div>
      <button type="button" onClick={onOpen} className={applied ? "btn btn-ghost mt-auto w-full" : "btn btn-primary mt-auto w-full"}>
        {applied ? "View Details" : "View Job"}
      </button>
    </article>
  );
}

export default StudentJobs;
