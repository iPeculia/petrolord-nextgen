import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
    BookOpen, 
    Zap, 
    Award, 
    Clock, 
    Flame, 
    Target,
    Download
} from 'lucide-react';
import StatsCard from '@/components/StudentDashboard/StatsCard';
import ProgressCard from '@/components/StudentDashboard/ProgressCard';
import RecentActivity from '@/components/StudentDashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import { certificateService } from '@/services/certificateService';
import { useToast } from '@/components/ui/use-toast';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    activeCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0,
    xp: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Course Progress
      const { data: progressData } = await supabase
        .from('student_course_progress')
        .select(`*, courses (id, title, description, category, total_lessons)`)
        .eq('user_id', user.id);

      // 2. Fetch Certificates
      const certs = await dashboardService.getStudentCertificates(user.id);
      setCertificates(certs);

      // 3. Fetch Stats
      const { data: analytics } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      const { data: streaks } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Process Data
      const activeCourses = progressData || [];
      const completed = activeCourses.filter(c => c.progress_percentage === 100).length;
      
      setCourses(activeCourses);
      setStats({
        activeCourses: activeCourses.length,
        completedCourses: certs.length, // Use cert count for accuracy
        totalHours: analytics?.total_study_time_minutes ? Math.round(analytics.total_study_time_minutes / 60) : 0,
        currentStreak: streaks?.current_streak || 0,
        xp: analytics?.total_xp || 0
      });

    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (cert) => {
      certificateService.generatePDF(
          cert, 
          profile.display_name, 
          cert.courses?.title, 
          cert.courses?.modules?.name
      );
      toast({
          title: "Certificate Downloaded",
          description: "Your PDF is ready.",
          className: "bg-emerald-600 text-white"
      });
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 py-12 md:py-16">
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
         <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                   Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{profile?.display_name || 'Learner'}</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl">
                   Track your progress, download certificates, and master your modules.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                   <Link to="/courses">
                      <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                         Browse Courses
                      </Button>
                   </Link>
                </div>
            </motion.div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
               title="Courses in Progress" 
               value={stats.activeCourses} 
               icon={BookOpen} 
               gradient="from-blue-500 to-indigo-600"
            />
            <StatsCard 
               title="Learning Streak" 
               value={`${stats.currentStreak} Days`} 
               icon={Flame} 
               gradient="from-orange-500 to-red-600"
            />
            <StatsCard 
               title="Total XP" 
               value={stats.xp.toLocaleString()} 
               icon={Zap} 
               gradient="from-yellow-400 to-orange-500"
            />
            <StatsCard 
               title="Certificates" 
               value={stats.completedCourses} 
               icon={Award} 
               gradient="from-emerald-500 to-green-600"
            />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Progress & Certs */}
         <div className="lg:col-span-2 space-y-8">
            {/* Active Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Target className="h-6 w-6 text-emerald-400" />
                        My Learning Path
                    </h2>
                    <Link to="/courses" className="text-sm text-emerald-400 hover:text-emerald-300">View All</Link>
                </div>

                <div className="grid gap-6">
                    {courses.length > 0 ? (
                        courses.slice(0, 3).map((course, i) => (
                            <ProgressCard key={course.course_id || i} course={course} />
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                            <p>You haven't started any courses yet.</p>
                            <Button variant="link" className="text-emerald-400">Explore Catalog</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Certificates Section */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                    <Award className="h-6 w-6 text-yellow-400" />
                    Earned Certificates
                </h2>
                
                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert) => (
                            <Card key={cert.id} className="bg-[#1E293B] border-slate-800 border-l-4 border-l-yellow-500">
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-white mb-1">{cert.courses?.title}</h3>
                                    <div className="text-xs text-slate-400 mb-3 flex gap-2">
                                        <span>Issued: {new Date(cert.issued_date).toLocaleDateString()}</span>
                                        <span>Score: {cert.final_grade}%</span>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="w-full border-slate-700 text-yellow-400 hover:text-yellow-300 hover:bg-slate-800"
                                        onClick={() => handleDownloadCertificate(cert)}
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-slate-900/50 p-6 text-center border border-slate-800">
                        <p className="text-slate-400">Complete courses with 80% or higher to earn certificates.</p>
                    </div>
                )}
            </div>
         </div>

         {/* Right Column: Activity */}
         <div className="space-y-8">
            <RecentActivity activities={[
                { id: 1, type: 'view', title: 'Accessed Dashboard', description: 'Just now', timestamp: new Date() },
                // Mock data can be replaced by real data from API if available
            ]} />
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;