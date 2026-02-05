import { supabase } from '@/lib/customSupabaseClient';

/**
 * Creates an in-app notification in the database.
 * @param {string} userId - The UUID of the user to notify.
 * @param {string} title - The title of the notification.
 * @param {string} message - The main content of the notification.
 * @param {string} type - A category for the notification (e.g., 'access_granted').
 */
export const createInAppNotification = async (userId, title, message, type) => {
    const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type,
        read: false,
    });

    if (error) {
        console.error(`Failed to create in-app notification for user ${userId}:`, error);
    }
};

/**
 * Sends an email notification by invoking a Supabase Edge Function.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} htmlBody - The HTML content of the email.
 */
export const sendEmailNotification = async (email, subject, htmlBody) => {
    try {
        const { error } = await supabase.functions.invoke('send-email', {
            body: {
                to: email,
                subject,
                html: htmlBody,
            },
        });
        if (error) throw error;
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
    }
};

/**
 * Notifies a student that they have been granted access to an application.
 * @param {string} studentId - The student's user ID.
 * @param {string} applicationName - The name of the application.
 * @param {string} expiryDate - The ISO string of the expiry date.
 * @param {string} studentEmail - The student's email.
 */
export const sendAccessGrantedNotification = async (studentId, applicationName, expiryDate, studentEmail) => {
    const formattedDate = new Date(expiryDate).toLocaleDateString();
    const title = `Access Granted: ${applicationName}`;
    const message = `You now have access to the "${applicationName}" application. Your access will expire on ${formattedDate}.`;

    await createInAppNotification(studentId, title, message, 'access_granted');
    await sendEmailNotification(
        studentEmail,
        title,
        `<p>${message}</p><p>Log in to your Petrolord dashboard to explore.</p>`
    );
};

/**
 * Warns a student that their application access is expiring soon.
 * @param {string} studentId - The student's user ID.
 * @param {string} applicationName - The name of the application.
 * @param {string} expiryDate - The ISO string of the expiry date.
 * @param {string} studentEmail - The student's email.
 */
export const sendAccessExpiryWarningNotification = async (studentId, applicationName, expiryDate, studentEmail) => {
    const formattedDate = new Date(expiryDate).toLocaleDateString();
    const title = `Access Expiring Soon: ${applicationName}`;
    const message = `Your access to the "${applicationName}" application is expiring on ${formattedDate}. Please contact your administrator if you need to extend it.`;

    await createInAppNotification(studentId, title, message, 'access_expiry_warning');
    await sendEmailNotification(
        studentEmail,
        title,
        `<p>${message}</p>`
    );
};

/**
 * Notifies a student that their application access has expired.
 * @param {string} studentId - The student's user ID.
 * @param {string} applicationName - The name of the application.
 * @param {string} studentEmail - The student's email.
 */
export const sendAccessExpiredNotification = async (studentId, applicationName, studentEmail) => {
    const title = `Access Expired: ${applicationName}`;
    const message = `Your access to the "${applicationName}" application has expired.`;

    await createInAppNotification(studentId, title, message, 'access_expired');
    await sendEmailNotification(
        studentEmail,
        title,
        `<p>${message}</p><p>Please contact your administrator if you believe this is an error.</p>`
    );
};