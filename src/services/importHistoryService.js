import { supabase } from '@/lib/customSupabaseClient';
import { ImportReportGenerator } from '@/utils/importReportGenerator';

export const ImportHistoryService = {
  /**
   * Fetch import history with filters and pagination
   */
  async getImportHistory({ page = 1, limit = 10, filters = {}, sort = { column: 'created_at', direction: 'desc' } }) {
    try {
      const { data, error } = await supabase.functions.invoke('get-import-history', {
        body: { page, limit, filters, sort }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching import history:', error);
      throw error;
    }
  },

  /**
   * Fetch details for a specific import including records
   */
  async getImportDetails(importId) {
    try {
      const { data, error } = await supabase.functions.invoke('get-import-details', {
        body: { importId }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching import details:', error);
      throw error;
    }
  },

  /**
   * Retry failed records for an import
   */
  async retryFailedRecords(importId) {
    try {
      const { data, error } = await supabase.functions.invoke('retry-failed-records', {
        body: { importId }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error retrying failed records:', error);
      throw error;
    }
  },

  /**
   * Generate and download a report for a specific import
   */
  async downloadImportReport(importId) {
    try {
      const data = await this.getImportDetails(importId);
      if (data && data.import && data.records) {
        ImportReportGenerator.generateAndDownload(data.import, data.records);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  /**
   * Send import completion notification to admin
   */
  async sendImportNotification(importId) {
    try {
      const { data, error } = await supabase.functions.invoke('send-import-notification', {
        body: { importId }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending import notification:', error);
      // We don't throw here to avoid blocking UI flow for a notification failure
      return { error: error.message };
    }
  },

  /**
   * Send credentials/welcome emails to imported users
   */
  async sendUserCredentials(importId, includePasswordReset = true) {
     try {
      const { data, error } = await supabase.functions.invoke('send-user-credentials', {
        body: { importId, includePasswordReset }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending user credentials:', error);
      return { error: error.message };
    }
  },

  /**
   * Send retry report notification
   */
  async sendRetryNotification(importId, retryStats) {
     try {
      const { data, error } = await supabase.functions.invoke('send-retry-notification', {
        body: { importId, retryStats }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending retry notification:', error);
      return { error: error.message };
    }
  }
};