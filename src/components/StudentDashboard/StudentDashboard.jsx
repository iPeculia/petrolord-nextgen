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
    Layout
} from 'lucide-react';
import StatsCard from './StatsCard';
import ProgressCard from './ProgressCard';
import RecentActivity from './RecentActivity';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState([]);
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
      // Using student_course_progress preferentially, falling back to course_enrollments if empty for demo
      const { data: progressData, error: progressError } = await supabase
        .from('student_course_progress')
        .select(`
            *,
            courses (
                id,
                title,
                description,
                category,
                total_lessons
            )
        `)
        .eq('user_id', user.id);

      // 2. Fetch or Calculate Stats
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
        completedCourses: completed,
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
                   You're on a roll! Continue your learning journey and unlock new achievements today.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                   <Link to="/dashboard/courses">
                      <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                         Browse Courses
                      </Button>
                   </Link>
                   <Link to="/achievements">
                      <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                         View Achievements
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
         {/* Left Column: Progress */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-emerald-400" />
                  My Learning Path
               </h2>
               <Link to="/dashboard/courses" className="text-sm text-emerald-400 hover:text-emerald-300">View All</Link>
            </div>

            <div className="grid gap-6">
               {courses.length > 0 ? (
                  courses.map((course, i) => (
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

         {/* Right Column: Activity & Widgets */}
         <div className="space-y-8">
            <RecentActivity activities={[
                { id: 1, type: 'view', title: 'Accessed "Reservoir Basics"', description: 'Just now', timestamp: new Date() },
                { id: 2, type: 'completion', title: 'Completed Quiz: Drilling 101', description: 'Score: 95%', timestamp: new Date(Date.now() - 86400000) },
                { id: 3, type: 'achievement', title: 'Earned "Fast Learner"', description: 'Badge unlocked', timestamp: new Date(Date.now() - 172800000) }
            ]} />
            
            {/* Quick Link Widget */}
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 backdrop-blur-md">
               <h3 className="text-lg font-bold text-white mb-2">Leaderboard</h3>
               <p className="text-sm text-indigo-200 mb-4">See how you stack up against your peers.</p>
               <Link to="/leaderboard">
                  <Button className="w-full bg-white/10 hover:bg-white/20">View Rankings</Button>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;