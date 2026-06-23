import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

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
    } catch {
      setError("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Resume"
        subtitle="Upload your PDF resume — we'll extract your details automatically"
      />

      <div className="mx-auto max-w-xl form-section">
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {!result ? (
          <form onSubmit={handleUpload} className="space-y-5">
            <button
              type="button"
              className="w-full rounded-[24px] border-2 border-dashed border-slate-200/80 bg-white/50 p-8 text-center transition hover:border-[var(--primary)] hover:bg-white/80"
              onClick={() => document.getElementById("resume-input").click()}
            >
              {file ? (
                <p className="text-sm font-semibold text-[var(--primary)]">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm text-slate-500">Click to select your resume</p>
                  <p className="mt-1 text-xs text-slate-400">PDF files only</p>
                </>
              )}
              <input id="resume-input" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </button>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="alert alert-success">Resume uploaded successfully!</div>

            <div className="rounded-[24px] bg-slate-50/80 p-4">
              <h3 className="font-bold mb-3 text-[var(--primary)]">Extracted Data</h3>
              <div className="space-y-2 text-sm">
                {result.extracted_data && Object.entries(result.extracted_data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <span className="text-slate-500 capitalize">{key.replace("_", " ")}:</span>
                    <span className="font-semibold text-slate-700">{value || "Not found"}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.instructions && (
              <p className="text-center text-xs text-slate-500">{result.instructions}</p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate("/student/edit-profile")} className="btn btn-primary flex-1">
                Update Profile
              </button>
              <button type="button" onClick={() => setResult(null)} className="btn btn-ghost flex-1">
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
