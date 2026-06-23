import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/users/company-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setProfile(res.data))
      .catch(() => navigate("/company/profile-setup"));

    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setJobs(res.data.results));

    fetchApplications();
  }, [token, navigate]);

  const fetchApplications = () => {
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setApplications(res.data));
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.patch(
        `api/applications/${appId}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch {
      alert("Failed to update status");
    }
  };

  const applied = applications.filter((app) => app.status === "applied");
  const shortlisted = applications.filter((app) => app.status === "shortlisted");
  const selected = applications.filter((app) => app.status === "selected");
  const rejected = applications.filter((app) => app.status === "rejected");

  const ApplicationCard = ({ app, showActions }) => (
    <article className="interactive-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-[var(--primary)]">{app.job_detail?.title}</h3>
          <p className="text-sm text-slate-500">{app.job_detail?.company}</p>
        </div>
        <span className="text-xs text-slate-400">
          {new Date(app.applied_at).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">Student: {app.student}</p>
      {showActions && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => handleStatusUpdate(app.id, "shortlisted")} className="btn btn-secondary flex-1 py-2 text-xs">
            Shortlist
          </button>
          <button type="button" onClick={() => handleStatusUpdate(app.id, "selected")} className="flex-1 rounded-2xl bg-green-600 py-2 text-xs font-semibold text-white transition hover:bg-green-700">
            Select
          </button>
          <button type="button" onClick={() => handleStatusUpdate(app.id, "rejected")} className="btn btn-danger flex-1 py-2 text-xs">
            Reject
          </button>
        </div>
      )}
    </article>
  );

  const ApplicationSection = ({ title, items, showActions, accent }) => (
    <div className="mb-6">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: accent }}>
        {title} <span className="badge" style={{ backgroundColor: `${accent}20`, color: accent }}>{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No candidates in this stage.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((app) => (
            <ApplicationCard key={app.id} app={app} showActions={showActions} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Dashboard"
        subtitle={profile ? `${profile.company_name} · ${profile.industry || "Industry not set"}` : "Manage jobs and applications"}
        actions={
          profile && (
            profile.is_verified ? (
              <span className="badge bg-green-100 text-green-700">Verified</span>
            ) : (
              <span className="badge bg-yellow-100 text-yellow-700">Pending Verification</span>
            )
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Jobs", value: jobs.length, color: "#1a2f6e" },
          { label: "Applied", value: applied.length, color: "#2563eb" },
          { label: "Shortlisted", value: shortlisted.length, color: "#e85d1e" },
          { label: "Selected", value: selected.length, color: "#16a34a" },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="h-2 w-12 rounded-full" style={{ backgroundColor: stat.color }} />
            <div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-bold text-[var(--primary)] mb-4">Your Posted Jobs</h2>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p className="text-slate-400">No jobs posted yet.</p>
            <button type="button" onClick={() => navigate("/company/post-job")} className="btn btn-primary mt-4">
              Post First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <article key={job.id} className="interactive-card">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-[var(--primary)]">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge bg-blue-100 text-blue-700 capitalize">{job.job_type}</span>
                    {job.is_verified ? (
                      <span className="badge bg-green-100 text-green-700">Verified</span>
                    ) : (
                      <span className="badge bg-yellow-100 text-yellow-700">Pending</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                  <span>{job.required_faculty}</span>
                  <span>Sem {job.required_semester}</span>
                  <span>CGPA {job.required_cgpa}+</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Deadline: {job.deadline}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--primary)] mb-4">Applications</h2>
        <ApplicationSection title="New Applications" items={applied} showActions accent="#2563eb" />
        <ApplicationSection title="Shortlisted" items={shortlisted} showActions accent="#e85d1e" />
        <ApplicationSection title="Selected" items={selected} showActions={false} accent="#16a34a" />
        <ApplicationSection title="Rejected" items={rejected} showActions={false} accent="#dc2626" />
      </section>
    </div>
  );
}

export default CompanyDashboard;
