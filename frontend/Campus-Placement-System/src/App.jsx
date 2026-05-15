import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfileSetup from "./pages/StudentProfileSetup";
import AdminDashboard from "./pages/AdminDashboard";
import PostJob from "./pages/PostJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile-setup" element={<StudentProfileSetup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/post-job" element={<PostJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;