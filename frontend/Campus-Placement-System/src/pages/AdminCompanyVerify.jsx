import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function AdminCompanyVerify() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const { token } = useAuth();

  const fetchCompanies = () => {
    if (initialLoad) setLoading(true);
    api.get("api/users/companies/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCompanies(res.data);
        setError("");
      })
      .catch(() => setError("Failed to load companies."))
      .finally(() => {
        setLoading(false);
        setInitialLoad(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  const handleSetVerified = async (company, isVerified) => {
    if (!company.id) {
      setError(`${company.company_name} has not completed the company profile yet.`);
      return;
    }
    setActioningId(company.id);
    setError("");
    try {
      await api.patch(
        `api/users/company-verify/${company.id}/`,
        { is_verified: isVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanies();
    } catch {
      setError(`Failed to update verification status for ${company.company_name}.`);
    } finally {
      setActioningId(null);
    }
  };

  const pending = companies.filter((c) => !c.is_verified);
  const verified = companies.filter((c) => c.is_verified);

  const CompanyCard = ({ company }) => (
    <article className="interactive-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-[var(--primary)]">{company.company_name}</h3>
          <p className="text-sm text-slate-500">{company.email}</p>
        </div>
        <span className={`badge ${company.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {company.is_verified ? "Verified" : company.profile_complete === false ? "Profile incomplete" : "Pending"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-500 sm:grid-cols-2">
        {company.industry && <span>Industry: {company.industry}</span>}
        {company.location && <span>Location: {company.location}</span>}
      </div>

      {company.description && (
        <p className="mt-3 text-sm text-slate-600">{company.description}</p>
      )}

      {company.website && (
        <a href={company.website} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-blue-600 hover:underline">
          {company.website}
        </a>
      )}

      <div className="mt-4 flex gap-2">
        {company.profile_complete === false ? (
          <button type="button" disabled className="btn btn-ghost flex-1 py-2 text-xs">
            Awaiting Profile Setup
          </button>
        ) : company.is_verified ? (
          <button
            type="button"
            onClick={() => handleSetVerified(company, false)}
            disabled={actioningId === company.id}
            className="btn btn-danger flex-1 py-2 text-xs"
          >
            {actioningId === company.id ? "Updating..." : "Revoke Verification"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSetVerified(company, true)}
            disabled={actioningId === company.id}
            className="btn btn-primary flex-1 py-2 text-xs"
          >
            {actioningId === company.id ? "Updating..." : "Verify Company"}
          </button>
        )}
      </div>
    </article>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verify Companies"
        subtitle="Review and approve company accounts before they can post jobs"
      />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <p className="text-slate-500">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="empty-state">
          <p className="text-slate-500">No companies have registered yet.</p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
              Pending Verification <span className="badge bg-yellow-100 text-yellow-700">{pending.length}</span>
            </h2>
            {pending.length === 0 ? (
              <p className="text-sm text-slate-400">No companies awaiting verification.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pending.map((c) => (
                  <CompanyCard key={c.id || `company-user-${c.user_id}`} company={c} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
              Verified Companies <span className="badge bg-green-100 text-green-700">{verified.length}</span>
            </h2>
            {verified.length === 0 ? (
              <p className="text-sm text-slate-400">No companies verified yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {verified.map((c) => (
                  <CompanyCard key={c.id || `company-user-${c.user_id}`} company={c} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default AdminCompanyVerify;
