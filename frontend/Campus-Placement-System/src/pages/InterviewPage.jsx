import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function InterviewPage() {
  const [interviews, setInterviews] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/interviews/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setInterviews(res.data));
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Interviews"
        subtitle="Track your scheduled and completed interviews"
      />

      {interviews.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">No interviews scheduled yet.</p>
          <p className="mt-1 text-sm text-slate-400">Keep applying to jobs to get interview calls!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {interviews.map((interview) => (
            <article key={interview.id} className="interactive-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{interview.job_title}</h3>
                  <p className="text-sm text-slate-500">{interview.company}</p>
                </div>
                <span className={`badge capitalize ${getStatusStyle(interview.status)}`}>
                  {interview.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50/80 p-3">
                  <p className="text-xs text-slate-400 mb-1">Date & Time</p>
                  <p className="font-semibold text-slate-700">
                    {new Date(interview.interview_date).toLocaleDateString()} at{" "}
                    {new Date(interview.interview_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50/80 p-3">
                  <p className="text-xs text-slate-400 mb-1">Mode</p>
                  <p className="font-semibold text-slate-700 capitalize">
                    {interview.mode === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              {interview.mode === "offline" && interview.location && (
                <div className="mt-3 rounded-2xl bg-blue-50/80 p-3 text-sm">
                  <p className="text-xs text-blue-400 mb-1">Location</p>
                  <p className="font-semibold text-blue-700">{interview.location}</p>
                </div>
              )}

              {interview.mode === "online" && interview.meeting_link && (
                <button
                  type="button"
                  onClick={() => window.open(interview.meeting_link, "_blank")}
                  className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-blue-50/80 p-3 text-left text-sm transition hover:bg-blue-100/80"
                >
                  <span className="font-semibold text-blue-700">Join Meeting</span>
                </button>
              )}

              {interview.instructions && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 mb-1">Instructions</p>
                  <p className="text-sm text-slate-600">{interview.instructions}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
