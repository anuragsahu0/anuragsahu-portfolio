import { useEffect } from 'react';
import {
  AdminShell,
  AdminLayout,
  AdminLoginPage,
  DashboardPage,
  AnalyticsPage,
  ProfilePage,
  AboutPage,
  ProjectsPage,
  SkillsPage,
  ExperiencePage,
  EducationPage,
  CertificatesPage,
  RoadmapPage,
  MediaPage,
  MessagesPage,
  SettingsPage,
  NotificationsPage,
  ActivityPage,
  useAdminAuth,
  useAdmin,
} from '@/admin';

/**
 * Inner Router that switches between views based on activeTab state.
 */
function AdminContent() {
  const { activeTab } = useAdmin();

  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'profile':
      return <ProfilePage />;
    case 'about':
      return <AboutPage />;
    case 'projects':
      return <ProjectsPage />;
    case 'skills':
      return <SkillsPage />;
    case 'experience':
      return <ExperiencePage />;
    case 'education':
      return <EducationPage />;
    case 'certificates':
      return <CertificatesPage />;
    case 'roadmap':
      return <RoadmapPage />;
    case 'media':
      return <MediaPage />;
    case 'messages':
      return <MessagesPage />;
    case 'settings':
      return <SettingsPage />;
    case 'notifications':
      return <NotificationsPage />;
    case 'activity':
      return <ActivityPage />;
    default:
      return <DashboardPage />;
  }
}

/**
 * ANURAG SAHU CONTROL CENTER
 * Clean, production-grade root Admin Page mounting the new SaaS architecture.
 */
export function AdminPage() {
  const { isAuthenticated, user, isLoading, error, login, logout } = useAdminAuth();

  useEffect(() => {
    document.title = 'Anurag Sahu — Control Center';
  }, []);

  if (!isAuthenticated) {
    return <AdminLoginPage onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <AdminShell user={user} onLogout={logout}>
      <AdminLayout>
        <AdminContent />
      </AdminLayout>
    </AdminShell>
  );
}

export default AdminPage;
