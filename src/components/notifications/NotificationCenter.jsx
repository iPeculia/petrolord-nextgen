import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trash2, CheckCheck, Filter } from 'lucide-react';
import NotificationItem from './NotificationItem';
import NotificationPreferences from './NotificationPreferences';

const NotificationCenter = () => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, unread, system, alert

    // Filtering Logic
    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              n.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        if (filter === 'unread') return !n.is_read;
        if (filter === 'system') return n.data?.category === 'system';
        if (filter === 'alert') return n.notification_type === 'warning' || n.notification_type === 'error';
        
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Notification Center</h1>
                    <p className="text-slate-400 mt-1">Manage your alerts and preferences</p>
                </div>
                
                <div className="flex gap-2">
                     <Button 
                        variant="outline" 
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                        <CheckCheck className="mr-2 h-4 w-4 text-[#BFFF00]" /> Mark All Read
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="inbox" className="space-y-6">
                <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger value="inbox" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Inbox</TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="space-y-4">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-[#1E293B] p-4 rounded-lg border border-slate-800">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search notifications..." 
                                className="pl-9 bg-slate-900 border-slate-700 text-white focus:border-[#BFFF00]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                             <Button 
                                variant={filter === 'all' ? 'secondary' : 'ghost'} 
                                onClick={() => setFilter('all')}
                                className="text-sm"
                            >
                                All
                            </Button>
                             <Button 
                                variant={filter === 'unread' ? 'secondary' : 'ghost'} 
                                onClick={() => setFilter('unread')}
                                className="text-sm"
                            >
                                Unread
                                {unreadCount > 0 && <Badge className="ml-2 bg-[#BFFF00] text-black h-5">{unreadCount}</Badge>}
                            </Button>
                             <Button 
                                variant={filter === 'alert' ? 'secondary' : 'ghost'} 
                                onClick={() => setFilter('alert')}
                                className="text-sm"
                            >
                                Alerts
                            </Button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map(notification => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                    onMarkRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-[#1E293B] rounded-lg border border-slate-800 border-dashed">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                                    <Filter className="w-8 h-8 text-slate-600" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-300">No notifications found</h3>
                                <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="preferences">
                    <NotificationPreferences />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NotificationCenter;