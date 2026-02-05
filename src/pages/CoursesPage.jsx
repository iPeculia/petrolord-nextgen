import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    Loader2, 
    BookOpen, 
    Search,
    Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import CourseCard from '@/components/CourseCard';

const CoursesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [assignedModule, setAssignedModule] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Get user's assigned module ID from profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('module_id, modules(name, id)')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setAssignedModule(profile.modules);

                // 2. Fetch courses belonging to this module
                let query = supabase
                    .from('courses')
                    .select(`
                        *,
                        enrollments:course_enrollments(status, progress_percentage)
                    `)
                    .eq('is_published', true);

                if (profile.module_id) {
                    query = query.eq('module_id', profile.module_id);
                }

                const { data: coursesData, error: coursesError } = await query;
                if (coursesError) throw coursesError;

                // Process data to flatten enrollment status
                const processedCourses = coursesData.map(course => {
                    const enrollment = course.enrollments && course.enrollments.length > 0 
                        ? course.enrollments[0] 
                        : null;
                    
                    return {
                        ...course,
                        isEnrolled: !!enrollment,
                        status: enrollment?.status || 'not_started',
                        progress: enrollment?.progress_percentage || 0
                    };
                });

                setCourses(processedCourses);

            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    const filteredCourses = courses.filter(course => {
        const matchesText = course.title.toLowerCase().includes(filterText.toLowerCase()) || 
                          course.description?.toLowerCase().includes(filterText.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level?.toLowerCase() === difficultyFilter.toLowerCase();
        return matchesText && matchesDifficulty;
    });

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-20">
            <Helmet>
                <title>My Courses | Petrolord NextGen</title>
            </Helmet>

            {/* Hero Section */}
            <div className="relative bg-[#0F172A] border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/grid-dark-1-M1t2.png')] opacity-20 bg-fixed"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="border-[#BFFF00]/50 text-[#BFFF00] bg-[#BFFF00]/10 px-3 py-1">
                                {assignedModule ? `${assignedModule.name} Module` : 'General Access'}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                            Your Learning Path
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            Access specialized courses tailored to your assigned module. 
                            Master concepts, track your progress, and earn certifications.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                            placeholder="Search courses..." 
                            className="pl-10 bg-[#1E293B] border-slate-700 text-white focus:border-[#BFFF00] focus:ring-[#BFFF00]/20"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger className="w-full md:w-[180px] bg-[#1E293B] border-slate-700 text-white">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin mb-4" />
                        <p className="text-slate-400">Loading your courses...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-[#1E293B]/30 rounded-2xl border border-slate-800 border-dashed">
                        <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">No courses found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                        {assignedModule && (
                             <p className="text-slate-600 text-sm mt-1">Currently viewing courses for: {assignedModule.name}</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredCourses.map((course, index) => (
                                <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onClick={handleCourseClick}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;