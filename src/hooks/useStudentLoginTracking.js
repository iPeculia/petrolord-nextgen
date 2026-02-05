import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useStudentLoginTracking = () => {
  const { user, profile } = useAuth();
  const logIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Only track if user is logged in and is a student
    if (!user || profile?.role !== 'student') return;

    const trackLogin = async () => {
      try {
        // 1. Get user's university ID
        const { data: memberData } = await supabase
          .from('university_members')
          .select('university_id')
          .eq('user_id', user.id)
          .single();

        const universityId = memberData?.university_id;
        const sessionId = crypto.randomUUID();

        // 2. Insert login log
        const { data, error } = await supabase
          .from('student_login_logs')
          .insert({
            student_id: user.id,
            university_id: universityId,
            login_time: new Date().toISOString(),
            ip_address: 'masked', // In a real app, you'd get this from edge function headers
            device_info: navigator.userAgent,
            session_id: sessionId
          })
          .select()
          .single();

        if (error) throw error;
        logIdRef.current = data.id;

        // 3. Log to audit logs (optional, but good for redundancy)
        // This is often handled by the AuthProvider, but specific student tracking is good here too.
        
      } catch (error) {
        console.error("Error tracking login:", error);
      }
    };

    trackLogin();

    // Cleanup function runs on unmount (logout or close)
    return () => {
      if (logIdRef.current) {
        const logoutTime = new Date().toISOString();
        supabase
          .from('student_login_logs')
          .update({ logout_time: logoutTime })
          .eq('id', logIdRef.current)
          .then(({ error }) => {
            if (error) console.error("Error tracking logout:", error);
          });
      }
    };
  }, [user, profile]);

  return {};
};