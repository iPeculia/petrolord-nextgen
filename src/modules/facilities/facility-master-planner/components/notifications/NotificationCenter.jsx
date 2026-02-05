import React from 'react';
import { Bell, Trash2, CheckSquare, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Notification from './Notification';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const NotificationCenter = ({ open, onOpenChange }) => {
  const { notifications, removeNotification, markAsRead, markAllAsRead, clearAllNotifications } = useFacilityMasterPlanner();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] h-[600px] bg-[#0f172a] border-slate-800 p-0 flex flex-col shadow-2xl fixed right-4 top-16 translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#131b2b]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-md font-bold text-white">Notifications</h2>
            {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </DialogClose>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#161e2e]">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs text-slate-400 hover:text-blue-400"
          >
            <CheckSquare className="w-3 h-3 mr-1.5" /> Mark all read
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="text-xs text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3 mr-1.5" /> Clear all
          </Button>
        </div>

        {/* List */}
        <ScrollArea className="flex-1 p-4 bg-[#1a1a1a]">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Notification
                key={notif.id}
                notification={notif}
                onClose={() => removeNotification(notif.id)}
                onRead={() => markAsRead(notif.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCenter;