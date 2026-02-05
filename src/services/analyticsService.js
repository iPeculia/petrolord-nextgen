import { supabase } from '@/lib/customSupabaseClient';

export const analyticsService = {
  // --- Tracking ---

  async logEvent(eventType, eventData = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      if (error) console.error('Error logging event:', error);

      // Update user activity stats
      if (eventType === 'login') {
        await this.updateUserActivity(user.id, { login: true });
      } else {
        await this.updateUserActivity(user.id, { action: true });
      }

    } catch (err) {
      console.error('Analytics logging failed:', err);
    }
  },

  async updateUserActivity(userId, { login = false, action = false }) {
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        const updates = {
          updated_at: new Date().toISOString(),
          actions_count: action ? existing.actions_count + 1 : existing.actions_count
        };
        if (login) {
          updates.login_count = existing.login_count + 1;
          updates.last_login = new Date().toISOString();
        }
        await supabase.from('user_activity').update(updates).eq('id', existing.id);
      } else {
        await supabase.from('user_activity').insert({
          user_id: userId,
          login_count: login ? 1 : 0,
          last_login: login ? new Date().toISOString() : null,
          actions_count: action ? 1 : 0
        });
      }
    } catch (err) {
      console.error('Error updating user activity:', err);
    }
  },

  // --- Dashboard Data Fetching ---

  async getDashboardMetrics() {
    try {
      // 1. Total Users
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // 2. Total Applications
      const { count: totalApps } = await supabase.from('university_applications').select('*', { count: 'exact', head: true });
      
      // 3. Approvals for Rate
      const { count: approvedApps } = await supabase.from('university_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      
      // 4. Active Users (Login in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: activeUsers } = await supabase.from('user_activity').select('*', { count: 'exact', head: true }).gte('last_login', thirtyDaysAgo.toISOString());

      return {
        totalUsers: totalUsers || 0,
        totalApplications: totalApps || 0,
        approvalRate: totalApps ? ((approvedApps / totalApps) * 100).toFixed(1) : 0,
        activeUsers: activeUsers || 0,
        avgProcessingTime: '2.4 days' // Placeholder/Mock until we have strict start/end timestamps on apps
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  async getSystemMetrics() {
    try {
      // 1. Total Universities (using university_applications for now as proxy for onboarded unis)
      const { count: universityCount } = await supabase.from('university_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved');

      // 2. Total Users
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      // 3. Active Users (Active Today - logged in within last 24h)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const { count: activeUsers } = await supabase.from('user_activity').select('*', { count: 'exact', head: true }).gte('last_login', oneDayAgo.toISOString());

      // 4. Total Courses
      const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });

      // 5. Student Count (for pie chart)
      const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');

      return {
        universityCount: universityCount || 0,
        userCount: userCount || 0,
        activeUsers: activeUsers || 0,
        courseCount: courseCount || 0,
        studentCount: studentCount || 0
      };
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      return {
        universityCount: 0,
        userCount: 0,
        activeUsers: 0,
        courseCount: 0,
        studentCount: 0
      };
    }
  },

  async getChartsData() {
    // In a real production environment, these would use 'rpc' calls or aggregated views for performance.
    // Simulating aggregated data for chart visualization based on existing table structures.
    
    // User Growth (Mocked trend based on profiles created_at if feasible, else simulated)
    const userGrowth = [
      { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 }, { name: 'Mar', value: 78 }, 
      { name: 'Apr', value: 95 }, { name: 'May', value: 120 }, { name: 'Jun', value: 156 }
    ];

    // Application Status
    const { data: apps } = await supabase.from('university_applications').select('status');
    const statusCounts = apps?.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {}) || {};
    
    const applicationStatus = [
      { name: 'Pending', value: statusCounts['pending'] || 0 },
      { name: 'Approved', value: statusCounts['approved'] || 0 },
      { name: 'Rejected', value: statusCounts['rejected'] || 0 }
    ];

    // Active Users Trend (Mocked)
    const activeUsersTrend = [
      { name: 'Mon', value: 120 }, { name: 'Tue', value: 132 }, { name: 'Wed', value: 145 },
      { name: 'Thu', value: 160 }, { name: 'Fri', value: 155 }, { name: 'Sat', value: 90 }, { name: 'Sun', value: 85 }
    ];

    return {
      userGrowth,
      applicationStatus,
      activeUsersTrend,
      approvalRatio: applicationStatus.filter(i => i.name !== 'Pending')
    };
  },

  // --- Reports ---

  async getUserActivityReport(dateRange) {
    let query = supabase.from('user_activity').select('*, profiles(email, display_name, role)');
    if (dateRange?.start) query = query.gte('last_login', dateRange.start.toISOString());
    if (dateRange?.end) query = query.lte('last_login', dateRange.end.toISOString());
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      user: item.profiles?.display_name || 'Unknown',
      email: item.profiles?.email,
      role: item.profiles?.role,
      loginCount: item.login_count,
      lastLogin: item.last_login ? new Date(item.last_login).toLocaleString() : 'Never',
      actions: item.actions_count
    }));
  },

  async getApplicationReport(dateRange) {
    let query = supabase.from('university_applications').select('*');
    if (dateRange?.start) query = query.gte('created_at', dateRange.start.toISOString()); // Assuming created_at exists, if not use submitted_at
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(app => ({
      id: app.id,
      university: app.university_name,
      repName: app.rep_name,
      status: app.status,
      submittedAt: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A',
      departments: Array.isArray(app.departments) ? app.departments.length : 0
    }));
  },

  async getUniversityReport() {
    const { data, error } = await supabase.from('university_applications').select('*');
    if (error) throw error;
    
    // Aggregate data manually for report
    return data.map(uni => ({
      id: uni.id,
      name: uni.university_name,
      location: uni.address,
      status: uni.status,
      contact: uni.rep_name,
      departments: Array.isArray(uni.departments) ? uni.departments.join(', ') : 'N/A'
    }));
  },

  async getDepartmentReport() {
      // Since departments are JSONB in applications, we parse them
      const { data, error } = await supabase.from('university_applications').select('university_name, departments');
      if (error) throw error;

      const deptRows = [];
      data.forEach(uni => {
          if (Array.isArray(uni.departments)) {
              uni.departments.forEach(dept => {
                  deptRows.push({
                      university: uni.university_name,
                      department: dept,
                      modules: Math.floor(Math.random() * 5) + 1, // Mock
                      students: Math.floor(Math.random() * 200) + 50, // Mock
                      lecturers: Math.floor(Math.random() * 10) + 2 // Mock
                  });
              });
          }
      });
      return deptRows;
  }
};