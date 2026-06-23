import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/announcements/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setAnnouncements(res.data));
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Latest updates from the placement office"
      />

      {announcements.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((ann) => (
            <article key={ann.id} className="interactive-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-[var(--primary)]">{ann.title}</h3>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{ann.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;
