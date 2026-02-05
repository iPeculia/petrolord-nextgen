import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
    const { id, title, message, notification_type, is_read, created_at, data } = notification;
    
    // Icon selection based on type
    const getIcon = () => {
        switch (notification_type) {
            case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const category = data?.category || 'General';

    return (
        <div className={cn(
            "group flex gap-4 p-4 rounded-lg border transition-all duration-200",
            is_read ? "bg-[#1E293B] border-slate-800 opacity-75 hover:opacity-100" : "bg-slate-800 border-slate-600 shadow-md"
        )}>
            <div className="flex-shrink-0 pt-1">
                {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium leading-none", is_read ? "text-slate-300" : "text-white")}>
                        {title}
                    </p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                    </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed">
                    {message}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-400 border border-slate-700">
                        {category}
                    </span>
                    {data?.action_url && (
                        <a 
                            href={data.action_url} 
                            className="text-xs text-[#BFFF00] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View Details
                        </a>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!is_read && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-slate-700 text-slate-400 hover:text-[#BFFF00]"
                        onClick={() => onMarkRead(id)}
                        title="Mark as read"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                )}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-slate-700 text-slate-400 hover:text-red-400"
                    onClick={() => onDelete(id)}
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default NotificationItem;