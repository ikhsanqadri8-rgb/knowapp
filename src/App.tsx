import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PrivacyPolicyModal } from './components/common/PrivacyPolicyModal';
import { ForgotPasswordModal } from './components/common/ForgotPasswordModal';
import { LandingPage } from './components/public/LandingPage';
import { AboutPage } from './components/public/AboutPage';
import { ContentPacksView } from './components/public/ContentPacksView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ClassesView } from './components/teacher/ClassesView';
import { ClassDetailView } from './components/teacher/ClassDetailView';
import { SessionDetailView } from './components/teacher/SessionDetailView';
import { StudentProfileView } from './components/teacher/StudentProfileView';
import { ReportsExportView } from './components/teacher/ReportsExportView';
import { StudentMissionsHub } from './components/student/StudentMissionsHub';
import { MissionRunner } from './components/student/MissionRunner';
import { StudentProgressView } from './components/student/StudentProgressView';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeMissionRunner, setActiveMissionRunner] = useState<{ sessionId: string; missionId: string } | null>(null);

  // Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);

  // Navigation controller with role guard
  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    navigateTo('class-detail');
  };

  const handleOpenSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    navigateTo('session-detail');
  };

  const handleOpenStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    navigateTo('student-profile');
  };

  const handleStartMission = (sessionId: string, missionId: string) => {
    setActiveMissionRunner({ sessionId, missionId });
    navigateTo('mission-runner');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Public Views */}
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={navigateTo}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentView === 'content-packs' && (
          <ContentPacksView />
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigate={navigateTo}
            onOpenForgotPassword={() => setIsForgotPassOpen(true)}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onNavigate={navigateTo}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {/* Teacher Views */}
        {currentView === 'teacher-dashboard' && (
          <TeacherDashboard
            onNavigate={navigateTo}
            onSelectClass={handleSelectClass}
            onOpenSession={handleOpenSession}
          />
        )}

        {currentView === 'teacher-classes' && (
          <ClassesView
            onSelectClass={handleSelectClass}
          />
        )}

        {currentView === 'class-detail' && selectedClassId && (
          <ClassDetailView
            classId={selectedClassId}
            onBack={() => navigateTo('teacher-classes')}
            onOpenSession={handleOpenSession}
            onOpenStudentProfile={handleOpenStudentProfile}
          />
        )}

        {currentView === 'session-detail' && selectedSessionId && (
          <SessionDetailView
            sessionId={selectedSessionId}
            onBack={() => selectedClassId ? navigateTo('class-detail') : navigateTo('teacher-classes')}
            onOpenStudentProfile={handleOpenStudentProfile}
          />
        )}

        {currentView === 'student-profile' && selectedStudentId && (
          <StudentProfileView
            studentId={selectedStudentId}
            classId={selectedClassId || undefined}
            onBack={() => selectedSessionId ? navigateTo('session-detail') : navigateTo('teacher-classes')}
          />
        )}

        {currentView === 'reports-export' && (
          <ReportsExportView />
        )}

        {/* Student Views */}
        {currentView === 'student-hub' && (
          <StudentMissionsHub
            onStartMission={handleStartMission}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'mission-runner' && activeMissionRunner && (
          <MissionRunner
            sessionId={activeMissionRunner.sessionId}
            missionId={activeMissionRunner.missionId}
            onFinish={() => navigateTo('student-hub')}
            onBack={() => navigateTo('student-hub')}
          />
        )}

        {currentView === 'student-progress' && (
          <StudentProgressView
            onBack={() => navigateTo('student-hub')}
            onNavigate={navigateTo}
          />
        )}
      </main>

      <Footer
        onNavigate={navigateTo}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Global Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
