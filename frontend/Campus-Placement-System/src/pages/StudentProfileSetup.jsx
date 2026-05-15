import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function StudentProfileSetup() {
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    cgpa: "",
    student_id: "",
  });
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/users/student-profile/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/student/dashboard");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.values(errors).flat().join(", ");
        setError(messages);
      } else {
        setError("Failed to save profile");
      }
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <p>You need to complete your profile before viewing jobs.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Faculty</label>
          <input
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            placeholder="e.g. BCSIT"
          />
        </div>
        <div>
          <label>Semester</label>
          <input
            name="semester"
            type="number"
            value={formData.semester}
            onChange={handleChange}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <label>CGPA</label>
          <input
            name="cgpa"
            type="number"
            step="0.01"
            value={formData.cgpa}
            onChange={handleChange}
            placeholder="e.g. 3.50"
          />
        </div>
        <div>
          <label>Student ID</label>
          <input
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="e.g. 2470249"
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default StudentProfileSetup;