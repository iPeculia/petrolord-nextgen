import React from 'react';
import { RefreshCcw, History, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useCourseAttempts from '@/hooks/useCourseAttempts';

/**
 * StudentRetakeManager
 * Specialized component for managing retakes.
 */
const StudentRetakeManager = ({ courseId, onStartRetake }) => {
  const { 
    attempts, 
    remainingAttempts, 
    maxAttempts, 
    isPassed, 
    canRetake,
    loading 
  } = useCourseAttempts(courseId);

  if (loading) return null;

  return (
    <Card className="border-t-4 border-t-blue-500 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Attempts History
          </CardTitle>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {attempts.length} / {maxAttempts} Used
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Attempts List */}
          <div className="space-y-2">
            {attempts.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-2">No attempts recorded yet.</p>
            ) : (
              attempts.map((attempt) => (
                <div 
                  key={attempt.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Attempt #{attempt.attempt_number}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(attempt.attempt_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold">{attempt.score}%</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      attempt.passed 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {attempt.passed ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Area */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            {isPassed ? (
              <div className="flex items-center justify-center p-3 text-green-600 bg-green-50 dark:bg-green-900/10 rounded-lg text-sm font-medium">
                You have already passed this course!
              </div>
            ) : canRetake ? (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all group"
                onClick={onStartRetake}
              >
                <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Start Retake (Attempt {attempts.length + 1} of {maxAttempts})
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                No retakes remaining. Contact instructor.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentRetakeManager;