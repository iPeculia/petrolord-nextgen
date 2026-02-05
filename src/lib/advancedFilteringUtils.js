import { supabase } from '@/lib/customSupabaseClient';

export const getFilterPresets = async () => {
    const { data, error } = await supabase.from('filter_presets').select('*');
    if (error) throw new Error('Failed to fetch filter presets.');
    return data;
};

export const createFilterPreset = async (presetData, adminId) => {
    const { data, error } = await supabase.from('filter_presets').insert([{
        ...presetData,
        admin_id: adminId,
        created_by: adminId,
    }]).select().single();
    if (error) throw new Error('Failed to create filter preset.');
    return data;
};

export const deleteFilterPreset = async (id) => {
    const { error } = await supabase.from('filter_presets').delete().eq('id', id);
    if (error) throw new Error('Failed to delete filter preset.');
};