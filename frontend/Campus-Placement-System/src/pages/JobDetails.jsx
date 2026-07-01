import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function JobDetails() {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`api/jobs/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setJob(res.data))
      .catch(() => setError("Unable to load this job."));
  }, [id, token]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!job) return <div className="empty-state text-slate-500">Loading job details...</div>;

  const responsibilities = splitLines(job.responsibilities || job.description);
  const skills = splitCsv(job.required_skills || job.skills);
  const qualifications = [
    job.required_faculty && `Faculty: ${job.required_faculty}`,
    job.required_semester && `Minimum semester: ${job.required_semester}`,
    job.required_cgpa && `Minimum GPA: ${job.required_cgpa}`,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title={job.title}
        subtitle={`${job.company} • ${job.job_type || "Opportunity"}`}
        actions={<button type="button" onClick={() => navigate(`/student/jobs/${job.id}/apply`)} className="btn btn-primary">Apply</button>}
      />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
        <div className="space-y-6">
          <Panel title="Job Description">
            <p className="leading-7 text-slate-600">{job.description || "No description provided."}</p>
          </Panel>

          <Panel title="Responsibilities">
            <BulletList items={responsibilities} />
          </Panel>

          <Panel title="Required Skills">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => <span key={skill} className="badge badge-primary">{skill}</span>)}
              </div>
            ) : (
              <p className="text-slate-500">Skills are not listed for this role.</p>
            )}
          </Panel>

          <Panel title="Qualifications">
            <BulletList items={qualifications} />
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Company Information">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-base font-bold text-[var(--primary)]">
                {job.company?.slice(0, 2).toUpperCase() || "CO"}
              </div>
              <div>
                <p className="font-bold text-slate-900">{job.company}</p>
                <p className="text-sm text-slate-500">{job.location || "Location not specified"}</p>
              </div>
            </div>
          </Panel>

          <Panel title="Application Details">
            <Info label="Employment Type" value={job.job_type} />
            <Info label="Deadline" value={job.deadline} />
            <Info label="Salary" value={job.salary || "Not disclosed"} />
            {typeof job.match_score === "number" && <Info label="AI Match" value={`${Math.round(job.match_score)}%`} />}
            <button type="button" onClick={() => navigate(`/student/jobs/${job.id}/apply`)} className="btn btn-primary mt-5 w-full">Apply for this Job</button>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="interactive-card">
      <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

function BulletList({ items }) {
  return items.length > 0 ? (
    <ul className="space-y-2 text-slate-600">
      {items.map((item) => <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">{item}</li>)}
    </ul>
  ) : (
    <p className="text-slate-500">No details provided.</p>
  );
}

function splitLines(value) {
  if (!value) return [];
  return value.split(/\n|•|-/).map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

function splitCsv(value) {
  if (!value) return [];
  return value.split(/,|\n/).map((item) => item.trim()).filter(Boolean);
}

export default JobDetails;
