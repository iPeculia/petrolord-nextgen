import { supabase } from '@/lib/customSupabaseClient';

export const getNotificationPreferences = async (userId) => {
    const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw new Error('Failed to fetch notification preferences.');
    
    // If no preferences exist, create default ones
    if (!data) {
        const { data: newData, error: insertError } = await supabase
            .from('notification_preferences')
            .insert({ user_id: userId })
            .select()
            .single();
        if (insertError) throw new Error('Failed to create default notification preferences.');
        return newData;
    }
    
    return data;
};

export const updateNotificationPreferences = async (userId, preferences) => {
    const { data, error } = await supabase
        .from('notification_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) throw new Error('Failed to update notification preferences.');
    return data;
};

export const getNotifications = async (userId) => {
    const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) throw new Error('Failed to fetch notifications.');
    return { data, count };
};

export const markNotificationAsRead = async (notificationId) => {
    const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();
    
    if (error) throw new Error('Failed to mark notification as read.');
    return data;
};

export const markAllNotificationsAsRead = async (userId) => {
     const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false);
    
    if (error) throw new Error('Failed to mark all notifications as read.');
    return data;
};