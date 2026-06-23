import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function PlacementHistory() {
  const [placements, setPlacements] = useState([]);
  const { token, role } = useAuth();

  useEffect(() => {
    api.get("api/applications/placement-history/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setPlacements(res.data))
      .catch(() => setPlacements([]));
  }, [token]);

  const isAdmin = role === "admin";

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "All Placements" : "My Placement History"}
        subtitle={isAdmin ? "Overview of all placed students" : "Your placement records"}
      />

      {placements.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">No placement records yet.</p>
        </div>
      ) : (
        <div className="glass-strong overflow-hidden rounded-[28px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">
                <tr>
                  {isAdmin && <th className="py-3 px-4 text-left font-semibold text-white">Student</th>}
                  <th className="py-3 px-4 text-left font-semibold text-white">Job Title</th>
                  <th className="py-3 px-4 text-left font-semibold text-white">Company</th>
                  <th className="py-3 px-4 text-left font-semibold text-white">Date</th>
                  {isAdmin && <th className="py-3 px-4 text-left font-semibold text-white">Package</th>}
                </tr>
              </thead>
              <tbody>
                {placements.map((p, i) => (
                  <tr key={i} className={`border-b border-slate-100 transition hover:bg-white/80 ${i % 2 === 0 ? "bg-white/60" : "bg-slate-50/60"}`}>
                    {isAdmin && <td className="py-3 px-4 font-semibold text-[var(--primary)]">{p.student_name || p.student}</td>}
                    <td className="py-3 px-4 font-semibold text-[var(--primary)]">{p.job_title}</td>
                    <td className="py-3 px-4 text-slate-500">{p.company}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(p.placement_date || p.updated_at).toLocaleDateString()}</td>
                    {isAdmin && <td className="py-3 px-4 text-slate-500">{p.package || "N/A"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementHistory;
