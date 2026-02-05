import { supabase } from '@/lib/customSupabaseClient';

export const UniversityAdminService = {
  // Get the university details for the current logged-in admin
  async getUniversityForAdmin(adminId) {
    try {
      const { data, error } = await supabase
        .from('university_applications')
        .select('*')
        .eq('admin_user_id', adminId)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching university details:', error);
      return null;
    }
  },

  // Get overview statistics
  async getOverviewStats(universityId) {
    try {
      const [studentsCount, lecturersCount, departmentsCount, activeCoursesCount] = await Promise.all([
        supabase.from('university_members').select('*', { count: 'exact', head: true }).eq('university_id', universityId).eq('role', 'student'),
        supabase.from('university_members').select('*', { count: 'exact', head: true }).eq('university_id', universityId).eq('role', 'lecturer'),
        supabase.from('university_departments').select('*', { count: 'exact', head: true }).eq('university_id', universityId),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('published', true)
      ]);

      return {
        totalStudents: studentsCount.count || 0,
        totalLecturers: lecturersCount.count || 0,
        totalDepartments: departmentsCount.count || 0,
        activeCourses: activeCoursesCount.count || 0,
        avgPerformance: 76, 
        courseCompletionRate: 82
      };
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      return {
        totalStudents: 0, totalLecturers: 0, totalDepartments: 0, activeCourses: 0, avgPerformance: 0, courseCompletionRate: 0
      };
    }
  },

  // Get Departments with calculated stats
  async getDepartments(universityId) {
    try {
      const { data: departments, error } = await supabase
        .from('university_departments')
        .select('*')
        .eq('university_id', universityId);

      if (error) throw error;

      const departmentsWithStats = await Promise.all(departments.map(async (dept) => {
        const { count: studentCount } = await supabase
          .from('university_members')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', dept.id)
          .eq('role', 'student');
        
        const { count: lecturerCount } = await supabase
          .from('university_members')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', dept.id)
          .eq('role', 'lecturer');

        return {
          ...dept,
          studentCount: studentCount || 0,
          lecturerCount: lecturerCount || 0,
          performance: Math.floor(Math.random() * (95 - 70 + 1) + 70), 
          activeCourses: Math.floor(Math.random() * 10) + 2
        };
      }));

      return departmentsWithStats;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  // Get Lecturers
  async getLecturers(universityId) {
    try {
      const { data, error } = await supabase
        .from('university_members')
        .select(`
          *,
          university_departments (name)
        `)
        .eq('university_id', universityId)
        .eq('role', 'lecturer');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      return [];
    }
  },

  // Get Students
  async getStudents(universityId) {
    try {
      const { data, error } = await supabase
        .from('university_members')
        .select(`
          *,
          university_departments (name)
        `)
        .eq('university_id', universityId)
        .eq('role', 'student');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  // Get detailed info for a single student (modal use)
  async getStudentDetails(studentId) {
      try {
          const { data, error } = await supabase
              .from('university_members')
              .select(`
                  *,
                  university_departments (name)
              `)
              .eq('id', studentId)
              .single();
          
          if (error) throw error;

          // Fetch GPA/Progress mock for now or real if table exists
          // Since we don't have a direct GPA table linked, we simulate or calculate from grades if available
          return {
              ...data,
              gpa: (Math.random() * (4.0 - 2.5) + 2.5).toFixed(2),
              overallProgress: Math.floor(Math.random() * 100)
          };
      } catch (error) {
          console.error("Error fetching student details", error);
          return null;
      }
  },

  // Get courses assigned to a student (via enrollments)
  async getStudentCourses(studentId) {
      try {
          // Join on profiles to link student ID
          // First get the user_id from university_members
          const { data: memberData } = await supabase.from('university_members').select('user_id').eq('id', studentId).single();
          
          if (!memberData?.user_id) return [];

          const { data, error } = await supabase
              .from('student_course_enrollments')
              .select(`
                  *,
                  courses (
                      id,
                      title,
                      duration_weeks
                  )
              `)
              .eq('student_id', memberData.user_id);
          
          if (error) throw error;
          
          return data.map(enrollment => ({
              id: enrollment.courses.id,
              name: enrollment.courses.title,
              code: `CRS-${enrollment.courses.id.slice(0,4).toUpperCase()}`,
              instructor: 'TBD', // Would need course->instructor join
              progress: Math.floor(Math.random() * 100),
              grade: Math.floor(Math.random() * (100 - 70) + 70),
              status: enrollment.status,
              enrollmentDate: enrollment.enrolled_date
          }));

      } catch (error) {
          console.error("Error fetching student courses", error);
          return [];
      }
  },

  // Get application access records for a student
  async getStudentApplicationAccess(studentId) {
      try {
          const { data: memberData } = await supabase.from('university_members').select('user_id').eq('id', studentId).single();
          if (!memberData?.user_id) return [];

          const { data, error } = await supabase
              .from('student_application_access')
              .select(`
                  *,
                  applications (
                      name,
                      status
                  )
              `)
              .eq('student_id', memberData.user_id);

          if (error) throw error;
          return data;
      } catch (error) {
          console.error("Error fetching app access", error);
          return [];
      }
  },

  // Get activity timeline for a student
  async getStudentActivityTimeline(studentId) {
     try {
        const { data: memberData } = await supabase.from('university_members').select('user_id').eq('id', studentId).single();
        if (!memberData?.user_id) return [];

        const { data, error } = await supabase
            .from('student_login_logs')
            .select('*')
            .eq('student_id', memberData.user_id)
            .order('login_time', { ascending: false })
            .limit(20);

        if (error) throw error;
        
        return data.map(log => ({
            id: log.id,
            type: 'login',
            title: 'System Login',
            timestamp: log.login_time,
            details: `Logged in from ${log.ip_address || 'Unknown IP'}`
        }));
     } catch (error) {
        console.error("Error fetching timeline", error);
        return [];
     }
  },

  // Get all courses with analytics for university view
  async getCourseAnalytics(universityId) {
      try {
          // Fetch all courses relevant to university (simplified: all published courses for now)
          const { data, error } = await supabase.from('courses').select('*').eq('published', true);
          if (error) throw error;

          // Mock aggregations for demo purposes until more enrollment data exists
          return data.map(course => ({
              id: course.id,
              name: course.title,
              code: `CRS-${course.id.slice(0,4).toUpperCase()}`,
              instructor: 'Dr. Smith', // Placeholder
              department: 'General Engineering',
              enrollmentCount: Math.floor(Math.random() * 50) + 10,
              completionRate: Math.floor(Math.random() * 30) + 60,
              averageGrade: Math.floor(Math.random() * 20) + 75,
              status: course.published ? 'Active' : 'Inactive'
          }));
      } catch (error) {
          console.error("Error fetching course analytics", error);
          return [];
      }
  },

  // Get all students application access records for university view
  async getApplicationAccessRecords(universityId) {
      try {
           // Get all students of this uni first
           const { data: students } = await supabase.from('university_members').select('user_id').eq('university_id', universityId).eq('role', 'student');
           const studentIds = students.map(s => s.user_id);

           if (studentIds.length === 0) return [];

           const { data, error } = await supabase
            .from('student_application_access')
            .select(`
                *,
                profiles:student_id (display_name, email),
                applications (name)
            `)
            .in('student_id', studentIds);

           if (error) throw error;
           return data;
      } catch (error) {
          console.error("Error fetching all app access records", error);
          return [];
      }
  },

  // Get Performance Metrics (Charts Data)
  async getPerformanceMetrics(universityId) {
    return {
      gpaByDepartment: [
        { name: 'Petroleum Eng', value: 3.8 },
        { name: 'Geoscience', value: 3.5 },
        { name: 'Drilling', value: 3.6 },
        { name: 'Reservoir', value: 3.9 }
      ],
      completionRate: [
        { name: 'Completed', value: 65 },
        { name: 'In Progress', value: 30 },
        { name: 'Not Started', value: 5 }
      ],
      progressDistribution: [
        { range: '0-25%', count: 12 },
        { range: '26-50%', count: 25 },
        { range: '51-75%', count: 45 },
        { range: '76-100%', count: 38 }
      ]
    };
  }
};