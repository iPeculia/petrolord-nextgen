import { supabase } from '@/lib/customSupabaseClient.js';
import { useGlobalDataStore } from '@/store/globalDataStore.js';

let subscription = null;

export const initializeDataSync = () => {
  if (subscription) {
    console.log("Data sync already initialized.");
    return;
  }

  console.log("Initializing real-time data synchronization...");

  const handleChanges = (payload) => {
    console.log('Change received!', payload);
    const { addOrUpdateAnalysis, removeAnalysis } = useGlobalDataStore.getState();

    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      addOrUpdateAnalysis(payload.new);
    } else if (payload.eventType === 'DELETE') {
      removeAnalysis(payload.old.id);
    }
  };

  subscription = supabase
    .channel('public:analyses')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'analyses' }, handleChanges)
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to analyses changes!');
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('Subscription error:', err);
      }
    });
};

export const cleanupDataSync = () => {
  if (subscription) {
    supabase.removeChannel(subscription);
    subscription = null;
    console.log("Data sync cleaned up.");
  }
};