import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all jobs
    api.get("api/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setJobs(res.data));

    // Fetch all applications
    api.get("api/applications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setApplications(res.data));
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.patch(`api/applications/${appId}/status/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh applications after update
      const res = await api.get("api/applications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
      alert("Status updated!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/admin/post-job")}>+ Post New Job</button>

      <h2>All Jobs ({jobs.length})</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Type:</strong> {job.job_type}</p>
            <p><strong>Deadline:</strong> {job.deadline}</p>
            <p><strong>Required Faculty:</strong> {job.required_faculty}</p>
            <p><strong>Required Semester:</strong> {job.required_semester}</p>
            <p><strong>Required CGPA:</strong> {job.required_cgpa}</p>
          </div>
        ))
      )}

      <h2>All Applications ({applications.length})</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map(app => (
          <div key={app.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <p><strong>Student:</strong> {app.student}</p>
            <p><strong>Job:</strong> {app.job}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Applied At:</strong> {app.applied_at}</p>
            <div>
              <button onClick={() => handleStatusUpdate(app.id, "shortlisted")}>Shortlist</button>
              <button onClick={() => handleStatusUpdate(app.id, "rejected")}>Reject</button>
              <button onClick={() => handleStatusUpdate(app.id, "selected")}>Select</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;