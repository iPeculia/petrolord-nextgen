import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to handle user preferences and account settings
 */
export const settingsService = {
  /**
   * Fetch user preferences or create default if not exists
   */
  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if not found

      if (error) throw error;

      if (!data) {
        // Create default preferences
        const { data: newData, error: createError } = await supabase
          .from('user_preferences')
          .insert([{ user_id: userId }])
          .select()
          .single();
        
        if (createError) throw createError;
        return newData;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  },

  /**
   * Update specific user preferences
   */
  async updateUserPreferences(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  /**
   * Update user profile information in the profiles table
   */
  async updateUserProfile(userId, profileData) {
    try {
      // We only update display_name and phone in the profiles table based on current schema
      // Email updates happen via auth.updateUser
      const updates = {
        display_name: profileData.display_name,
        // Add other fields if schema supports them (e.g., phone, bio)
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Update user email or password via Supabase Auth
   */
  async updateAuthUser(attributes) {
    try {
      const { data, error } = await supabase.auth.updateUser(attributes);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating auth user:', error);
      throw error;
    }
  },

  /**
   * Delete user account (requires specialized edge function usually, but standard delete works if configured)
   * NOTE: Usually users cannot delete themselves from auth directly without admin rights or edge function
   * unless explicitly allowed. Here we mock a request or assume policies allow it.
   * For this implementation, we will use a Supabase RPC or assume client-side delete if enabled, 
   * otherwise we might need an Edge Function.
   */
  async deleteUserAccount(userId) {
    // This is a placeholder. Typically deleting a user from client-side requires
    // calling a secure endpoint or RPC function.
    // For now, we will simulate this or use the admin API if available (which isn't on client).
    // Safest bet for client-only is to mark profile as 'deleted' or 'inactive'.
    try {
       const { error } = await supabase
         .from('profiles')
         .update({ status: 'inactive' })
         .eq('id', userId);
         
       if (error) throw error;
       
       // Sign out
       await supabase.auth.signOut();
       return true;
    } catch (error) {
       console.error('Error deactivating account:', error);
       throw error;
    }
  }
};