import { supabase } from '@/lib/customSupabaseClient';

/**
 * Anonymizes an email address.
 * u***@example.com
 */
export const anonymizeEmail = (email) => {
    if (!email || !email.includes('@')) return 'anonymized@email.com';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 1) return `*@${domain}`;
    const anonymizedLocalPart = `${localPart[0]}***`;
    return `${anonymizedLocalPart}@${domain}`;
};

/**
 * Anonymizes a name by returning a generic user ID format.
 */
export const anonymizeName = (name, id) => {
    return `User_${id.substring(0, 8)}`;
};

/**
 * Anonymizes report data based on a configuration.
 * This is a basic implementation. A real-world scenario would be more complex.
 */
export const anonymizeReportData = (reportData, config) => {
    if (!reportData || !reportData.details) return reportData;

    const anonymizedDetails = reportData.details.map(item => {
        const newItem = { ...item };
        if (config.fields.includes('user_email') && newItem.user_email) {
            newItem.user_email = anonymizeEmail(newItem.user_email);
        }
        if (config.fields.includes('recipient_email') && newItem.recipient_email) {
            newItem.recipient_email = anonymizeEmail(newItem.recipient_email);
        }
         if (config.fields.includes('Student') && newItem['Student']) {
            // This assumes a user_id or similar is available. Let's mock it.
            newItem['Student'] = `Anonymized User`;
        }
        if (config.fields.includes('ip_address') && newItem.ip_address) {
            newItem.ip_address = '**.**.**.**';
        }
        return newItem;
    });

    return { ...reportData, details: anonymizedDetails, isAnonymized: true };
};

/**
 * Logs the anonymization action.
 */
export const logAnonymization = async (adminId, reportId, type, fields) => {
    try {
        const { error } = await supabase.from('anonymization_logs').insert({
            admin_id: adminId,
            report_id: reportId, // This might be null if not a saved report
            anonymization_type: type,
            fields_anonymized: fields,
            // In a real app, hash the data to ensure integrity
            data_hash: 'mock_hash_' + Math.random(),
        });
        if (error) throw error;
    } catch (error) {
        console.error('Failed to log anonymization:', error);
        throw new Error('Could not log anonymization action.');
    }
};