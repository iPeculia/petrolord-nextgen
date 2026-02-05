import { supabase } from '@/lib/customSupabaseClient';

const APPLICATION_STATUSES = ['pending', 'submitted', 'accepted', 'rejected', 'waitlisted'];

/**
 * Fetches university submissions with filtering, sorting, and pagination.
 * @param {object} options - The options for fetching.
 * @param {number} options.page - The current page number.
 * @param {string} options.searchTerm - The search term for university or program.
 * @param {string} options.status - The application status to filter by.
 * @returns {Promise<{submissions: any[], count: number}>}
 */
export const getUniversitySubmissions = async ({ page = 1, searchTerm = '', status = 'all' }) => {
    try {
        const from = (page - 1) * 10;
        const to = from + 9;

        let query = supabase
            .from('universities')
            .select('*', { count: 'exact' })
            .order('submitted_at', { ascending: false })
            .range(from, to);

        if (searchTerm) {
            query = query.or(`university_name.ilike.%${searchTerm}%,program_name.ilike.%${searchTerm}%`);
        }

        if (status !== 'all' && APPLICATION_STATUSES.includes(status)) {
            query = query.eq('application_status', status);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        return { submissions: data, count };
    } catch (error) {
        console.error('Error fetching university submissions:', error);
        throw new Error('Failed to fetch university submissions.');
    }
};

/**
 * Creates a new university submission.
 * @param {object} submissionData - The data for the new submission.
 * @param {string} userId - The ID of the user creating the submission.
 * @returns {Promise<any>}
 */
export const createUniversitySubmission = async (submissionData, userId) => {
    try {
        const { data, error } = await supabase
            .from('universities')
            .insert([{ ...submissionData, user_id: userId }])
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating university submission:', error);
        throw new Error('Failed to create university submission.');
    }
};

/**
 * Updates an existing university submission.
 * @param {string} id - The ID of the submission to update.
 * @param {object} updates - The fields to update.
 * @returns {Promise<any>}
 */
export const updateUniversitySubmission = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('universities')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating university submission:', error);
        throw new Error('Failed to update university submission.');
    }
};

/**
 * Deletes a university submission.
 * @param {string} id - The ID of the submission to delete.
 * @returns {Promise<void>}
 */
export const deleteUniversitySubmission = async (id) => {
    try {
        const { error } = await supabase.from('universities').delete().eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error('Error deleting university submission:', error);
        throw new Error('Failed to delete university submission.');
    }
};

/**
 * Fetches statistics for university submissions.
 * @returns {Promise<object>}
 */
export const getSubmissionStats = async () => {
    try {
        const { data, error } = await supabase.from('universities').select('application_status');
        if (error) throw error;
        
        const stats = data.reduce((acc, { application_status }) => {
            acc.total++;
            if (acc[application_status]) {
                acc[application_status]++;
            } else {
                acc[application_status] = 1;
            }
            return acc;
        }, { total: 0, pending: 0, submitted: 0, accepted: 0, rejected: 0, waitlisted: 0 });

        return stats;
    } catch (error) {
        console.error('Error fetching submission stats:', error);
        throw new Error('Failed to fetch submission stats.');
    }
};