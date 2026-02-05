import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetches all modules from the database, including a count of their applications.
 */
export const getModulesWithAppCount = async () => {
    const { data, error } = await supabase
        .from('modules')
        .select(`
            *,
            applications (count)
        `)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching modules with app count:', error);
        throw error;
    }
    // The count is returned as an array of objects, so we extract it.
    return data.map(m => ({ ...m, app_count: m.applications[0]?.count || 0 }));
};


/**
 * Fetches a single module by its ID.
 * @param {string} moduleId - The UUID of the module.
 */
export const getModuleById = async (moduleId) => {
    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();
    if (error) {
        console.error('Error fetching module by ID:', error);
        if (error.code === 'PGRST116') { // PostgREST error for no rows found
             return null;
        }
        throw error;
    }
    return data;
}

/**
 * Fetches all applications for a given module ID.
 * @param {string} moduleId - The UUID of the module.
 */
export const getApplicationsByModule = async (moduleId) => {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('module_id', moduleId)
        .order('phase_required', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching applications for module:', error);
        throw error;
    }
    return data;
};

/**
 * Gets all applications a student can access, along with their access details.
 * This is more efficient than checking one by one.
 * @param {string} studentId - The student's user UUID.
 * @returns {Promise<Map<string, object>>} A map where keys are application IDs and values are access details.
 */
export const getStudentApplicationAccessMap = async (studentId) => {
    const { data, error } = await supabase
        .from('student_application_access')
        .select('application_id, access_expires_date, is_active')
        .eq('student_id', studentId);

    if (error) {
        console.error('Error fetching student access map:', error);
        throw error;
    }
    
    const accessMap = new Map();
    const now = new Date();

    for (const record of data) {
        const isExpired = new Date(record.access_expires_date) < now;
        if (record.is_active && !isExpired) {
            accessMap.set(record.application_id, {
                expires: record.access_expires_date
            });
        }
    }
    return accessMap;
};