import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import bicLogo from "../assets/BIC_Logo.png";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a PDF file");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    try {
      const res = await api.post("api/users/resume-upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(res.data);
    } catch (err) {
      setError("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f6fb" }}>

      {/* Top bar */}
      <div className="w-full py-2 px-6 flex items-center gap-6 text-white text-sm" style={{ backgroundColor: "#1a2f6e" }}>
        <span>📞 056-597077, 598892</span>
        <span>✉ info@bostoncollege.edu.np</span>
      </div>

      {/* Header */}
      <div className="w-full bg-white py-3 px-8 flex items-center justify-between shadow">
        <img src={bicLogo} alt="BIC" className="h-20 object-contain" />
        <div className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>BIC Campus Placement System</div>
      </div>

      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 shadow-lg flex flex-col py-8 px-4 gap-2" style={{ backgroundColor: "#1a2f6e" }}>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 px-2">Student Portal</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/student/applications")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📋 My Applications
          </button>
          <button
            onClick={() => navigate("/student/announcements")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            📢 Announcements
          </button>
          <button
            onClick={() => navigate("/student/edit-profile")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 text-sm hover:bg-white hover:text-blue-900 transition"
          >
            👤 Edit Profile
          </button>
          <button
            onClick={() => navigate("/student/resume-upload")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            📄 Upload Resume
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex items-start justify-center">
          <div className="bg-white rounded-2xl shadow w-full max-w-xl p-8">

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl mb-4" style={{ backgroundColor: "#1a2f6e" }}>
                📄
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>Upload Resume</h2>
              <p className="text-gray-500 text-sm mt-1">Upload your PDF resume — we'll extract your details automatically</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {!result ? (
              <form onSubmit={handleUpload} className="space-y-5">
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 transition"
                  onClick={() => document.getElementById("resume-input").click()}
                >
                  <p className="text-4xl mb-3">📎</p>
                  {file ? (
                    <p className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>{file.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm">Click to select your resume</p>
                      <p className="text-gray-400 text-xs mt-1">PDF files only</p>
                    </>
                  )}
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition"
                  style={{ backgroundColor: "#1a2f6e", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Uploading..." : "Upload Resume"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Resume uploaded successfully!
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold mb-3" style={{ color: "#1a2f6e" }}>Extracted Data</h3>
                  <div className="space-y-2 text-sm">
                    {result.extracted_data && Object.entries(result.extracted_data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key.replace("_", " ")}:</span>
                        <span className="font-semibold text-gray-700">{value || "Not found"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-500 text-xs text-center">{result.instructions}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/student/edit-profile")}
                    className="flex-1 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                    style={{ backgroundColor: "#1a2f6e" }}
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4">
        © 2026 Boston International College — Campus Placement System
      </div>
    </div>
  );
}

export default ResumeUpload;