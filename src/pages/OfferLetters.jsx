import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function OfferLetters() {
  const [offers, setOffers] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("api/offer-letters/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setOffers(res.data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f6fb" }}>

      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

      <div className="w-full bg-white py-3 px-8 flex items-center justify-between shadow">
        <img src={bicLogo} alt="BIC" className="h-20 object-contain" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "#e85d1e" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1">

        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Student Portal</p>
          <button onClick={() => navigate("/student/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate("/student/applications")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📋 My Applications
          </button>
          <button onClick={() => navigate("/student/interviews")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            🎤 Interviews
          </button>
          <button onClick={() => navigate("/student/offer-letters")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            📜 Offer Letters
          </button>
          <button onClick={() => navigate("/student/announcements")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📢 Announcements
          </button>
          <button onClick={() => navigate("/student/resume-upload")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            📄 Upload Resume
          </button>
          <button onClick={() => navigate("/student/edit-profile")} className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition">
            👤 Edit Profile
          </button>
        </div>

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a2f6e" }}>Offer Letters</h1>
          <p className="text-gray-500 text-sm mb-6">Your job offers from selected applications</p>

          {offers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <p className="text-4xl mb-4">📜</p>
              <p className="text-gray-500">No offer letters yet.</p>
              <p className="text-gray-400 text-sm mt-1">Offer letters appear here once you are selected for a job.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#1a2f6e" }}>{offer.job_title}</h3>
                      <p className="text-gray-500 text-sm">{offer.company}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      ✅ Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Issued On</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(offer.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                    {offer.joining_date && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Joining Date</p>
                        <p className="font-semibold text-gray-700">
                          {new Date(offer.joining_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {offer.message && (
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 mb-4">
                      <p className="text-blue-400 text-xs mb-1">Message</p>
                      {offer.message}
                    </div>
                  )}

                  {offer.letter_file && (
                    <button
                      onClick={() => window.open(offer.letter_file, "_blank")}
                      className="w-full py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                      style={{ backgroundColor: "#1a2f6e" }}
                    >
                      📄 Download Offer Letter
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default OfferLetters;