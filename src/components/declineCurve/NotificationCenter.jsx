import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { notificationEngine } from '@/utils/declineCurve/NotificationEngine';
import { Badge } from '@/components/ui/badge';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        return notificationEngine.subscribe(setNotifications);
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" /> Notifications
                    {unreadCount > 0 && <Badge variant="destructive" className="h-5 px-1.5">{unreadCount}</Badge>}
                </CardTitle>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-green-400" title="Mark all read" onClick={() => notifications.forEach(n => notificationEngine.markAsRead(n.id))}>
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-red-400" title="Clear all" onClick={() => notificationEngine.clearAll()}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-xs">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-3 flex gap-3 ${n.read ? 'opacity-60' : 'bg-slate-800/20'}`}>
                                    <div className="mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-sm font-medium ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>{n.title}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(n.time).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                                        {!n.read && (
                                            <Button 
                                                variant="link" 
                                                className="h-auto p-0 text-[10px] text-blue-400 mt-1"
                                                onClick={() => notificationEngine.markAsRead(n.id)}
                                            >
                                                Mark read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default NotificationCenter;