import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { notificationService } from '@/services/NotificationService';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [preferences, setPreferences] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, count } = await notificationService.getNotifications(user.id, { limit: 20 });
            setNotifications(data);
            
            const countUnread = await notificationService.getUnreadCount(user.id);
            setUnreadCount(countUnread);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchPreferences = useCallback(async () => {
        if (!user) return;
        try {
            const prefs = await notificationService.getUserPreferences(user.id);
            setPreferences(prefs);
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    // Real-time subscription
    useEffect(() => {
        if (!user) return;

        fetchNotifications();
        fetchPreferences();

        const channel = supabase
            .channel(`public:notifications:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newNotification = payload.new;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    // Show toast for real-time alert
                    toast({
                        title: newNotification.title,
                        description: newNotification.message,
                        variant: newNotification.notification_type === 'error' ? 'destructive' : 'default',
                        duration: 5000,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchNotifications, fetchPreferences, toast]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.id);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            const notif = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notif && !notif.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updatePreferences = async (newPrefs) => {
        try {
            await notificationService.updatePreferences(user.id, newPrefs);
            setPreferences(prev => ({ ...prev, ...newPrefs }));
            return true;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        notifications,
        unreadCount,
        isLoading,
        preferences,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};