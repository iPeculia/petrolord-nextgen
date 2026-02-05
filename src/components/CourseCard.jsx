import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    BookOpen, 
    CheckCircle, 
    PlayCircle, 
    Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CourseCard = ({ course, onClick }) => {
    
    const handleClick = () => {
        onClick(course.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card 
                className="group h-full border overflow-hidden flex flex-col relative rounded-xl transition-all duration-300 bg-[#1E293B] border-slate-800 hover:border-[#BFFF00]/50 hover:shadow-2xl hover:shadow-[#BFFF00]/5 cursor-pointer"
                onClick={handleClick}
            >
                {/* Thumbnail Area */}
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                    {course.course_thumbnail_url ? (
                        <img 
                            src={course.course_thumbnail_url} 
                            alt={course.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-slate-700" />
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {course.progress >= 100 && (
                            <Badge className="bg-emerald-500 text-white border-emerald-400">
                                <CheckCircle className="w-3 h-3 mr-1" /> Completed
                            </Badge>
                        )}
                        <Badge className={`
                            ${course.difficulty_level?.toLowerCase() === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                            ${course.difficulty_level?.toLowerCase() === 'intermediate' ? 'bg-amber-500/20 text-amber-400' : ''}
                            ${course.difficulty_level?.toLowerCase() === 'advanced' ? 'bg-red-500/20 text-red-400' : ''}
                        `}>
                            {course.difficulty_level || 'General'}
                        </Badge>
                    </div>
                </div>

                <CardContent className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-mono uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration_weeks || 4} Weeks</span>
                            <span>•</span>
                            <span>{course.total_lessons || 0} Lessons</span>
                        </div>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#BFFF00] transition-colors line-clamp-2 text-left">
                                        {course.title}
                                    </h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{course.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <p className="text-slate-400 text-sm line-clamp-3 mb-6 text-left">
                            {course.description}
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                        {course.isEnrolled && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className={course.progress >= 100 ? "text-[#BFFF00]" : "text-slate-300"}>
                                        {course.progress >= 100 ? "Completed" : "Progress"}
                                    </span>
                                    <span className="text-slate-400">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-1.5 bg-slate-800" indicatorClassName={course.progress >= 100 ? "bg-[#BFFF00]" : "bg-blue-500"} />
                            </div>
                        )}

                        <Button 
                            className={`w-full font-bold transition-transform group-hover:translate-y-[-2px]
                                ${course.isEnrolled 
                                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                                    : 'bg-[#BFFF00] hover:bg-[#a3d900] text-black'}
                            `}
                        >
                            {course.isEnrolled ? (
                                <>
                                    {course.progress >= 100 ? (
                                        <><Award className="w-4 h-4 mr-2" /> Review</>
                                    ) : (
                                        <><PlayCircle className="w-4 h-4 mr-2" /> Continue</>
                                    )}
                                </>
                            ) : (
                                <>Start Course</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CourseCard;