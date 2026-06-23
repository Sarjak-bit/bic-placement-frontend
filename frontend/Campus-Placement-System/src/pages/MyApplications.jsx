import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setApplications(res.data));
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700";
      case "shortlisted": return "bg-orange-100 text-orange-700";
      case "selected": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track the status of your job applications"
      />

      {applications.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">You haven&apos;t applied to any jobs yet.</p>
          <button type="button" onClick={() => navigate("/student/dashboard")} className="btn btn-primary mt-6">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {applications.map((app) => (
            <article key={app.id} className="interactive-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{app.job_detail?.title}</h3>
                  <p className="text-sm text-slate-500">{app.job_detail?.company}</p>
                </div>
                <span className={`badge capitalize ${getStatusStyle(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="rounded-xl bg-slate-100 px-3 py-1.5">{app.job_detail?.job_type}</span>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5">Deadline: {app.job_detail?.deadline}</span>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                Applied on: {new Date(app.applied_at).toLocaleDateString()}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
