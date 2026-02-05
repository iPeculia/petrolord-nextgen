import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlayCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressCard = ({ course }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 shadow-xl backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
            {course.category || 'General'}
          </div>
          {course.progress_percentage === 100 && (
            <Award className="h-6 w-6 text-yellow-400" />
          )}
        </div>

        <h3 className="mt-4 text-xl font-bold text-white line-clamp-2">{course.courses?.title || 'Unknown Course'}</h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
          {course.courses?.description || 'No description available.'}
        </p>
      </div>

      <div className="relative z-10 mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Progress</span>
            <span>{course.progress_percentage}%</span>
          </div>
          <Progress value={course.progress_percentage} className="h-2 bg-slate-700" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>

        <Link to={`/dashboard/courses/${course.course_id}`}>
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-white/20">
            <PlayCircle className="mr-2 h-4 w-4" />
            {course.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
            </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProgressCard;