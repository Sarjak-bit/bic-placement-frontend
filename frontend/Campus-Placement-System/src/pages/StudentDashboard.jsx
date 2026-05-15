import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info
    api.get("api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data));

    // Fetch eligible jobs
    api.get("api/jobs/", {
  headers: { Authorization: `Bearer ${token}` },
}).then(res => {
  setJobs(res.data);
}).catch(err => {
  if (err.response?.data?.message === "Please complete your profile first") {
    navigate("/student/profile-setup");
  }
});
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post("api/applications/", { job: jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {profile && (
        <div>
          <h2>Welcome, {profile.username}!</h2>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      )}

      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No eligible jobs available right now.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Type:</strong> {job.job_type}</p>
            <p><strong>Deadline:</strong> {job.deadline}</p>
            <p>{job.description}</p>
            <button onClick={() => handleApply(job.id)}>Apply</button>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentDashboard;