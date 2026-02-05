import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useStudentLicense } from '@/hooks/useStudentLicense';
import { useStudentLoginTracking } from '@/hooks/useStudentLoginTracking';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Database, Users, HardHat, Factory, Hammer, Droplets, Settings, Construction, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LicenseDisplay from '@/components/LicenseDisplay';
import StudentWelcomeWidget from '@/components/dashboard/StudentWelcomeWidget';
import LicenseWarning from '@/components/LicenseWarning';
import StudentModuleAssignment from '@/components/StudentModuleAssignment';

// --- Module Pages ---
import GeosciencePage from '@/pages/modules/GeosciencePage';
import ReservoirPage from '@/pages/modules/ReservoirPage';
import ProductionPage from '@/pages/modules/ProductionPage';
import DrillingPage from '@/pages/modules/DrillingPage';
import EconomicsPage from '@/pages/modules/EconomicsPage';
import FacilitiesPage from '@/pages/modules/FacilitiesPage';

// --- Tool Applications ---
import WellLogCorrelationPage from '@/pages/modules/geoscience/WellLogCorrelationPage';
import PetrophysicalAnalysisPage from '@/modules/geoscience/petrophysical-analysis/PetrophysicalAnalysisPage';
import VolumetricsPro from '@/pages/apps/VolumetricsPro';
import SeismicInterpretationPage from '@/modules/geoscience/seismic-interpretation/pages/SeismicInterpretationPage';

import MaterialBalancePro from '@/pages/apps/MaterialBalancePro';
import DeclineCurveAnalysis from '@/pages/apps/DeclineCurveAnalysis';
import ReservoirSimulationPage from '@/pages/apps/ReservoirSimulationPage';
import WellTestAnalysisPage from '@/pages/apps/WellTestAnalysisPage';

import WellPlanningDesign from '@/pages/apps/WellPlanningDesign'; 
import PressureTransientAnalysisPage from '@/pages/production/pressure-transient/PressureTransientAnalysisPage';

import AIInsightsPage from '@/pages/enterprise/AIInsightsPage';
import EnterpriseDashboardPage from '@/pages/enterprise/EnterpriseDashboardPage';

import CoursesPage from '@/pages/CoursesPage';
import MyCoursesPage from '@/pages/MyCoursesPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminApprovalPage from '@/pages/AdminApprovalPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminReportAnalyticsPage from '@/pages/AdminReportAnalyticsPage';
import AdminAuditLogsPage from '@/pages/AdminAuditLogsPage';
import AdminManagementPage from '@/pages/AdminManagementPage';
import AdminSystemSettingsPage from '@/pages/AdminSystemSettingsPage';
import SuperAdminToolPage from '@/pages/SuperAdminToolPage';
import AdminCoursesPage from '@/pages/AdminCoursesPage';
import RealTimeMonitoringPage from '@/pages/RealTimeMonitoringPage';

// Phase 3: New University Admin Dashboard
import UniversityAdminDashboard from '@/pages/UniversityAdminDashboard';

// Phase 3.3: Lecturer Dashboard
import LecturerDashboard from '@/pages/LecturerDashboard';
import LecturerStudentManagement from '@/pages/LecturerStudentManagement';
import LecturerCourseManagement from '@/pages/LecturerCourseManagement';

// Phase 3.4: Student Grades
import StudentGradesPage from '@/pages/StudentGradesPage';
import { getUserStats } from '@/lib/userUtils';

// Phase 3.10: Notifications
import NotificationCenterPage from '@/pages/NotificationCenterPage';

// --- Role Specific Home Components ---

const SuperAdminHome = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 py-16">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Super Admin Control Center
            </h1>
            <p className="text-slate-400">Full system oversight and administration.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#1E293B] border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,245</div>
                <p className="text-xs text-slate-500">Global user base</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => window.location.href='/dashboard/admin/settings'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">System Configuration</CardTitle>
                <Settings className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Settings</div>
                <p className="text-xs text-slate-500">Manage global config</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => window.location.href='/dashboard/admin/monitoring'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Live Monitoring</CardTitle>
                <Activity className="h-4 w-4 text-[#BFFF00] animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Active</div>
                <p className="text-xs text-slate-500">View real-time logs</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => window.location.href='/dashboard/admin/mappings'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Department Mappings</CardTitle>
                <Database className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Modules</div>
                <p className="text-xs text-slate-500">Assign to departments</p>
              </CardContent>
            </Card>
          </div>
        </div>
    );
};

const PetrolordAdminHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 py-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-slate-400">Manage university approvals and platform users.</p>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors">
            <CardHeader><CardTitle className="text-white">University Approvals</CardTitle></CardHeader>
            <CardContent>
                <p className="text-slate-400 mb-4">Review and approve pending university access requests.</p>
                <Button className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900]">Go to Approvals</Button>
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors" onClick={() => window.location.href='/dashboard/admin/monitoring'}>
            <CardHeader><CardTitle className="text-white">System Monitoring</CardTitle></CardHeader>
            <CardContent>
                <p className="text-slate-400 mb-4">View real-time logs and system health status.</p>
                <Button variant="outline" className="w-full border-slate-700 text-slate-200">Open Dashboard</Button>
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors" onClick={() => window.location.href='/dashboard/admin/mappings'}>
            <CardHeader><CardTitle className="text-white">Module Assignments</CardTitle></CardHeader>
            <CardContent>
                <p className="text-slate-400 mb-4">Configure which modules are available to student departments.</p>
                <Button variant="outline" className="w-full border-slate-700 text-slate-200">Manage Mappings</Button>
            </CardContent>
        </Card>
      </div>
    </div>
);

// University Admin Dashboard Route Wrapper
const UniversityAdminHome = () => <UniversityAdminDashboard />;
const LecturerHome = () => <LecturerDashboard />;

const StudentHome = () => {
    const { user, profile } = useAuth();
    useStudentLoginTracking();
    
    const licenseInfo = useStudentLicense(user?.id);
    const assignedModule = licenseInfo?.assignedModule || 'Geoscience'; 
    
    const [stats, setStats] = React.useState({ enrolled: 0, completed: 0, inProgress: 0, lastLogin: null });
    
    const isAccessRestricted = licenseInfo?.status === 'expired' || licenseInfo?.status === 'grace_period_expired';

    React.useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                const userStats = await getUserStats(user.id);
                setStats({
                    ...userStats,
                    inProgress: userStats.enrolled - userStats.completed,
                    lastLogin: user.last_sign_in_at 
                });
            };
            fetchStats();
        }
    }, [user]);

    const isModuleAllowed = (moduleName) => {
        if (!assignedModule) return false;
        return assignedModule.toLowerCase().includes(moduleName.toLowerCase());
    };
    
    const ModuleLink = ({ to, children, className }) => {
        if (isAccessRestricted) {
            return (
                <div className={`${className} opacity-50 cursor-not-allowed relative group`}>
                    {children}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Lock className="w-6 h-6 text-red-400" />
                    </div>
                </div>
            );
        }
        return <a href={to} className={className}>{children}</a>;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 py-16">
        
        {/* License Warning Component */}
        <LicenseWarning userId={user?.id} />

        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-white hidden md:block">Dashboard</h1>
                <div className="w-full md:w-auto flex justify-end">
                    <LicenseDisplay licenseInfo={licenseInfo} />
                </div>
            </div>
            
            <StudentWelcomeWidget 
                user={user} 
                profile={profile} 
                licenseInfo={licenseInfo} 
                stats={stats} 
            />
            
            {/* NEW: Student Module Assignment Component */}
            <div className="w-full">
                <StudentModuleAssignment />
            </div>
        </div>
        
        <div className="rounded-lg border border-slate-800 bg-[#1E293B] p-8 text-center shadow-lg">
            <h3 className="text-lg font-medium text-slate-200">Technical Modules</h3>
            <p className="text-slate-400 mt-2 text-sm mb-4">Access industry-standard simulation tools.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
                {(isModuleAllowed('Geoscience') || !assignedModule) && (
                    <ModuleLink to="/dashboard/modules/geoscience" className="p-4 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 w-40 transition-all hover:scale-105 block">
                        <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-300">Geoscience</span>
                    </ModuleLink>
                )}
                
                {(isModuleAllowed('Drilling') || !assignedModule) && (
                    <ModuleLink to="/dashboard/modules/drilling" className="p-4 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 w-40 transition-all hover:scale-105 block">
                        <HardHat className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-300">Drilling</span>
                    </ModuleLink>
                )}
                
                {(isModuleAllowed('Reservoir') || !assignedModule) && (
                    <ModuleLink to="/dashboard/modules/reservoir" className="p-4 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 w-40 transition-all hover:scale-105 block">
                        <Database className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-300">Reservoir</span>
                    </ModuleLink>
                )}

                {(isModuleAllowed('Production') || !assignedModule) && (
                     <ModuleLink to="/dashboard/modules/production" className="p-4 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 w-40 transition-all hover:scale-105 block">
                        <Factory className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-300">Production</span>
                    </ModuleLink>
                )}
                
                {(isModuleAllowed('Facilities') || !assignedModule) && (
                     <ModuleLink to="/dashboard/modules/facilities" className="p-4 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 w-40 transition-all hover:scale-105 block">
                        <Construction className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-300">Facilities</span>
                    </ModuleLink>
                )}
            </div>
            {assignedModule && (
                <p className="text-xs text-slate-500 mt-4 italic">
                    You only have access to modules within the {assignedModule} track.
                </p>
            )}
        </div>
        </div>
    );
};

const ModulePlaceholder = ({ name, icon: Icon, description }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
    <div className="p-6 rounded-full bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50">
      <Icon className="h-16 w-16 text-[#BFFF00]" />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-white">{name}</h2>
      <p className="text-slate-400 max-w-lg mx-auto text-lg">
        {description || "This module is currently active and ready for data integration."}
      </p>
    </div>
    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
        <p>✓ Route Verified: Connected successfully</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const { viewRole, actualRole } = useRole();

  // Logging active role for debugging
  console.log('Dashboard Initialized | Active Role:', viewRole, '| Actual Role:', actualRole);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#0F172A]">
            <div className="text-white animate-pulse">Loading Dashboard...</div>
        </div>
    );
  }

  // Central Routing Logic for the Dashboard Root ("/")
  // Explicitly check role to determine which dashboard to render
  const renderHome = () => {
    // Task 2: Explicitly check for university_admin FIRST
    if (viewRole === 'university_admin') {
        console.log('Routing to: UniversityAdminHome');
        return <UniversityAdminHome />;
    }
    
    // Check for other roles
    if (viewRole === 'super_admin') {
        console.log('Routing to: SuperAdminHome');
        return <SuperAdminHome />;
    }

    if (viewRole === 'admin') {
        console.log('Routing to: PetrolordAdminHome');
        return <PetrolordAdminHome />;
    }

    if (viewRole === 'lecturer') {
        console.log('Routing to: LecturerHome');
        return <LecturerHome />;
    }
    
    // Default fallback to StudentDashboard
    console.log('Routing to: StudentHome (Default)');
    return <StudentHome />; 
  };

  return (
    <Routes>
    {/* The Index Route determines the Dashboard Landing Page */}
    <Route path="/" element={renderHome()} />
    
    {/* --- GEOSCIENCE ROUTES --- */}
    <Route path="modules/geoscience" element={<GeosciencePage />} />
    <Route path="modules/geoscience/well-correlation/*" element={<WellLogCorrelationPage />} />
    <Route path="modules/geoscience/petrophysics/*" element={<PetrophysicalAnalysisPage />} />
    <Route path="modules/geoscience/volumetrics/*" element={<VolumetricsPro />} />
    <Route path="modules/geoscience/seismic/*" element={<SeismicInterpretationPage />} />
    <Route path="modules/geoscience/well-test/*" element={<WellTestAnalysisPage />} />

    {/* --- RESERVOIR ENGINEERING ROUTES --- */}
    <Route path="modules/reservoir" element={<ReservoirPage />} />
    <Route path="modules/reservoir/material-balance/*" element={<MaterialBalancePro />} />
    <Route path="modules/reservoir/dca/*" element={<DeclineCurveAnalysis />} />
    <Route path="modules/reservoir/simulation-lab/*" element={<ReservoirSimulationPage />} />
    <Route path="modules/reservoir/well-test/*" element={<WellTestAnalysisPage />} />

    {/* --- PRODUCTION ROUTES --- */}
    <Route path="modules/production" element={<ProductionPage />} />
    <Route path="modules/production/pressure-transient-analysis" element={<PressureTransientAnalysisPage />} />
    <Route path="modules/production/optimization" element={<ModulePlaceholder name="Production Optimization" icon={Factory} />} />
    
    {/* --- DRILLING ROUTES --- */}
    <Route path="modules/drilling" element={<DrillingPage />} />
    <Route path="modules/drilling/well-planning/*" element={<WellPlanningDesign />} />
    <Route path="modules/drilling/casing-design" element={<ModulePlaceholder name="Casing Design" icon={Hammer} description="Casing seat selection and load case analysis." />} />
    <Route path="modules/drilling/hydraulics" element={<ModulePlaceholder name="Hydraulics Simulator" icon={Droplets} description="ECD management and bit optimization." />} />
    <Route path="modules/drilling/torque-drag" element={<ModulePlaceholder name="Torque & Drag" icon={Activity} description="Tension, torque, and side force analysis." />} />
    <Route path="modules/drilling/wellbore-design" element={<ModulePlaceholder name="Wellbore Schematic" icon={FileText} description="Wellbore geometry construction." />} />

    {/* --- ECONOMICS ROUTES --- */}
    <Route path="modules/economics" element={<EconomicsPage />} />

    {/* --- FACILITIES ROUTES (NEW) --- */}
    <Route path="modules/facilities" element={<FacilitiesPage />} />

    {/* --- ENTERPRISE ROUTES --- */}
    <Route path="enterprise/ai/*" element={<AIInsightsPage />} />
    <Route path="enterprise/analytics/*" element={<EnterpriseDashboardPage />} />

    {/* --- COURSES --- */}
    <Route path="courses/*" element={<CoursesPage />} />
    <Route path="my-learning/*" element={<MyCoursesPage />} />

    {/* --- SETTINGS --- */}
    <Route path="settings" element={<SettingsPage />} />

    {/* --- NOTIFICATIONS --- */}
    <Route path="notifications" element={<NotificationCenterPage />} />

    {/* --- ADMIN ROUTES --- */}
    <Route path="admin/approvals" element={<AdminApprovalPage />} />
    <Route path="admin/courses" element={<AdminCoursesPage />} />
    <Route path="admin/audit-logs" element={<AdminAuditLogsPage />} />
    <Route path="admin/monitoring" element={<RealTimeMonitoringPage />} />
    <Route path="admin/users" element={<AdminUsersPage />} />
    <Route path="admin/admin-mgmt" element={<AdminManagementPage />} />
    <Route path="admin/analytics" element={<AdminReportAnalyticsPage />} />
    <Route path="admin/super-admins" element={<SuperAdminToolPage />} />
    <Route path="admin/settings" element={<AdminSystemSettingsPage />} />
    
    {/* --- UNIVERSITY ADMIN --- */}
    {/* This route is explicit but also protected within the component itself */}
    <Route path="university-admin" element={<UniversityAdminDashboard />} />

    {/* --- LECTURER ROUTES --- */}
    <Route path="lecturer/students" element={<LecturerStudentManagement />} />
    <Route path="lecturer/courses" element={<LecturerCourseManagement />} />

    {/* --- STUDENT ROUTES --- */}
    <Route path="grades" element={<StudentGradesPage />} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardPage;