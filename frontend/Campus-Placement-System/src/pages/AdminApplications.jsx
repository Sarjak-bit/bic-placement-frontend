import { useEffect, useState } from "react";
import api, { getMediaUrl } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const { token } = useAuth();

  const fetchApplications = () => {
    setLoading(true);
    setError("");
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setApplications(list);
      setLoading(false);
    }).catch((err) => {
      setError(err.response?.data?.message || "Could not load applications.");
      setApplications([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const handleStatusUpdate = async (appId, status) => {
    setError("");
    try {
      await api.patch(`api/applications/${appId}/status/`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update application status.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700";
      case "shortlisted": return "bg-orange-100 text-orange-700";
      case "selected": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filtered = applications.filter((app) => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      app.student_name?.toLowerCase().includes(q) ||
      app.student_email?.toLowerCase().includes(q) ||
      app.job_detail?.title?.toLowerCase().includes(q) ||
      app.job_detail?.company?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon="Applications"
        title="Student Applications"
        subtitle="All applications submitted across every posted job"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Total", value: counts.total, color: "#1a2f6e" },
          { label: "Applied", value: counts.applied, color: "#2563eb" },
          { label: "Shortlisted", value: counts.shortlisted, color: "#e85d1e" },
          { label: "Selected", value: counts.selected, color: "#16a34a" },
          { label: "Rejected", value: counts.rejected, color: "#dc2626" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="interactive-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, job, or company"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 sm:max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            <option value="">All statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error ? (
          <div className="mt-6 alert alert-error">{error}</div>
        ) : loading ? (
          <div className="mt-6 empty-state">
            <p className="text-slate-500">Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 empty-state">
            <p className="text-slate-500">No applications match your filters.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Faculty</th>
                  <th className="px-3 py-3">CGPA</th>
                  <th className="px-3 py-3">Job</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Resume</th>
                  <th className="px-3 py-3">Cover Letter</th>
                  <th className="px-3 py-3">Applied</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900">{app.student_name}</p>
                      <p className="text-xs text-slate-500">{app.student_email}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{app.student_faculty || "—"}</td>
                    <td className="px-3 py-3 text-slate-600">{app.student_cgpa || "—"}</td>
                    <td className="px-3 py-3 text-slate-600">{app.job_detail?.title || "—"}</td>
                    <td className="px-3 py-3 text-slate-600">{app.job_detail?.company || "—"}</td>
                    <td className="px-3 py-3">
                      {app.student_resume ? (
                        <a href={getMediaUrl(app.student_resume)} target="_blank" rel="noreferrer" className="font-semibold text-[var(--primary)] hover:underline">View</a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="max-w-xs px-3 py-3 text-slate-600">
                      <p className="line-clamp-2">{app.cover_letter || "—"}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`badge capitalize ${getStatusStyle(app.status)}`}>{app.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className="min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;
