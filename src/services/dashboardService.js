import { supabase } from '@/lib/customSupabaseClient';

export const dashboardService = {
  
  // --- Student Dashboard ---

  async getStudentCertificates(studentId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            title,
            module_id,
            modules (name)
          )
        `)
        .eq('user_id', studentId)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      
      // Filter for > 80% if not strictly enforced at generation time, 
      // though typically certificates are only generated if passed.
      return data || [];
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }
  },

  async getStudentStats(studentId) {
    // Re-using or centralizing logic from other components
    try {
        const { data: analytics } = await supabase
            .from('learning_analytics')
            .select('*')
            .eq('user_id', studentId)
            .single();
        return analytics;
    } catch (error) {
        return null;
    }
  },

  // --- Lecturer Dashboard ---

  async getLecturerDashboardData(lecturerId) {
    try {
      // 1. Get Lecturer's University and Module
      const { data: lecturerInfo, error: lecError } = await supabase
        .from('university_members')
        .select('university_id, university:university_applications(university_name)')
        .eq('user_id', lecturerId)
        .single();
      
      if (lecError) throw lecError;
      if (!lecturerInfo) return null;

      const { data: moduleAssignments, error: modError } = await supabase
        .from('lecturer_module_assignments')
        .select('module_id, modules(name)')
        .eq('lecturer_id', lecturerId);

      if (modError) throw modError;

      const moduleIds = moduleAssignments.map(ma => ma.module_id);
      const moduleNames = moduleAssignments.map(ma => ma.modules?.name).join(', ');

      // 2. Get Students in this University assigned to these Modules
      // We perform a join on university_members and student_module_assignments
      const { data: students, error: studError } = await supabase
        .from('university_members')
        .select(`
            user_id,
            user:profiles(id, display_name, email),
            student_module_assignments!inner(core_module_id)
        `)
        .eq('university_id', lecturerInfo.university_id)
        .eq('role', 'student')
        .in('student_module_assignments.core_module_id', moduleIds);

      if (studError) throw studError;

      // 3. Enhance with Progress Data
      const enhancedStudents = await Promise.all(students.map(async (s) => {
          // Get overall progress
          const { data: progress } = await supabase
              .from('learning_analytics')
              .select('average_quiz_score, courses_completed')
              .eq('user_id', s.user_id)
              .single();
          
          return {
              id: s.user_id,
              name: s.user?.display_name || 'Unknown',
              email: s.user?.email,
              status: 'Active', // Mock or derive from last_login
              progress: progress?.courses_completed || 0, // Simplified metric
              score: progress?.average_quiz_score || 0
          };
      }));

      return {
          universityName: lecturerInfo.university?.university_name,
          moduleName: moduleNames,
          students: enhancedStudents,
          stats: {
              totalStudents: enhancedStudents.length,
              avgScore: Math.round(enhancedStudents.reduce((acc, s) => acc + (s.score || 0), 0) / (enhancedStudents.length || 1)),
              activeAssignments: 0 // Placeholder
          }
      };

    } catch (error) {
      console.error('Error fetching lecturer data:', error);
      throw error;
    }
  },

  // --- University Admin Dashboard ---

  async getUniversityAdminData(adminId) {
    try {
        // 1. Get Admin's University
        const { data: adminInfo } = await supabase
            .from('university_applications')
            .select('id, university_name')
            .eq('admin_user_id', adminId)
            .single();
        
        if (!adminInfo) throw new Error("University not found for this admin");

        // 2. Fetch all students for this university
        const { data: students, error: studError } = await supabase
            .from('university_members')
            .select(`
                user_id,
                role,
                user:profiles(id, display_name, email),
                module_assignments:student_module_assignments(core_module_id, modules(name))
            `)
            .eq('university_id', adminInfo.id)
            .eq('role', 'student');

        if (studError) throw studError;

        // 3. Fetch progress for all these students
        // Doing this in a loop is inefficient but functional for small datasets. 
        // For larger sets, we'd use the 'student_progress_summary' view created in migration.
        
        const detailedStudents = await Promise.all(students.map(async (s) => {
            const { data: la } = await supabase
                .from('learning_analytics')
                .select('courses_completed, average_quiz_score')
                .eq('user_id', s.user_id)
                .maybeSingle();
            
            const { count: certCount } = await supabase
                .from('certificates')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', s.user_id);

            return {
                id: s.user_id,
                name: s.user?.display_name || 'Unknown',
                email: s.user?.email,
                module: s.module_assignments?.[0]?.modules?.name || 'Unassigned',
                moduleId: s.module_assignments?.[0]?.core_module_id,
                progress: la?.courses_completed || 0, // Using courses completed as proxy for progress
                avgScore: la?.average_quiz_score || 0,
                certificates: certCount || 0,
                status: 'Enrolled'
            };
        }));

        // 4. Calculate Module Stats
        const moduleStats = detailedStudents.reduce((acc, s) => {
            const mod = s.module;
            if (!acc[mod]) {
                acc[mod] = { name: mod, studentCount: 0, totalScore: 0, certificates: 0 };
            }
            acc[mod].studentCount++;
            acc[mod].totalScore += s.avgScore;
            acc[mod].certificates += s.certificates;
            return acc;
        }, {});

        const moduleStatsArray = Object.values(moduleStats).map(m => ({
            ...m,
            avgScore: Math.round(m.totalScore / (m.studentCount || 1))
        }));

        return {
            universityName: adminInfo.university_name,
            students: detailedStudents,
            moduleStats: moduleStatsArray,
            overview: {
                totalStudents: detailedStudents.length,
                totalCertificates: detailedStudents.reduce((acc, s) => acc + s.certificates, 0),
                avgPerformance: Math.round(detailedStudents.reduce((acc, s) => acc + s.avgScore, 0) / (detailedStudents.length || 1))
            }
        };

    } catch (error) {
        console.error("Error fetching university admin data:", error);
        throw error;
    }
  }
};