import { supabase } from '@/lib/customSupabaseClient';
import { sendAccessGrantedNotification, sendAccessExpiryWarningNotification, sendAccessExpiredNotification } from '@/lib/notificationUtils';

/**
 * Automatically grants application access when a student completes a course.
 * This is designed to be called from a database trigger/function.
 */
export async function autoGrantAccessOnCourseCompletion(studentId, courseId) {
    try {
        // This function is now mostly handled by the `handle_new_completion` PL/pgSQL function.
        // The client-side part can be used for triggering notifications if needed,
        // but the core logic is on the DB side for reliability.
        console.log(`Course completion triggered for student ${studentId} and course ${courseId}. Access grant handled by database trigger.`);
        
        // You could potentially fetch the newly granted access and send a notification here,
        // though it's better to do this in the DB trigger itself for atomicity.
    } catch (error) {
        console.error('Error in client-side handler for course completion:', error);
    }
}

/**
 * Finds all expired access records and deactivates them.
 * Runs periodically.
 */
export async function autoRevokeExpiredAccess() {
    console.log('Running job: autoRevokeExpiredAccess');
    const now = new Date().toISOString();

    const { data: expiredRecords, error: fetchError } = await supabase
        .from('student_application_access')
        .select('id, student_id, applications(name, profiles(email))')
        .lt('access_expires_date', now)
        .eq('is_active', true);

    if (fetchError) {
        console.error('Error fetching expired access records:', fetchError);
        return;
    }

    if (!expiredRecords || expiredRecords.length === 0) {
        console.log('No expired access records found to revoke.');
        return;
    }

    const idsToRevoke = expiredRecords.map(record => record.id);

    const { error: updateError } = await supabase
        .from('student_application_access')
        .update({ is_active: false })
        .in('id', idsToRevoke);

    if (updateError) {
        console.error('Error revoking expired access:', updateError);
        return;
    }

    console.log(`Successfully revoked ${expiredRecords.length} expired access records.`);

    // Send notifications
    for (const record of expiredRecords) {
        await sendAccessExpiredNotification(
            record.student_id,
            record.applications.name,
            record.applications.profiles.email
        );
    }
}

/**
 * Finds access records expiring within the next 7 days and sends warnings.
 * Runs daily.
 */
export async function sendAccessExpiryWarnings() {
    console.log('Running job: sendAccessExpiryWarnings');
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: expiringRecords, error } = await supabase
        .from('student_application_access')
        .select('student_id, access_expires_date, applications(name, profiles(email))')
        .eq('is_active', true)
        .gte('access_expires_date', now.toISOString())
        .lte('access_expires_date', oneWeekFromNow.toISOString());

    if (error) {
        console.error('Error fetching expiring access records:', error);
        return;
    }

    if (!expiringRecords || expiringRecords.length === 0) {
        console.log('No access records expiring soon.');
        return;
    }

    console.log(`Found ${expiringRecords.length} records expiring soon. Sending warnings...`);

    for (const record of expiringRecords) {
        await sendAccessExpiryWarningNotification(
            record.student_id,
            record.applications.name,
            record.access_expires_date,
            record.applications.profiles.email
        );
    }
}