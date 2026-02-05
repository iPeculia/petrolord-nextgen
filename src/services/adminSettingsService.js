import { supabase } from '@/lib/customSupabaseClient';

export const AdminSettingsService = {
  async getSettings(category) {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      
      // Transform array to object for easier consumption
      return data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    } catch (error) {
      console.error(`Error fetching ${category} settings:`, error);
      throw error;
    }
  },

  async updateSetting(category, key, value) {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .upsert({
          category,
          key,
          value,
          updated_at: new Date(),
        }, { onConflict: 'category, key' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },

  async sendTestEmail(to, template) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, template, subject: 'Test Email from Admin Settings' }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }
};