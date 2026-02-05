import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { RoleProvider } from '@/contexts/RoleContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { SearchProvider } from '@/contexts/SearchContext.jsx'; 
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { Loader2 } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Critical Core Components
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import ProtectedLicenseRoute from '@/components/ProtectedLicenseRoute';

// Lazy Load Pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UniversityOnboardingPage = lazy(() => import('@/pages/UniversityOnboardingPage'));
const PasswordResetPage = lazy(() => import('@/pages/PasswordResetPage')); 
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage')); 
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminAnalyticsPage = lazy(() => import('@/pages/AdminAnalyticsPage'));
const AdminCompliancePage = lazy(() => import('@/pages/AdminCompliancePage'));
const AdminComplianceReportsPage = lazy(() => import('@/pages/AdminComplianceReportsPage'));
const EmailTestPage = lazy(() => import('@/pages/EmailTestPage')); 
const AddUserPage = lazy(() => import('@/pages/AddUserPage'));
const ImportHistoryPage = lazy(() => import('@/pages/ImportHistoryPage'));
const ScheduledImportPage = lazy(() => import('@/pages/ScheduledImportPage'));
const AdminCoursesPage = lazy(() => import('@/pages/AdminCoursesPage'));
const CourseManagementPage = lazy(() => import('@/pages/CourseManagementPage'));
const AdminDepartmentMappingPage = lazy(() => import('@/pages/AdminDepartmentMappingPage')); // New Page

// Student Pages
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));

// Quiz Pages
const QuizTakingPage = lazy(() => import('@/pages/QuizTakingPage'));
const QuizResultsPage = lazy(() => import('@/pages/QuizResultsPage'));
const QuizReviewPage = lazy(() => import('@/pages/QuizReviewPage'));

// New Pages for Phase 4
const CertificatesPage = lazy(() => import('@/pages/CertificatesPage'));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const LicenseExpiredPage = lazy(() => import('@/pages/LicenseExpiredPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Drilling Modules
const CasingDesignPage = lazy(() => import('@/pages/modules/drilling/CasingDesignPage'));
const CasingDesignDetail = lazy(() => import('@/pages/modules/drilling/CasingDesignDetail'));
const TorqueDragPage = lazy(() => import('@/pages/apps/TorqueDragPage')); 
const HydraulicsSimulatorPage = lazy(() => import('@/pages/modules/drilling/HydraulicsSimulatorPage')); 

// Production Modules
const ProductionPage = lazy(() => import('@/pages/modules/ProductionPage'));
const NodalAnalysisApp = lazy(() => import('@/pages/production/nodal-analysis/NodalAnalysisApp'));
const PressureTransientAnalysisPage = lazy(() => import('@/pages/production/pressure-transient/PressureTransientAnalysisPage'));
const ArtificialLiftPage = lazy(() => import('@/pages/modules/production/artificial-lift/ArtificialLiftPage'));
const NetworkOptimizationPage = lazy(() => import('@/pages/production/network-optimization/NetworkOptimizationPage'));

// Economics Modules
const IRRAnalysisPage = lazy(() => import('@/pages/economics/irr-analysis/IRRAnalysisPage'));
const RiskAnalysisPage = lazy(() => import('@/pages/economics/risk-analysis/RiskAnalysisPage'));

// Facilities Module
const FacilitiesPage = lazy(() => import('@/pages/modules/FacilitiesPage'));
const FacilityMasterPlannerStudio = lazy(() => import('@/pages/modules/facilities/FacilityMasterPlannerStudio'));
const FacilityLayoutDesignerPage = lazy(() => import('@/pages/modules/facilities/FacilityLayoutDesignerPage'));
const PipelineSizerPage = lazy(() => import('@/dashboard/modules/facilities/pipeline-sizer/PipelineSizerPage')); 
const EquipmentRegister = lazy(() => import('@/modules/facilities/facility-layout-designer/components/EquipmentRegister'));
const LineList = lazy(() => import('@/modules/facilities/facility-layout-designer/components/LineList'));
const LayoutReport = lazy(() => import('@/modules/facilities/facility-layout-designer/components/LayoutReport'));

// Legal Pages
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const AcademicIntegrityPage = lazy(() => import('@/pages/AcademicIntegrityPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
  },
});

const AppLoading = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-bold tracking-tight">Petrolord Suite</h2>
            <p className="text-sm text-slate-400">Loading module architecture...</p>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
    const { user } = useAuth();

    return (
        <>
            <GlobalSearchModal />
            <Suspense fallback={<AppLoading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/university-onboarding" element={<UniversityOnboardingPage />} />
                <Route path="/onboarding" element={<Navigate to="/university-onboarding" replace />} />
                <Route path="/forgot-password" element={<PasswordResetPage />} /> 
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/test-email" element={<ProtectedRoute><EmailTestPage /></ProtectedRoute>} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/academic-integrity" element={<AcademicIntegrityPage />} />
                <Route path="/license-expired" element={<ProtectedRoute><LicenseExpiredPage /></ProtectedRoute>} />
                
                {/* Pages that use Layout must be wrapped in NotificationProvider because Layout contains NotificationBell */}
                <Route path="/search" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><SearchPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/dashboard/admin/add-users" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AddUserPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/admin/import-history" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><ImportHistoryPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/admin/scheduled-imports" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><ScheduledImportPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                
                {/* Admin Course Management Routes */}
                <Route path="/dashboard/admin/courses" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AdminCoursesPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/admin/courses/:id" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><CourseManagementPage /></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/admin/courses/new" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><CourseManagementPage /></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/admin/mappings" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AdminDepartmentMappingPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />

                {/* Student Learning Routes */}
                <Route path="/courses" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><CoursesPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/courses/:courseId" element={<ProtectedRoute><NotificationProvider><CourseDetailPage /></NotificationProvider></ProtectedRoute>} />
                <Route path="/courses/:courseId/lessons/:lessonId/quiz" element={<ProtectedRoute><NotificationProvider><QuizTakingPage /></NotificationProvider></ProtectedRoute>} />
                <Route path="/courses/:courseId/quiz/:attemptId/results" element={<ProtectedRoute><NotificationProvider><QuizResultsPage /></NotificationProvider></ProtectedRoute>} />
                <Route path="/courses/:courseId/quiz/:attemptId/review" element={<ProtectedRoute><NotificationProvider><QuizReviewPage /></NotificationProvider></ProtectedRoute>} />

                {/* --- MODULES (Protected by License) --- */}
                <Route path="/dashboard/modules/drilling/casing-design" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><CasingDesignPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/drilling/casing-design/:id" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><CasingDesignDetail /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/drilling/torque-drag" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><TorqueDragPage /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/drilling/hydraulics-simulator" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><HydraulicsSimulatorPage /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                
                <Route path="/dashboard/modules/production" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><ProductionPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/production/nodal-analysis" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><NodalAnalysisApp /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/production/pressure-transient-analysis" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><PressureTransientAnalysisPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/production/ald" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ArtificialLiftPage /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/production/network-optimization" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><NetworkOptimizationPage /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                
                <Route path="/dashboard/modules/economics/irr-analysis" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><IRRAnalysisPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/economics/risk-analysis" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><RiskAnalysisPage /></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                
                <Route path="/dashboard/modules/facilities" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><FacilitiesPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/facilities/facility-master-planner" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><FacilityMasterPlannerStudio /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/facilities/layout-designer" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><FacilityLayoutDesignerPage /></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/dashboard/modules/facilities/pipeline-sizer" element={<ProtectedRoute><ProtectedLicenseRoute userId={user?.id} fallbackPath="/license-expired"><NotificationProvider><ApplicationLayoutProvider><Layout><PipelineSizerPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedLicenseRoute></ProtectedRoute>} />
                <Route path="/pipeline-sizer" element={<Navigate to="/dashboard/modules/facilities/pipeline-sizer" replace />} />
                
                <Route path="/dashboard/modules/facilities/layout-designer/equipment-register" element={<ProtectedRoute><EquipmentRegister /></ProtectedRoute>} />
                <Route path="/dashboard/modules/facilities/layout-designer/line-list" element={<ProtectedRoute><LineList /></ProtectedRoute>} />
                <Route path="/dashboard/modules/facilities/layout-designer/layout-report" element={<ProtectedRoute><LayoutReport /></ProtectedRoute>} />
                
                <Route path="/dashboard/settings" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><SettingsPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/analytics" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AdminAnalyticsPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/compliance" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AdminCompliancePage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/reports" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AdminComplianceReportsPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                
                {/* Student Gamification Pages */}
                <Route path="/dashboard/certificates" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><CertificatesPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/achievements" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><AchievementsPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="/dashboard/leaderboard" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><LeaderboardPage /></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />

                <Route path="/dashboard/*" element={<ProtectedRoute><NotificationProvider><ApplicationLayoutProvider><Layout><ErrorBoundary><DashboardPage /></ErrorBoundary></Layout></ApplicationLayoutProvider></NotificationProvider></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
        </>
    );
};

function App() {
  return (
    <>
      <Helmet><title>Petrolord NextGen Suite</title><meta name="description" content="Digital Operating System for Energy Enterprise" /></Helmet>
      <RoleProvider><SearchProvider><AppContent /></SearchProvider></RoleProvider><Toaster />
    </>
  );
}

const AppWrapper = () => (
  <HelmetProvider><ErrorBoundary><QueryClientProvider client={queryClient}><Router><AuthProvider><App /></AuthProvider></Router></QueryClientProvider></ErrorBoundary></HelmetProvider>
);

export default AppWrapper;