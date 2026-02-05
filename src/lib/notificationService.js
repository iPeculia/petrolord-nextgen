import { supabase } from './customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

let notificationChannel = null;

export const initializeNotificationService = (userId, onNewNotification) => {
  if (notificationChannel || !userId) {
    return;
  }
  
  console.log(`Subscribing to notifications for user: ${userId}`);
  
  notificationChannel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('New notification received:', payload.new);
        if (onNewNotification) {
          onNewNotification(payload.new);
        }
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to notification channel!');
      }
      if (status === 'CHANNEL_ERROR') {
        console.error('Notification channel error:', err);
      }
    });

  return () => {
    if (notificationChannel) {
      console.log('Unsubscribing from notifications.');
      supabase.removeChannel(notificationChannel);
      notificationChannel = null;
    }
  };
};

export const unsubscribeFromNotifications = () => {
  if (notificationChannel) {
    console.log('Unsubscribing from notifications.');
    supabase.removeChannel(notificationChannel);
    notificationChannel = null;
  }
};