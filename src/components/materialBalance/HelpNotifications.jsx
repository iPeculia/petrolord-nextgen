import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BookOpen, Video, Info } from 'lucide-react';

const HelpNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'update',
      title: 'New Feature: Aquifer Analysis',
      message: 'The Aquifer Influx panel has been updated with Van Everdingen-Hurst models.',
      date: '2 hours ago',
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Recommended Tutorial',
      message: 'Based on your usage, check out "Advanced Material Balance Plotting".',
      date: '1 day ago',
      icon: Video,
      color: 'text-[#BFFF00]',
      bgColor: 'bg-[#BFFF00]/10'
    },
    {
      id: 3,
      type: 'content',
      title: 'New Case Study Added',
      message: 'Learn how "Permian Wolfcamp A" data was analyzed.',
      date: '2 days ago',
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white flex items-center">
            <Bell className="w-6 h-6 mr-3 text-slate-400" />
            Help Notifications
         </h2>
         <Button variant="ghost" className="text-slate-400 hover:text-white">Mark all as read</Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
                <Card key={notif.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardContent className="p-4 flex gap-4">
                        <div className={`p-3 rounded-full h-fit ${notif.bgColor}`}>
                            <Icon className={`w-5 h-5 ${notif.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-white text-sm">{notif.title}</h4>
                                <span className="text-xs text-slate-500">{notif.date}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                            <div className="mt-3">
                                <Button variant="link" className="p-0 h-auto text-xs text-blue-400 hover:text-blue-300">
                                    View Details
                                </Button>
                            </div>
                        </div>
                        {notif.type === 'update' && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        )}
                    </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
};

export default HelpNotifications;