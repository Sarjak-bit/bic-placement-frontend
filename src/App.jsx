import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfileSetup from "./pages/StudentProfileSetup";
import AdminDashboard from "./pages/AdminDashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile"
import Announcements from "./pages/Announcements";
import PostAnnouncement from "./pages/PostAnnouncement";
import Analytics from "./pages/Analytics";
import ResumeUpload from "./pages/ResumeUpload";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfileSetup from "./pages/CompanyProfileSetup";
import AdminInterviews from "./pages/AdminInterviews";



function App() {
  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student/edit-profile" element={
          <ProtectedRoute allowedRole="student">
            <EditProfile />
          </ProtectedRoute>
        } />

        {/* Student only routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile-setup" element={
          <ProtectedRoute allowedRole="student">
            <StudentProfileSetup />
          </ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute allowedRole="student">
            <MyApplications />
          </ProtectedRoute>
        } />

        {/* Admin only routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/post-job" element={
          <ProtectedRoute allowedRole="admin">
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/student/announcements" element={
          <ProtectedRoute allowedRole="student">
            <Announcements />
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute allowedRole="admin">
            <PostAnnouncement />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRole="admin">
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/student/resume-upload" element={
          <ProtectedRoute allowedRole="student">
            <ResumeUpload />
          </ProtectedRoute>
        } />

        <Route path="/company/dashboard" element={
          <ProtectedRoute allowedRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/company/profile-setup" element={
          <ProtectedRoute allowedRole="company">
            <CompanyProfileSetup />
          </ProtectedRoute>
        } />

        import AdminInterviews from "./pages/AdminInterviews";

<Route path="/admin/interviews" element={
  <ProtectedRoute allowedRole="admin">
    <AdminInterviews />
  </ProtectedRoute>
} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;