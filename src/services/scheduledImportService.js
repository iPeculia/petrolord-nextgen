import { supabase } from '@/lib/customSupabaseClient';

export const ScheduledImportService = {
  /**
   * Fetch scheduled imports with pagination and filtering
   */
  async getScheduledImports({ page = 1, limit = 10, filters = {}, sort = { column: 'created_at', direction: 'desc' } }) {
    try {
      const { data, error } = await supabase.functions.invoke('get-scheduled-imports', {
        body: { page, limit, filters, sort }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching scheduled imports:', error);
      throw error;
    }
  },

  /**
   * Create a new scheduled import
   */
  async createScheduledImport(importData) {
    try {
      const { data, error } = await supabase
        .from('scheduled_imports')
        .insert([{
            ...importData,
            created_by: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scheduled import:', error);
      throw error;
    }
  },

  /**
   * Update an existing scheduled import
   */
  async updateScheduledImport(id, updates) {
    try {
      const { data, error } = await supabase
        .from('scheduled_imports')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating scheduled import:', error);
      throw error;
    }
  },

  /**
   * Delete a scheduled import
   */
  async deleteScheduledImport(id) {
    try {
      const { error } = await supabase
        .from('scheduled_imports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting scheduled import:', error);
      throw error;
    }
  },

  /**
   * Trigger the job manually (Run Now)
   */
  async runImportNow(id) {
    try {
        // We invoke the cron job function but force it to run specific ID
        const { data, error } = await supabase.functions.invoke('scheduled-import-job', {
            body: { forceRunId: id }
        });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error running import manually:', error);
        throw error;
    }
  },

  /**
   * Get run history for a schedule
   */
  async getImportHistory(scheduledImportId) {
      try {
          const { data, error } = await supabase
            .from('bulk_import_logs')
            .select(`
                *,
                profiles ( display_name )
            `)
            .eq('scheduled_import_id', scheduledImportId)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          return data;
      } catch (error) {
          console.error('Error fetching history:', error);
          throw error;
      }
  },

  /**
   * Upload file to storage for scheduled import
   */
  async uploadImportFile(file) {
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
          const filePath = `scheduled-imports/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('imports') // Assuming 'imports' bucket exists
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          return { filePath, fileName: file.name };
      } catch (error) {
          console.error("Upload error:", error);
          throw error;
      }
  }
};