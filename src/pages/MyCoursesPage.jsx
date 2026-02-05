import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookOpen, CheckCircle, Award, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CertificateCard from '@/components/CertificateCard';

const MyCourseCard = ({ course, completion, certificate, profile }) => {
    const navigate = useNavigate();
    const issuedDate = certificate ? new Date(certificate.issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E293B] rounded-lg p-6 border border-gray-800 hover:border-[#BFFF00] transition-all duration-300 flex flex-col"
        >
            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow">{course.description.substring(0, 100)}...</p>
            <div className="flex items-center justify-between mt-auto">
                {completion ? (
                    <span className="text-green-500 flex items-center font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" /> Completed
                    </span>
                ) : (
                    <span className="text-blue-400 flex items-center font-semibold">
                        <BookOpen className="w-5 h-5 mr-2" /> In Progress
                    </span>
                )}
                <Button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] text-sm px-4 py-2"
                >
                    View Course <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
            {certificate && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center text-yellow-400 font-semibold text-sm mb-2">
                        <Award className="w-4 h-4 mr-2" /> Certificate Earned
                    </div>
                    <p className="text-gray-300 text-xs">Issued: {issuedDate}</p>
                    <p className="text-gray-300 text-xs">No: {certificate.certificate_number}</p>
                </div>
            )}
        </motion.div>
    );
};

const MyCoursesPage = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [myCertificates, setMyCertificates] = useState([]);

    const fetchMyCoursesAndCertificates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user?.id) {
                throw new Error('User not authenticated.');
            }

            // Fetch course completions
            const { data: completions, error: completionsError } = await supabase
                .from('course_completions')
                .select(`
                    *,
                    courses (id, title, description, certificate_program, phase_requirement, difficulty_level, duration_weeks, has_certificate, certificate_title)
                `)
                .eq('user_id', user.id);

            if (completionsError) throw completionsError;

            // Fetch certificates
            const { data: certificates, error: certificatesError } = await supabase
                .from('certificates')
                .select(`
                    *,
                    courses (id, title, description, certificate_program, phase_requirement, difficulty_level, duration_weeks, has_certificate, certificate_title)
                `)
                .eq('user_id', user.id);

            if (certificatesError) throw certificatesError;

            const coursesWithStatus = completions.map(comp => ({
                ...comp.courses,
                completion: comp,
                certificate: certificates.find(cert => cert.course_id === comp.course_id)
            }));

            setMyCourses(coursesWithStatus);
            setMyCertificates(certificates);

        } catch (e) {
            console.error('Error fetching my courses or certificates:', e);
            setError('Failed to load your courses or certificates.');
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setLoading(false);
        }
    }, [user?.id, toast]);

    useEffect(() => {
        fetchMyCoursesAndCertificates();
    }, [fetchMyCoursesAndCertificates]);

    const completedCourses = myCourses.filter(course => course.completion);
    // const inProgressCourses = myCourses.filter(course => !course.completion); // This would be for courses you've interacted with but not completed

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen-minus-header">
                <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-[#1E293B] rounded-lg border border-red-800">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-xl font-semibold text-white">Error loading your courses</h3>
                <p className="text-red-400 mt-2">{error}</p>
                <Button onClick={fetchMyCoursesAndCertificates} className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry
                </Button>
            </div>
        );
    }

    return (
        <>
            <Helmet><title>My Courses - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center"><BookOpen className="w-8 h-8 mr-4" />My Courses</h1>
                <p className="text-xl text-gray-400 mb-8">Track your learning journey and view your achievements.</p>

                <Tabs defaultValue="completed" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-slate-800">
                        <TabsTrigger value="completed">Completed Courses ({completedCourses.length})</TabsTrigger>
                        <TabsTrigger value="certificates">My Certificates ({myCertificates.length})</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress (0)</TabsTrigger> {/* Placeholder for future in-progress tracking */}
                    </TabsList>
                    <TabsContent value="completed" className="mt-6">
                        {completedCourses.length === 0 ? (
                            <div className="text-center py-10 bg-[#1E293B] rounded-lg">
                                <h3 className="text-xl font-semibold text-white">No completed courses yet!</h3>
                                <p className="text-gray-400 mt-2">Start a course to see your progress here.</p>
                                <Button onClick={() => navigate('/courses')} className="mt-4">
                                    <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedCourses.map(course => (
                                    <MyCourseCard key={course.id} course={course} completion={course.completion} certificate={course.certificate} profile={profile} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="certificates" className="mt-6">
                        {myCertificates.length === 0 ? (
                            <div className="text-center py-10 bg-[#1E293B] rounded-lg">
                                <h3 className="text-xl font-semibold text-white">No certificates earned yet!</h3>
                                <p className="text-gray-400 mt-2">Complete courses that offer certificates to see them here.</p>
                                <Button onClick={() => navigate('/courses')} className="mt-4">
                                    <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myCertificates.map(certificate => (
                                    <CertificateCard key={certificate.id} certificate={certificate} course={certificate.courses} profile={profile} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="in-progress" className="mt-6">
                        <div className="text-center py-10 bg-[#1E293B] rounded-lg">
                            <h3 className="text-xl font-semibold text-white">No courses currently in progress.</h3>
                            <p className="text-gray-400 mt-2">This section will show courses you've started but not yet completed.</p>
                            <Button onClick={() => navigate('/courses')} className="mt-4">
                                <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </>
    );
};

export default MyCoursesPage;