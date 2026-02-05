import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
    const navigate = useNavigate();

    const recentNotifications = notifications.slice(0, 5);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-white' : ''}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#BFFF00] ring-2 ring-[#1E293B]">
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96 bg-[#1E293B] border-slate-700 text-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-semibold text-white">Notifications ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 text-xs text-[#BFFF00] hover:text-[#a3d900] hover:bg-transparent"
                            onClick={(e) => { e.preventDefault(); markAllAsRead(); }}
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                
                <ScrollArea className="h-[300px]">
                    {recentNotifications.length > 0 ? (
                        <div className="flex flex-col gap-1 p-2">
                            {recentNotifications.map(notification => (
                                <div key={notification.id} className="relative">
                                    <div 
                                        className={`p-3 rounded-md text-sm cursor-pointer hover:bg-slate-800 transition-colors ${!notification.is_read ? 'bg-slate-800/50 border-l-2 border-[#BFFF00]' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="font-medium text-white mb-1">{notification.title}</div>
                                        <div className="text-slate-400 line-clamp-2 text-xs">{notification.message}</div>
                                        <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                                            <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                                            {!notification.is_read && <span className="text-[#BFFF00]">New</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-500">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )}
                </ScrollArea>
                
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                    className="w-full text-center justify-center cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 py-3 focus:bg-slate-800"
                    onSelect={() => navigate('/dashboard/notifications')}
                >
                    View Notification Center
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;