import { useEffect, useState } from "react";
import api, { getMediaUrl } from "../api/axios";import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

function StudentFullProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({});
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", level: "beginner" });
  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({ company: "", role: "", start_date: "", end_date: "", description: "" });
  const [showProjForm, setShowProjForm] = useState(false);
  const [projForm, setProjForm] = useState({ title: "", description: "", link: "" });
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ title: "", issuer: "", date: "", link: "" });
  const [error, setError] = useState("");
  const [savingBasic, setSavingBasic] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const { token } = useAuth();

  const showError = (err, fallback) => {
    const data = err.response?.data;
    if (data) {
      const messages = typeof data === "string" ? data : Object.values(data).flat().join(", ");
      setError(messages || fallback);
    } else {
      setError(fallback);
    }
  };

  useEffect(() => {
    fetchProfile();
    api.get("api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data));
  }, []);

  const fetchProfile = () => {
    api.get("api/users/student-profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setProfile(res.data);
      setBasicForm(res.data);
    });
  };

  const BASIC_FIELDS = ["bio", "location", "phone", "github_url", "linkedin_url", "portfolio_url"];

  const handleBasicSave = async () => {
    // Only send the fields actually editable in this form. basicForm is
    // seeded from the full profile fetch, so it also carries read-only/derived
    // fields (profile_picture, skills, experiences, etc.) that must not be
    // sent back as plain JSON — profile_picture in particular is a file field
    // and has its own multipart upload handler below.
    const payload = {};
    BASIC_FIELDS.forEach((field) => {
      payload[field] = basicForm[field] ?? "";
    });
    setError("");
    setSavingBasic(true);
    try {
      await api.patch("api/users/student-profile/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingBasic(false);
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to save profile changes.");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    setError("");
    setUploadingPicture(true);
    try {
      await api.patch("api/users/student-profile/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to upload profile picture.");
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleAddSkill = async () => {
    if (!skillForm.name.trim()) {
      setError("Skill name is required.");
      return;
    }
    setError("");
    try {
      await api.post("api/users/skills/", skillForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSkillForm(false);
      setSkillForm({ name: "", level: "beginner" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (id) => {
    setError("");
    try {
      await api.delete(`api/users/skills/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove skill.");
    }
  };

  const handleAddExp = async () => {
    if (!expForm.company.trim() || !expForm.role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setError("");
    try {
      await api.post("api/users/experiences/", expForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowExpForm(false);
      setExpForm({ company: "", role: "", start_date: "", end_date: "", description: "" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add experience.");
    }
  };

  const handleDeleteExp = async (id) => {
    setError("");
    try {
      await api.delete(`api/users/experiences/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove experience.");
    }
  };

  const handleAddProj = async () => {
    if (!projForm.title.trim()) {
      setError("Project title is required.");
      return;
    }
    setError("");
    try {
      await api.post("api/users/projects/", projForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowProjForm(false);
      setProjForm({ title: "", description: "", link: "" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add project.");
    }
  };

  const handleDeleteProj = async (id) => {
    setError("");
    try {
      await api.delete(`api/users/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove project.");
    }
  };

  const handleAddCert = async () => {
    if (!certForm.title.trim()) {
      setError("Certificate title is required.");
      return;
    }
    setError("");
    try {
      await api.post("api/users/certifications/", certForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCertForm(false);
      setCertForm({ title: "", issuer: "", date: "", link: "" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add certification.");
    }
  };

  const handleDeleteCert = async (id) => {
    setError("");
    try {
      await api.delete(`api/users/certifications/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove certification.");
    }
  };

  const levelColor = (level) => {
    switch (level) {
      case "beginner": return "bg-yellow-100 text-yellow-700";
      case "intermediate": return "bg-blue-100 text-blue-700";
      case "advanced": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (!profile) {
    return (
      <div className="empty-state">
        <div className="mx-auto mb-4 h-8 w-48 rounded-full loading-shimmer" />
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your professional profile and portfolio"
        actions={
          <button type="button" onClick={() => setEditingBasic(!editingBasic)} className="btn btn-primary">
            {editingBasic ? "Cancel" : "Edit Profile"}
          </button>
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

          <div className="glass-strong overflow-hidden rounded-[28px] mb-6">
            <div className="h-32 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]" />
            <div className="px-8 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-300 flex items-center justify-center">
                    {profile.profile_picture ? (
                     <img src={getMediaUrl(profile.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">No Photo</span>
                    )}
                  </div>
                  <label className={`absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ring-1 ring-slate-200 ${uploadingPicture ? "opacity-60" : "cursor-pointer"}`}>
                    <span className="block h-3 w-4 rounded-[2px] border-2 border-slate-500" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicture}
                      disabled={uploadingPicture}
                    />
                  </label>
                  {uploadingPicture && (
                    <p className="absolute -bottom-6 left-0 w-24 text-center text-[10px] font-semibold text-slate-500">Uploading...</p>
                  )}
                </div>
              </div>

              {editingBasic ? (
                <div className="grid grid-cols-2 gap-4">
                  {BASIC_FIELDS.map(field => (
                    <div key={field}>
                      <label className="text-xs font-semibold text-gray-500 uppercase">{field.replace("_url", "").replace("_", " ")}</label>
                      <input
                        value={basicForm[field] || ""}
                        onChange={e => setBasicForm({ ...basicForm, [field]: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <button onClick={handleBasicSave} disabled={savingBasic} className="px-6 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "#1a2f6e" }}>
                      {savingBasic ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1a2f6e" }}>{user?.full_name || user?.email}</h1>
                  {user?.full_name && <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>}
                  <p className="text-gray-500 text-sm mt-1">{profile.bio || "No bio yet"}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    {profile.location && <span>{profile.location}</span>}
                    {profile.phone && <span>{profile.phone}</span>}
                  </div>
                  <div className="flex gap-3 mt-3">
                    {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">GitHub</a>}
                    {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">LinkedIn</a>}
                    {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">Portfolio</a>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {profile.faculty && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{profile.faculty}</span>}
                    {profile.semester && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Semester {profile.semester}</span>}
                    {profile.cgpa && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">CGPA {profile.cgpa}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="interactive-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#1a2f6e" }}>Skills</h2>
              <button onClick={() => setShowSkillForm(!showSkillForm)} className="text-sm font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#1a2f6e" }}>+ Add</button>
            </div>
            {showSkillForm && (
              <div className="flex gap-3 mb-4">
                <input placeholder="Skill name" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <select value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button onClick={handleAddSkill} className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "#1a2f6e" }}>Save</button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length === 0 && <p className="text-gray-400 text-sm">No skills added yet.</p>}
              {profile.skills?.map(skill => (
                <div key={skill.id} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${levelColor(skill.level)}`}>
                  {skill.name}
                  <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-400 hover:text-red-600">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="interactive-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#1a2f6e" }}>Experience</h2>
              <button onClick={() => setShowExpForm(!showExpForm)} className="text-sm font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#1a2f6e" }}>+ Add</button>
            </div>
            {showExpForm && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input placeholder="Company" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input placeholder="Role" value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input type="date" value={expForm.start_date} onChange={e => setExpForm({ ...expForm, start_date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input type="date" value={expForm.end_date} onChange={e => setExpForm({ ...expForm, end_date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <textarea placeholder="Description" value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" rows={2} />
                <button onClick={handleAddExp} className="col-span-2 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "#1a2f6e" }}>Save</button>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {profile.experiences?.length === 0 && <p className="text-gray-400 text-sm">No experience added yet.</p>}
              {profile.experiences?.map(exp => (
                <div key={exp.id} className="border-l-4 pl-4" style={{ borderColor: "#1a2f6e" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: "#1a2f6e" }}>{exp.role}</p>
                      <p className="text-gray-500 text-sm">{exp.company}</p>
                      <p className="text-gray-400 text-xs">{exp.start_date} {exp.end_date || "Present"}</p>
                      <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                    </div>
                    <button onClick={() => handleDeleteExp(exp.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="interactive-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#1a2f6e" }}>Projects</h2>
              <button onClick={() => setShowProjForm(!showProjForm)} className="text-sm font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#1a2f6e" }}>+ Add</button>
            </div>
            {showProjForm && (
              <div className="flex flex-col gap-3 mb-4">
                <input placeholder="Project title" value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <textarea placeholder="Description" value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" rows={2} />
                <input placeholder="Project link (optional)" value={projForm.link} onChange={e => setProjForm({ ...projForm, link: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <button onClick={handleAddProj} className="py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "#1a2f6e" }}>Save</button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects?.length === 0 && <p className="text-gray-400 text-sm">No projects added yet.</p>}
              {profile.projects?.map(proj => (
                <div key={proj.id} className="border border-gray-100 rounded-xl p-4 hover:shadow transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: "#1a2f6e" }}>{proj.title}</p>
                      <p className="text-gray-500 text-sm mt-1">{proj.description}</p>
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline mt-1 block">View Project</a>}
                    </div>
                    <button onClick={() => handleDeleteProj(proj.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="interactive-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#1a2f6e" }}>Certifications</h2>
              <button onClick={() => setShowCertForm(!showCertForm)} className="text-sm font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#1a2f6e" }}>+ Add</button>
            </div>
            {showCertForm && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input placeholder="Certificate title" value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input placeholder="Issuer" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input type="date" value={certForm.date} onChange={e => setCertForm({ ...certForm, date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <input placeholder="Certificate link (optional)" value={certForm.link} onChange={e => setCertForm({ ...certForm, link: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <button onClick={handleAddCert} className="col-span-2 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "#1a2f6e" }}>Save</button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.certifications?.length === 0 && <p className="text-gray-400 text-sm">No certifications added yet.</p>}
              {profile.certifications?.map(cert => (
                <div key={cert.id} className="border border-gray-100 rounded-xl p-4 hover:shadow transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: "#1a2f6e" }}>{cert.title}</p>
                      <p className="text-gray-500 text-sm">{cert.issuer}</p>
                      <p className="text-gray-400 text-xs">{cert.date}</p>
                      {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline mt-1 block">View Certificate</a>}
                    </div>
                    <button onClick={() => handleDeleteCert(cert.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

    </div>
  );
}

export default StudentFullProfile;


