import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import StudentDashboard from "./pages/StudentDashboard";
import StudentJobs from "./pages/StudentJobs";
import JobDetails from "./pages/JobDetails";
import JobApplication from "./pages/JobApplication";
import StudentProfileSetup from "./pages/StudentProfileSetup";
import AdminDashboard from "./pages/AdminDashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import EditProfile from "./pages/EditProfile";
import Announcements from "./pages/Announcements";
import PostAnnouncement from "./pages/PostAnnouncement";
import Analytics from "./pages/Analytics";
import ResumeUpload from "./pages/ResumeUpload";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfileSetup from "./pages/CompanyProfileSetup";
import AdminInterviews from "./pages/AdminInterviews";
import InterviewPage from "./pages/InterviewPage";
import OfferLetters from "./pages/OfferLetters";
import StudentFullProfile from "./pages/StudentFullProfile";
import AdminAnalytics from "./pages/AdminAnalytics";
import CompanyPostJob from "./pages/CompanyPostJob";
import StudentAnalytics from "./pages/StudentAnalytics";
import PlacementHistory from "./pages/PlacementHistory";
import CompanyAnalytics from "./pages/CompanyAnalytics";
import AdminApplications from "./pages/AdminApplications";
import AdminCompanyVerify from "./pages/AdminCompanyVerify";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/verify-email/:uid/:token" element={<EmailVerification />} />

        <Route element={
          <ProtectedRoute allowedRole="student">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/jobs" element={<StudentJobs />} />
          <Route path="/student/jobs/:id" element={<JobDetails />} />
          <Route path="/student/jobs/:id/apply" element={<JobApplication />} />
          <Route path="/student/profile-setup" element={<StudentProfileSetup />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/announcements" element={<Announcements />} />
          <Route path="/student/interviews" element={<InterviewPage />} />
          <Route path="/student/offer-letters" element={<OfferLetters />} />
          <Route path="/student/profile" element={<StudentFullProfile />} />
          <Route path="/student/analytics" element={<StudentAnalytics />} />
          <Route path="/student/resume-upload" element={<ResumeUpload />} />
          <Route path="/student/placement" element={<PlacementHistory />} />
          <Route path="/student/edit-profile" element={<EditProfile />} />
        </Route>

        <Route element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/companies" element={<AdminCompanyVerify />} />
          <Route path="/admin/post-job" element={<PostJob />} />
          <Route path="/admin/announcements" element={<PostAnnouncement />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />
          <Route path="/admin/placements" element={<PlacementHistory />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        <Route element={
          <ProtectedRoute allowedRole="company">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/post-job" element={<CompanyPostJob />} />
          <Route path="/company/interviews" element={<AdminInterviews />} />
          <Route path="/company/profile-setup" element={<CompanyProfileSetup />} />
          <Route path="/company/analytics" element={<CompanyAnalytics />} />   
       </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
