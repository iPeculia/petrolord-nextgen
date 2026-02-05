import { supabase } from '@/lib/customSupabaseClient';

class NotificationService {
  /**
   * Create a new notification
   * @param {string} userId - Target user UUID
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {string} type - info, warning, error, success
   * @param {string} category - academic, license, system, etc.
   * @param {object} metadata - Additional data (action_url, etc.)
   */
  async createNotification(userId, title, message, type = 'info', category = 'general', metadata = {}) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          notification_type: type, // Mapping to existing schema column
          data: { ...metadata, category }, // Storing category in jsonb if column missing
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   * @param {string} userId 
   * @param {object} filters - { is_read, type, limit, offset }
   */
  async getNotifications(userId, filters = {}) {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      
      if (filters.type) {
        query = query.eq('notification_type', filters.type);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      // Return default structure if no prefs found
      if (!data) {
         return {
            email_notifications: true,
            in_app_notifications: true,
            report_sent_notifications: true,
            report_failed_notifications: true
         };
      }
      return data;
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  async updatePreferences(userId, preferences) {
    try {
        // Check if exists first
        const existing = await this.getUserPreferences(userId);
        
        let error;
        // If "existing" was a default object without ID, we need to insert
        if (!existing.id) {
             const { error: insertError } = await supabase
                .from('notification_preferences')
                .insert({ user_id: userId, ...preferences });
             error = insertError;
        } else {
             const { error: updateError } = await supabase
                .from('notification_preferences')
                .update(preferences)
                .eq('user_id', userId);
             error = updateError;
        }

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();