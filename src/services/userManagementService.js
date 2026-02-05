import { supabase } from '@/lib/customSupabaseClient';

export const UserManagementService = {
  /**
   * Create a single user via Edge Function
   * @param {Object} userData - { email, firstName, lastName, universityId, moduleId, userType }
   * @returns {Promise<Object>}
   */
  async createSingleUser(userData) {
    try {
      const { data, error } = await supabase.functions.invoke('add-user', {
        body: userData,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Check if email already exists in the database
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async validateEmail(email) {
    try {
      // Check public.users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (usersError) throw usersError;
      if (usersData) return false; // Email exists

      // Also check profiles to be safe
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (profilesError) throw profilesError;
      if (profilesData) return false; // Email exists

      return true; // Email is valid (does not exist)
    } catch (error) {
      console.error('Error validating email:', error);
      return false; // Fail safe
    }
  },

  /**
   * Batch check existing emails for CSV import
   * @param {string[]} emails 
   * @returns {Promise<string[]>} List of emails that ALREADY exist
   */
  async checkEmailsExist(emails) {
    if (!emails || emails.length === 0) return [];
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('email')
            .in('email', emails);
            
        if (error) throw error;
        return data.map(u => u.email);
    } catch (error) {
        console.error('Error batch checking emails:', error);
        return [];
    }
  },

  /**
   * Process Bulk Import
   * @param {Object} payload - { universityId, users: [] }
   */
  async processBulkImport(payload) {
    try {
        const { data, error } = await supabase.functions.invoke('bulk-import-users', {
            body: payload
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Bulk import error:', error);
        throw error;
    }
  },

  /**
   * Fetch universities accessible to the admin
   * @returns {Promise<Array>}
   */
  async getUniversities() {
    try {
      // For Super Admin / Petrolord Admin, fetch all approved universities
      const { data, error } = await supabase
        .from('university_applications')
        .select('id, university_name')
        .eq('status', 'approved')
        .order('university_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  },

  /**
   * Fetch all available modules
   * @returns {Promise<Array>}
   */
  async getModules() {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('id, name, category')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }
};