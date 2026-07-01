import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getMediaUrl } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function StudentFullProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    api.get("api/users/student-profile/", { headers }).then((res) => setProfile(res.data));
    api.get("api/users/profile/", { headers }).then((res) => setUser(res.data));
  }, [token]);

  if (!profile) {
    return <div className="empty-state text-slate-500">Loading profile...</div>;
  }

  const displayName = profile.full_name || user?.full_name || user?.username || "Student";
  const resumeUrl = profile.resume ? getMediaUrl(profile.resume) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-extrabold leading-tight text-slate-950">My Profile</h1>
          <p className="mt-2 max-w-2xl text-[0.95rem] text-slate-500">The profile companies and placement staff see while reviewing candidates.</p>
        </div>
        <button type="button" onClick={() => navigate("/student/edit-profile")} className="dashboard-toolbar dashboard-toolbar-primary self-start sm:self-auto">
          Edit Profile
        </button>
      </div>

      <section className="profile-hero-card">
        <div className="profile-cover" />
        <div className="profile-hero-body">
          <div className="profile-avatar">
            {profile.profile_picture ? (
              <img src={getMediaUrl(profile.profile_picture)} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">No Photo</div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Student Profile</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-950">{displayName}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{profile.bio || "No bio added yet."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-primary">{profile.faculty || "Faculty pending"}</span>
              <span className="badge bg-white/85 text-slate-700 ring-1 ring-slate-200">Semester {profile.semester || "-"}</span>
              {profile.cgpa && <span className="badge bg-emerald-50 text-emerald-700">GPA {profile.cgpa}</span>}
              {profile.student_id && <span className="badge bg-orange-50 text-orange-700">ID {profile.student_id}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        <article className="profile-content-card">
          <ProfileSection title="Education">
            <TimelineItem
              title={profile.faculty || "Faculty not set"}
              subtitle="Boston International College"
              meta={`Semester ${profile.semester || "-"}${profile.cgpa ? ` - GPA ${profile.cgpa}` : ""}`}
              body={profile.student_id ? `Student ID: ${profile.student_id}` : ""}
            />
          </ProfileSection>

          <ProfileSection title="Experience">
            {profile.experiences?.length ? (
              profile.experiences.map((exp) => (
              <TimelineItem
                key={exp.id}
                title={exp.title || exp.role}
                subtitle={exp.company}
                meta={`${exp.start_date || ""}${exp.end_date ? ` - ${exp.end_date}` : exp.is_current ? " - Present" : ""}`}
                body={exp.description}
              />
              ))
            ) : (
              <Empty text="No experience added yet." />
            )}
          </ProfileSection>

          <ProfileSection title="Projects">
            {profile.projects?.length ? (
              profile.projects.map((project) => (
                <TimelineItem
                  key={project.id}
                  title={project.title}
                  subtitle={project.technologies}
                  body={project.description}
                  links={[
                    { label: "GitHub", href: project.github_link },
                    { label: "Live", href: project.live_link },
                  ]}
                />
              ))
            ) : (
              <Empty text="No projects added yet." />
            )}
          </ProfileSection>
        </article>

        <article className="profile-content-card">
          <ProfileSection title="Skills">
            {profile.skills?.length ? (
              <div className="flex flex-wrap gap-2.5">
                {profile.skills.map((skill) => (
                  <span key={skill.id} className="badge badge-primary">{skill.name}</span>
                ))}
              </div>
            ) : (
              <Empty text="No skills added yet." />
            )}
          </ProfileSection>

          <ProfileSection title="Links">
            <div className="space-y-2">
              <ProfileLink label="GitHub" href={profile.github} />
              <ProfileLink label="LinkedIn" href={profile.linkedin} />
              <ProfileLink label="Portfolio" href={profile.portfolio} />
            </div>
          </ProfileSection>
        </article>
      </section>

      <section className="profile-resume-row">
        <div className="flex min-w-0 items-center gap-3">
          <span className="profile-resume-icon">▣</span>
          <span className="min-w-0">
            <span className="block text-sm font-extrabold text-slate-950">Resume</span>
            <span className="block truncate text-sm text-slate-500">{resumeUrl ? "Resume uploaded and ready for review." : "No resume uploaded yet."}</span>
          </span>
        </div>
        {resumeUrl ? (
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="dashboard-toolbar dashboard-toolbar-primary shrink-0">View Resume</a>
        ) : (
          <button type="button" onClick={() => navigate("/student/resume-upload")} className="dashboard-toolbar shrink-0">Manage Resume</button>
        )}
      </section>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section className="profile-section">
      <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

function TimelineItem({ title, subtitle, meta, body, links = [] }) {
  const visibleLinks = links.filter((link) => link.href);

  return (
    <div className="profile-timeline-item">
      <p className="font-extrabold text-slate-950">{title || "Untitled"}</p>
      {subtitle && <p className="text-sm font-semibold text-slate-500">{subtitle}</p>}
      {meta && <p className="mt-1 text-xs text-slate-400">{meta}</p>}
      {body && <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>}
      {visibleLinks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {visibleLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-sm font-bold text-[var(--primary)] hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileLink({ label, href }) {
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block text-sm font-bold text-[var(--primary)] hover:underline">
      {label}
    </a>
  ) : (
    <p className="text-sm text-slate-500">{label} not added</p>
  );
}

function Empty({ text }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

export default StudentFullProfile;
