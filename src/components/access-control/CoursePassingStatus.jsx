import React from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Lock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import useCourseAttempts from '@/hooks/useCourseAttempts';

/**
 * CoursePassingStatus
 * Displays detailed status about student's performance in a course.
 */
const CoursePassingStatus = ({ courseId, title, className }) => {
  const { 
    attempts, 
    bestScore, 
    isPassed, 
    maxAttempts, 
    remainingAttempts, 
    loading,
    canRetake 
  } = useCourseAttempts(courseId);

  if (loading) return <div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />;

  const statusColor = isPassed 
    ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
    : 'bg-gradient-to-r from-red-500 to-orange-600';

  const icon = isPassed ? <Trophy className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Status Card */}
      <div className={cn(
        "relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6 text-white",
        statusColor
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          {isPassed ? <Trophy size={120} /> : <AlertCircle size={120} />}
        </div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold opacity-90 mb-1">Course Status</h3>
            <div className="flex items-center gap-3 mb-4">
              {icon}
              <span className="text-3xl font-bold tracking-tight">
                {isPassed ? 'Passed' : 'Not Passed'}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium opacity-80">Best Score</div>
              <div className="text-2xl font-bold">{bestScore}%</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium opacity-80 mb-1">Attempts Remaining</div>
            <div className="text-2xl font-bold mb-4">{remainingAttempts} <span className="text-sm font-normal opacity-70">/ {maxAttempts}</span></div>
            
            {!isPassed && canRetake && (
              <Button 
                variant="secondary" 
                className="shadow-lg hover:scale-105 transition-transform font-bold"
                onClick={() => console.log('Navigate to quiz retake')}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Course
              </Button>
            )}
            
            {!isPassed && !canRetake && (
               <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium">
                 <Lock className="w-4 h-4" />
                 Max attempts reached
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Attempts History Grid */}
      {attempts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {attempts.map((attempt) => (
            <Card 
              key={attempt.id}
              className="p-4 border-l-4 hover:shadow-md transition-shadow duration-200"
              style={{ borderLeftColor: attempt.passed ? '#10b981' : '#ef4444' }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase text-gray-500">Attempt #{attempt.attempt_number}</span>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {attempt.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {attempt.score}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(attempt.attempt_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePassingStatus;