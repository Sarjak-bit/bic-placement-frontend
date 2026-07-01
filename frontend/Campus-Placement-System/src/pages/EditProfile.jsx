import { useEffect, useState } from "react";
import api, { getMediaUrl } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const emptyProfile = {
  full_name: "",
  phone: "",
  bio: "",
  faculty: "",
  semester: "",
  cgpa: "",
  student_id: "",
  github: "",
  linkedin: "",
  portfolio: "",
};

function EditProfile() {
  const [accountData, setAccountData] = useState({ full_name: "", phone: "" });
  const [profileData, setProfileData] = useState(emptyProfile);
  const [profileExists, setProfileExists] = useState(true);
  const [skillForm, setSkillForm] = useState({ name: "", level: "intermediate" });
  const [experienceForm, setExperienceForm] = useState({ title: "", company: "", location: "", start_date: "", end_date: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get("api/users/profile/", { headers }).then((res) => {
      setAccountData({
        full_name: res.data.full_name || "",
        phone: res.data.phone || "",
      });
    });
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProfile = () => {
    api.get("api/users/student-profile/", { headers }).then((res) => {
      setProfileData({ ...emptyProfile, ...res.data });
      setProfileExists(true);
    }).catch((err) => {
      if (err.response?.status === 404) setProfileExists(false);
    });
  };

  const showError = (err, fallback) => {
    const data = err.response?.data;
    const message = data ? Object.values(data).flat().join(", ") : fallback;
    setError(message || fallback);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const profilePayload = {
      full_name: profileData.full_name || accountData.full_name,
      phone: profileData.phone || accountData.phone,
      bio: profileData.bio,
      faculty: profileData.faculty,
      semester: profileData.semester,
      cgpa: profileData.cgpa,
      student_id: profileData.student_id,
      github: profileData.github,
      linkedin: profileData.linkedin,
      portfolio: profileData.portfolio,
    };

    try {
      await api.patch("api/users/update-profile/", accountData, { headers });
      if (profileExists) {
        await api.patch("api/users/student-profile/", profilePayload, { headers });
      } else {
        await api.post("api/users/student-profile/", profilePayload, { headers });
      }
      setProfileExists(true);
      setSuccess("Profile updated successfully.");
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    setUploadingPhoto(true);
    setError("");
    try {
      await api.patch("api/users/student-profile/", formData, { headers });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to upload profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addSkill = async () => {
    if (!skillForm.name.trim()) return;
    setError("");
    try {
      await api.post("api/users/skills/", skillForm, { headers });
      setSkillForm({ name: "", level: "intermediate" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add skill.");
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`api/users/skills/${id}/`, { headers });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove skill.");
    }
  };

  const addExperience = async () => {
    if (!experienceForm.title.trim() || !experienceForm.company.trim() || !experienceForm.start_date) {
      setError("Experience title, company, and start date are required.");
      return;
    }
    try {
      await api.post("api/users/experiences/", experienceForm, { headers });
      setExperienceForm({ title: "", company: "", location: "", start_date: "", end_date: "", description: "" });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to add experience.");
    }
  };

  const deleteExperience = async (id) => {
    try {
      await api.delete(`api/users/experiences/${id}/`, { headers });
      fetchProfile();
    } catch (err) {
      showError(err, "Failed to remove experience.");
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        <button type="button" onClick={() => navigate("/student/profile")} className="btn btn-ghost">View Profile</button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
              {profileData.profile_picture ? (
                <img src={getMediaUrl(profileData.profile_picture)} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-slate-400">Photo</div>
              )}
          </div>
          <label className="max-w-sm flex-1">
            <span className="form-label">Profile Photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto || !profileExists} />
            {!profileExists && <span className="mt-2 block text-xs text-slate-500">Save profile details once before uploading a photo.</span>}
          </label>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="Full Name" value={accountData.full_name} onChange={(value) => {
            setAccountData({ ...accountData, full_name: value });
            setProfileData({ ...profileData, full_name: value });
          }} />
          <Input label="Phone Number" value={accountData.phone} onChange={(value) => {
            setAccountData({ ...accountData, phone: value });
            setProfileData({ ...profileData, phone: value });
          }} />
          <Input label="Faculty" value={profileData.faculty} onChange={(value) => setProfileData({ ...profileData, faculty: value })} />
          <Input label="Semester" type="number" value={profileData.semester} onChange={(value) => setProfileData({ ...profileData, semester: value })} />
          <Input label="GPA" type="number" step="0.01" value={profileData.cgpa} onChange={(value) => setProfileData({ ...profileData, cgpa: value })} />
          <Input label="Student ID" value={profileData.student_id} onChange={(value) => setProfileData({ ...profileData, student_id: value })} />
          <Input label="GitHub" value={profileData.github} onChange={(value) => setProfileData({ ...profileData, github: value })} />
          <Input label="LinkedIn" value={profileData.linkedin} onChange={(value) => setProfileData({ ...profileData, linkedin: value })} />
          <Input label="Portfolio" value={profileData.portfolio} onChange={(value) => setProfileData({ ...profileData, portfolio: value })} />
          <label className="md:col-span-2">
            <span className="form-label">Bio</span>
            <textarea rows={4} value={profileData.bio || ""} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Short professional summary" />
          </label>
        </div>
        <footer className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button type="button" onClick={() => navigate("/student/profile")} className="btn btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Saving..." : "Save Profile"}</button>
        </footer>
      </form>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Skills</h2>
          <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="Skill name" />
            <select value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <button type="button" onClick={addSkill} className="btn btn-primary">Add</button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {profileData.skills?.length ? profileData.skills.map((skill) => (
              <span key={skill.id} className="badge badge-primary gap-2">
                {skill.name}
                <button type="button" onClick={() => deleteSkill(skill.id)} className="font-bold">x</button>
              </span>
            )) : <p className="text-sm text-slate-500">No skills added yet.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Experience</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={experienceForm.title} onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })} placeholder="Title" />
            <input value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} placeholder="Company" />
            <input value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} placeholder="Location" />
            <input type="date" value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} />
            <input type="date" value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} />
            <button type="button" onClick={addExperience} className="btn btn-primary">Add Experience</button>
            <textarea className="md:col-span-2" rows={3} value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} placeholder="Description" />
          </div>
          <div className="mt-5 space-y-3">
            {profileData.experiences?.length ? profileData.experiences.map((exp) => (
              <article key={exp.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-4">
                <span>
                  <p className="font-bold text-slate-900">{exp.title}</p>
                  <p className="text-sm text-slate-500">{exp.company}</p>
                </span>
                <button type="button" onClick={() => deleteExperience(exp.id)} className="text-sm font-bold text-red-600">Remove</button>
              </article>
            )) : <p className="text-sm text-slate-500">No experience added yet.</p>}
          </div>
        </article>
      </section>
    </section>
  );
}

function Input({ label, value, onChange, type = "text", step }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} step={step} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default EditProfile;
