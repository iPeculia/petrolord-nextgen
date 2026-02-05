import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationPreferences = () => {
    const { preferences, updatePreferences } = useNotifications();
    const { toast } = useToast();
    const [localPrefs, setLocalPrefs] = useState({
        email_notifications: true,
        in_app_notifications: true,
        report_sent_notifications: true,
        report_failed_notifications: true
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (preferences) {
            setLocalPrefs(preferences);
        }
    }, [preferences]);

    const handleToggle = (key) => {
        setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePreferences(localPrefs);
            toast({
                title: "Preferences Saved",
                description: "Your notification settings have been updated.",
                className: "border-[#BFFF00] text-white"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save preferences.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid gap-6">
            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Mail className="h-5 w-5 text-[#BFFF00]" /> Delivery Channels
                    </CardTitle>
                    <CardDescription>Choose how you want to receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-slate-200">Email Notifications</Label>
                            <p className="text-sm text-slate-500">Receive critical alerts via email.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.email_notifications}
                            onCheckedChange={() => handleToggle('email_notifications')}
                            className="data-[state=checked]:bg-[#BFFF00]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-slate-200">In-App Notifications</Label>
                            <p className="text-sm text-slate-500">Show alerts within the dashboard.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.in_app_notifications}
                            onCheckedChange={() => handleToggle('in_app_notifications')}
                            className="data-[state=checked]:bg-[#BFFF00]"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <ShieldAlert className="h-5 w-5 text-orange-400" /> Alert Types
                    </CardTitle>
                    <CardDescription>Customize which events trigger a notification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-slate-200">Report Completions</Label>
                            <p className="text-sm text-slate-500">Notify when generated reports are ready.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.report_sent_notifications}
                            onCheckedChange={() => handleToggle('report_sent_notifications')}
                            className="data-[state=checked]:bg-[#BFFF00]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-slate-200">System Errors</Label>
                            <p className="text-sm text-slate-500">Notify when an operation fails.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.report_failed_notifications}
                            onCheckedChange={() => handleToggle('report_failed_notifications')}
                            className="data-[state=checked]:bg-[#BFFF00]"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[120px]"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default NotificationPreferences;