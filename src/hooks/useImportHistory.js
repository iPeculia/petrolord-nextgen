import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/customSupabaseClient';

const fetcher = async (key) => {
    // Key format: ['import-history', page, filters]
    const [_, page, limit, filters] = key;
    
    const { data, error } = await supabase.functions.invoke('get-import-history', {
        body: { page, limit, filters }
    });
    
    if (error) throw error;
    return data;
};

export const useImportHistory = (page = 1, limit = 10, filters = {}) => {
    const { data, error, isLoading } = useSWR(
        ['import-history', page, limit, filters],
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute cache
            keepPreviousData: true
        }
    );

    return {
        data: data?.data || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: () => mutate(['import-history', page, limit, filters])
    };
};