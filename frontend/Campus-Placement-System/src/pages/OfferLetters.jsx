import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function OfferLetters() {
  const [offers, setOffers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    api.get("api/applications/offer-letter/", {
  headers: { Authorization: `Bearer ${token}` },
}).then((res) => setOffers(res.data));
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer Letters"
        subtitle="Your job offers from selected applications"
      />

      {offers.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">No offer letters yet.</p>
          <p className="mt-1 text-sm text-slate-400">Offer letters appear here once you are selected for a job.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {offers.map((offer) => (
            <article key={offer.id} className="interactive-card">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{offer.job_title}</h3>
                  <p className="text-sm text-slate-500">{offer.company}</p>
                </div>
                <span className="badge bg-green-100 text-green-700">Selected</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="rounded-2xl bg-slate-50/80 p-3">
                  <p className="text-xs text-slate-400 mb-1">Issued On</p>
                  <p className="font-semibold text-slate-700">
                    {new Date(offer.issued_date).toLocaleDateString()}
                  </p>
                </div>
                {offer.joining_date && (
                  <div className="rounded-2xl bg-slate-50/80 p-3">
                    <p className="text-xs text-slate-400 mb-1">Joining Date</p>
                    <p className="font-semibold text-slate-700">
                      {new Date(offer.joining_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {offer.message && (
                <div className="rounded-2xl bg-blue-50/80 p-4 text-sm text-blue-800 mb-4">
                  <p className="text-xs text-blue-400 mb-1">Message</p>
                  {offer.message}
                </div>
              )}

              {offer.letter_file && (
                <button
                  type="button"
                  onClick={() => window.open(offer.letter_file, "_blank")}
                  className="btn btn-primary w-full"
                >
                  Download Offer Letter
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OfferLetters;
