import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/customSupabaseClient.js';
import { validateWellLogData } from '@/modules/geoscience/petrophysical-analysis/utils/dataValidation.js';

const fetchWellLogData = async (wellId) => {
  if (!wellId) return [];

  const { data, error } = await supabase
    .from('well_logs')
    .select('*')
    .eq('well_id', wellId);

  if (error) {
    throw new Error(error.message);
  }

  const { isValid, message } = validateWellLogData(data);
  if (!isValid) {
    console.warn('Data validation failed:', message);
  }
  
  const cleanedData = data.map(row => {
    if (row.gr === null) row.gr = 0;
    return row;
  });


  return cleanedData;
};

export const usePetrophysicalData = (wellId) => {
  return useQuery({
    queryKey: ['wellLogData', wellId],
    queryFn: () => fetchWellLogData(wellId),
    enabled: !!wellId,
    staleTime: 5 * 60 * 1000,
  });
};