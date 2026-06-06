import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import Loader from './components/UI/Loader.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PressReleases from './pages/PressReleases.jsx';
import PressReleaseForm from './pages/PressReleaseForm.jsx';
import PublicNotices from './pages/PublicNotices.jsx';
import PublicNoticeForm from './pages/PublicNoticeForm.jsx';
import MediaGallery from './pages/MediaGallery.jsx';
import Announcements from './pages/Announcements.jsx';
import AnnouncementForm from './pages/AnnouncementForm.jsx';
import Contacts from './pages/Contacts.jsx';
import ContactForm from './pages/ContactForm.jsx';
import UserManagement from './pages/UserManagement.jsx';
import AIContentGenerator from './pages/AIContentGenerator.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

const ProtectedRoute = ({ children, adminOnly = false, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="press-releases" element={<PressReleases />} />
          <Route path="press-releases/new" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PressReleaseForm /></ProtectedRoute>} />
          <Route path="press-releases/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PressReleaseForm /></ProtectedRoute>} />
          <Route path="public-notices" element={<PublicNotices />} />
          <Route path="public-notices/new" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PublicNoticeForm /></ProtectedRoute>} />
          <Route path="public-notices/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PublicNoticeForm /></ProtectedRoute>} />
          <Route path="media" element={<MediaGallery />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="announcements/new" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AnnouncementForm /></ProtectedRoute>} />
          <Route path="announcements/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AnnouncementForm /></ProtectedRoute>} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactForm />} />
          <Route path="ai-generator" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AIContentGenerator /></ProtectedRoute>} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
