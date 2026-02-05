import React from 'react';
import { Helmet } from 'react-helmet';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCheck, Trash2, Bell } from 'lucide-react';

const NotificationCenter = () => {
    const { notifications, markAllAsRead, deleteNotification } = useNotifications();

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-6">
            <Helmet><title>Notifications | Petrolord</title></Helmet>
            
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Bell className="w-8 h-8 text-[#BFFF00]" /> Notifications
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={markAllAsRead} className="border-slate-700">
                        <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-[#1E293B] rounded-lg border border-slate-800">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications to display.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <Card key={n.id} className={`p-4 bg-[#1E293B] border-slate-800 flex justify-between items-start gap-4 ${!n.is_read ? 'border-l-4 border-l-[#BFFF00]' : ''}`}>
                            <div className="flex-1">
                                <h3 className={`font-medium ${!n.is_read ? 'text-white' : 'text-slate-400'}`}>{n.title}</h3>
                                <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                                <p className="text-xs text-slate-600 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-slate-500 hover:text-red-400"
                                onClick={() => deleteNotification(n.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;