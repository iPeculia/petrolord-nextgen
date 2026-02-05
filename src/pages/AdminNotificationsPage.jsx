import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getNotifications, markAllNotificationsAsRead } from '@/lib/reportNotificationUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Bell, CheckCheck } from 'lucide-react';

const AdminNotificationsPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await getNotifications(user.id);
            setNotifications(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);
    
    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead(user.id);
            fetchNotifications();
            toast({ title: 'Success', description: 'All notifications marked as read.' });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    return (
        <>
            <Helmet><title>Notifications - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                 <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><Bell className="mr-3" /> All Notifications</h1>
                    <Button onClick={handleMarkAllRead} variant="outline">
                        <CheckCheck className="mr-2 h-4 w-4" /> Mark All as Read
                    </Button>
                </div>

                <div className="bg-[#1E293B] rounded-lg border border-gray-800 p-4 space-y-3">
                     {loading ? (
                        <p className="text-center text-gray-400 py-8">Loading notifications...</p>
                    ) : notifications.length > 0 ? (
                        notifications.map(n => (
                             <div key={n.id} className={`p-4 rounded-md flex justify-between items-start ${n.read ? 'bg-slate-800/40' : 'bg-slate-700/60'}`}>
                                <div>
                                    <p className={`font-semibold ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                                    <p className="text-sm text-gray-400">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                                </div>
                                {!n.read && <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mt-1"></div>}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">You have no notifications.</p>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default AdminNotificationsPage;