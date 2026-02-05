import { supabase } from '@/lib/customSupabaseClient';
import { logAction } from '@/lib/auditLogger';

const USERS_PER_PAGE = 10;

export const fetchUsers = async ({ page = 1, searchTerm = '', filters = {}, sort = {} }) => {
    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

    if (searchTerm) {
        query = query.or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
    }

    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (sort.by) {
        query = query.order(sort.by, { ascending: sort.ascending });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const from = (page - 1) * USERS_PER_PAGE;
    const to = from + USERS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users.');
    }

    return { users: data, count };
};

export const updateUser = async (userId, updates) => {
    const { data: oldData, error: fetchError } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (fetchError) throw new Error('Could not fetch user profile for auditing.');

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        await logAction({
            action: 'UPDATE',
            resource_type: 'USER',
            resource_id: userId,
            status: 'failure',
            error_message: error.message,
            description: `Failed to update user ${oldData.email}`
        });
        throw error;
    }

    await logAction({
        action: 'UPDATE',
        resource_type: 'USER',
        resource_id: userId,
        resource_name: data.display_name,
        old_value: oldData,
        new_value: data,
        description: `Updated user profile for ${data.email}`
    });

    return data;
};

export const deleteUser = async (userId) => {
    const { data: oldData, error: fetchError } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (fetchError) throw new Error('Could not fetch user profile for auditing.');

    const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        await logAction({
            action: 'DEACTIVATE',
            resource_type: 'USER',
            resource_id: userId,
            status: 'failure',
            error_message: error.message,
            description: `Failed to deactivate user ${oldData.email}`
        });
        throw error;
    }

    await logAction({
        action: 'STATUS_CHANGE',
        resource_type: 'USER',
        resource_id: userId,
        resource_name: data.display_name,
        old_value: { status: oldData.status },
        new_value: { status: data.status },
        description: `Deactivated user ${data.email}`
    });

    return data;
};

// Hard Delete - Updated for Robust Error Handling
export const permanentlyDeleteUser = async (userId, userEmail) => {
    console.log(`[UserUtils] Initiating PERMANENT delete for: ${userId} (${userEmail})`);

    if (!userId || !userEmail) {
        throw new Error('User ID and Email are required.');
    }

    const payload = { 
        userId, 
        email: userEmail, 
        confirmed: true 
    };
    
    // Invoke Edge Function
    const { data, error } = await supabase.functions.invoke('delete-user', {
        body: payload
    });

    // Handle Network or Invocation Errors (Supabase SDK Errors)
    if (error) {
        console.error('[UserUtils] Edge Function Invoke Error:', error);
        
        // Attempt to extract detailed error from response body if it's wrapped
        let errorMsg = error.message || 'Unknown error occurred.';
        
        // Sometimes the SDK wraps the actual function response error
        if (error.context && typeof error.context.json === 'function') {
            try {
                const body = await error.context.json();
                if (body && body.error) {
                    errorMsg = body.error;
                }
            } catch (jsonError) {
                console.warn('Could not parse error JSON context:', jsonError);
            }
        }

        await logAction({
            action: 'PERMANENT_DELETE',
            resource_type: 'USER',
            resource_id: userId,
            status: 'failure',
            error_message: errorMsg,
            description: `Failed to permanently delete user ${userEmail}`
        });
        
        throw new Error(errorMsg);
    }

    // Edge Function might return 200 but still contain application-level warnings/errors in body
    // although our edge function throws 400/500 for errors, checking for success flag is good practice
    if (data && data.error) {
        throw new Error(data.error);
    }

    console.log('[UserUtils] Deletion successful:', data);

    await logAction({
        action: 'PERMANENT_DELETE',
        resource_type: 'USER',
        resource_id: userId,
        status: 'success',
        description: `Permanently deleted user ${userEmail}`
    });

    return data;
};

export const getUserStats = async (userId) => {
    if (!userId) {
        return { enrolled: 0, completed: 0 };
    }

    try {
        const { count: enrolled, error: enrollError } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', userId);

        if (enrollError) throw enrollError;

        const { count: completed, error: completeError } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', userId)
            .eq('status', 'completed');
        
        if (completeError) throw completeError;

        return {
            enrolled: enrolled || 0,
            completed: completed || 0,
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { enrolled: 0, completed: 0 };
    }
};