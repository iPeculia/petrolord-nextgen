import { supabase } from './customSupabaseClient';

// NOTE: This is a mock scheduler for demo purposes.
// In production, this logic should run in a reliable server-side environment (e.g., a cron job or scheduled Supabase Edge Function).
export const initializeScheduler = (onTick) => {
  console.log("Initializing mock report scheduler...");
  const intervalId = setInterval(onTick, 60000); // Check every minute
  return () => {
      console.log("Cleaning up mock report scheduler.");
      clearInterval(intervalId);
  };
};

export const checkAndRunScheduledReports = async () => {
    console.log("Checking for due reports...");
    const now = new Date().toISOString();

    // Fetch reports that are enabled and due
    const { data: reports, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('enabled', true)
        .lte('next_send_at', now);
    
    if (error) {
        console.error("Error fetching scheduled reports:", error);
        return;
    }

    if (!reports || reports.length === 0) {
        console.log("No reports due at this time.");
        return;
    }

    console.log(`Found ${reports.length} due report(s).`);

    for (const report of reports) {
        await executeScheduledReport(report);
    }
};

const executeScheduledReport = async (report) => {
    console.log(`Executing report: ${report.title} (ID: ${report.id})`);
    try {
        const { data, error } = await supabase.functions.invoke('send-report-email', {
            body: { scheduleId: report.id },
        });

        if (error) {
          throw error;
        }

        console.log(`Report ${report.title} processed. Function response:`, data);
        
    } catch (error) {
        console.error(`Failed to execute scheduled report ${report.id}:`, error);
        // Log failure to history
        await supabase.from('scheduled_report_history').insert({
            scheduled_report_id: report.id,
            status: 'failed',
            error_message: error.message,
            recipients: report.email_recipients,
            sent_at: new Date().toISOString()
        });
    }
};