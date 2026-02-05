import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { courseService } from '@/services/courseService';

export const useCourseProgress = (courseId) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courseStructure, setCourseStructure] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = useCallback(async () => {
    if (!user || !courseId) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Course Details via RPC
      const courseData = await courseService.getCourseDetails(courseId);
      if (!courseData) throw new Error("Course not found");
      setCourse(courseData);

      // 2. Fetch Structure via Service
      const structuredData = await courseService.getCourseStructure(courseId);
      setCourseStructure(structuredData);

      // 3. Fetch Progress
      const progressData = await courseService.getStudentProgress(user.id, courseId);
      
      const pMap = {};
      if (progressData) {
        progressData.forEach(p => {
            pMap[p.lesson_id] = p;
        });
      }
      setProgressMap(pMap);

    } catch (err) {
      console.error('Error fetching course progress:', err);
      setError(err.message);
      toast({
        title: "Error loading course",
        description: "Could not load course content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, courseId, toast]);

  // Mark lesson as complete via RPC
  const markLessonComplete = async (lessonId) => {
    if (!user) return;

    try {
        await courseService.markLessonComplete(user.id, lessonId);

        // Update local state immediately
        setProgressMap(prev => ({
            ...prev,
            [lessonId]: {
                lesson_id: lessonId,
                status: 'completed',
                is_completed: true,
                completed_at: new Date().toISOString()
            }
        }));

        toast({
            title: "Lesson Completed!",
            description: "Progress saved successfully.",
            className: "bg-emerald-600 text-white border-none"
        });
        
        return true;
    } catch (err) {
        console.error('Error marking lesson complete:', err);
        toast({
            title: "Action Failed",
            description: "Could not save progress.",
            variant: "destructive"
        });
        return false;
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  return {
    course,
    courseStructure,
    progressMap,
    loading,
    error,
    markLessonComplete,
    refetch: fetchCourseData
  };
};