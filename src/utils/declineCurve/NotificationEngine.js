import { toast } from '@/components/ui/use-toast';

/**
 * Notification Engine for DCA
 * Handles in-app alerts and notifications for background processes.
 */

class NotificationEngine {
    constructor() {
        this.notifications = [
            { id: 1, type: 'info', title: 'System Ready', message: 'DCA Module initialized successfully.', read: false, time: new Date().toISOString() }
        ];
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this.notifications);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb([...this.notifications]));
    }

    add(type, title, message) {
        const newNotification = {
            id: Date.now(),
            type, // 'info', 'success', 'warning', 'error'
            title,
            message,
            read: false,
            time: new Date().toISOString()
        };
        this.notifications.unshift(newNotification);
        this.notifyListeners();
        
        // Also trigger system toast
        toast({
            title: title,
            description: message,
            variant: type === 'error' ? 'destructive' : 'default',
        });
    }

    markAsRead(id) {
        this.notifications = this.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        );
        this.notifyListeners();
    }

    clearAll() {
        this.notifications = [];
        this.notifyListeners();
    }
}

export const notificationEngine = new NotificationEngine();