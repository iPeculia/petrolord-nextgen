import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    PlayCircle, 
    Clock, 
    FileText, 
    CheckCircle2, 
    Lock,
    ChevronDown,
    ChevronUp,
    Download,
    BookOpen
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CoursePreview = ({ courseId, onClose }) => {
    const [course, setCourse] = useState(null);
    const [structure, setStructure] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const courseData = await courseService.getCourseById(courseId);
                const structureData = await courseService.getCourseStructure(courseId);
                
                // Sort
                const sorted = (structureData || []).sort((a, b) => a.module_order - b.module_order).map(m => ({
                    ...m,
                    lessons: (m.lessons || []).sort((a, b) => a.lesson_order - b.lesson_order)
                }));

                setCourse(courseData);
                setStructure(sorted);
                
                // Default expand first module
                if (sorted.length > 0) {
                    setExpandedModules({ [sorted[0].id]: true });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    if (isLoading) return <div className="fixed inset-0 z-50 bg-[#0F172A] flex items-center justify-center text-white">Loading Preview...</div>;
    if (!course) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#0F172A] overflow-y-auto animate-in fade-in duration-300">
            {/* Header / Navbar Placeholder */}
            <div className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <div className="bg-[#BFFF00] text-black text-xs font-bold px-2 py-0.5 rounded">PREVIEW MODE</div>
                     <div className="font-bold text-lg text-white truncate max-w-md">{course.title}</div>
                </div>
                <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:text-white">
                    Exit Preview
                </Button>
            </div>

            <div className="max-w-7xl mx-auto pb-20">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full overflow-hidden rounded-b-3xl mb-8 group">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#0F172A] to-purple-900/40 z-0" />
                     {course.course_thumbnail_url && (
                         <img src={course.course_thumbnail_url} alt="Course Banner" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                     )}
                     
                     <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                     <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
                     
                     <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
                        <Badge className="w-fit mb-4 bg-[#BFFF00] text-black hover:bg-[#a3d900] text-sm px-3 py-1">
                            {course.category || 'General'}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
                            {course.title}
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mb-8 line-clamp-3 drop-shadow-md">
                            {course.description}
                        </p>
                        <div className="flex items-center gap-6 text-slate-400">
                             <div className="flex items-center gap-2">
                                 <Clock className="w-5 h-5 text-[#BFFF00]" />
                                 <span>{course.duration_weeks || 10} Weeks</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Badge variant="outline" className="border-slate-600 text-slate-300">{course.difficulty_level || 'Intermediate'}</Badge>
                             </div>
                             {course.has_certificate && (
                                 <div className="flex items-center gap-2 text-[#BFFF00]">
                                     <CheckCircle2 className="w-5 h-5" />
                                     <span>Certificate Included</span>
                                 </div>
                             )}
                        </div>
                     </div>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: Course Content */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Course Content</h3>
                            <span className="text-sm text-slate-400">{structure.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons</span>
                        </div>
                        <ScrollArea className="h-[calc(100vh-600px)] min-h-[500px] lg:h-auto pr-4">
                            <div className="space-y-3">
                                {structure.map((module, index) => (
                                    <div key={module.id} className="border border-slate-800 rounded-lg overflow-hidden bg-[#1E293B]">
                                        <button 
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between p-4 bg-[#1E293B] hover:bg-slate-800/80 transition-colors text-left"
                                        >
                                            <div className="flex-1">
                                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Module {index + 1}</div>
                                                <div className="font-semibold text-slate-200">{module.title}</div>
                                            </div>
                                            {expandedModules[module.id] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                        </button>
                                        <AnimatePresence>
                                            {expandedModules[module.id] && (
                                                <motion.div 
                                                    initial={{ height: 0 }} 
                                                    animate={{ height: "auto" }} 
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden bg-[#0F172A]"
                                                >
                                                    <div className="p-2 space-y-1">
                                                        {module.lessons.map((lesson) => (
                                                            <button
                                                                key={lesson.id}
                                                                onClick={() => setActiveLesson(lesson)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 p-3 rounded-md transition-all text-left group",
                                                                    activeLesson?.id === lesson.id 
                                                                        ? "bg-[#BFFF00]/10 border border-[#BFFF00]/20" 
                                                                        : "hover:bg-slate-800 border border-transparent"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                                    activeLesson?.id === lesson.id ? "bg-[#BFFF00] text-black" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                                                                )}>
                                                                    {lesson.is_locked ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className={cn("text-sm font-medium truncate", activeLesson?.id === lesson.id ? "text-[#BFFF00]" : "text-slate-300")}>
                                                                        {lesson.title}
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {lesson.duration_minutes || 15} min</span>
                                                                        {!lesson.is_published && <span className="text-amber-500 px-1 border border-amber-500/30 rounded bg-amber-500/10">Draft</span>}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                         {activeLesson ? (
                             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                 <Card className="bg-[#1E293B] border-slate-800 overflow-hidden shadow-xl">
                                     {/* Video Placeholder */}
                                     <div className="aspect-video bg-black flex items-center justify-center relative group">
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                         <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-[#BFFF00] group-hover:scale-110 transition-all cursor-pointer z-10" />
                                         <div className="absolute bottom-4 left-4 right-4 z-10">
                                             <div className="text-white font-medium text-lg">{activeLesson.title}</div>
                                             <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                                                 <div className="w-0 h-full bg-[#BFFF00]" />
                                             </div>
                                         </div>
                                     </div>
                                     <CardContent className="p-6 space-y-6">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                 <h2 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h2>
                                                 <div className="flex gap-2 mb-4">
                                                     <Badge variant="outline" className="border-slate-600 text-slate-400">{activeLesson.lesson_type || 'Video'}</Badge>
                                                 </div>
                                                 <p className="text-slate-400 leading-relaxed">{activeLesson.description || "No description provided for this lesson."}</p>
                                             </div>
                                         </div>
                                         
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                                              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
                                                  <div className="flex items-center gap-3 mb-2">
                                                      <FileText className="w-5 h-5 text-[#BFFF00]" />
                                                      <h4 className="font-semibold text-slate-200">Lesson Notes</h4>
                                                  </div>
                                                  <p className="text-sm text-slate-500 group-hover:text-slate-400">View detailed transcript and study notes.</p>
                                              </div>
                                              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
                                                  <div className="flex items-center gap-3 mb-2">
                                                      <Download className="w-5 h-5 text-[#BFFF00]" />
                                                      <h4 className="font-semibold text-slate-200">Resources</h4>
                                                  </div>
                                                  <p className="text-sm text-slate-500 group-hover:text-slate-400">Download exercises and supplementary files.</p>
                                              </div>
                                         </div>
                                     </CardContent>
                                 </Card>
                             </div>
                         ) : (
                             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-[#1E293B] border border-slate-800 rounded-lg border-dashed">
                                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(191,255,0,0.2)]">
                                     <BookOpen className="w-8 h-8 text-[#BFFF00]" />
                                 </div>
                                 <h3 className="text-xl font-semibold text-white mb-2">Ready to Start Learning?</h3>
                                 <p className="text-slate-400 max-w-md">
                                     Select a lesson from the sidebar to begin previewing the course content.
                                 </p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;