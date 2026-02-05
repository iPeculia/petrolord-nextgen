import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

const NotificationSystemPage = () => {
    const [settings, setSettings] = useState({
        email_critical: true,
        email_marketing: false,
        push_new_data: true,
        sms_alerts: true
    });

    const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white">
            <h1 className="text-3xl font-bold">Notification Center</h1>
            
            <div className="grid grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5" /> Email Preferences</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-200">Critical Alerts</div>
                                <div className="text-sm text-slate-500">System outages and security warnings.</div>
                            </div>
                            <Switch checked={settings.email_critical} onCheckedChange={() => toggle('email_critical')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-200">Weekly Digests</div>
                                <div className="text-sm text-slate-500">Summary of project activities.</div>
                            </div>
                            <Switch checked={settings.email_marketing} onCheckedChange={() => toggle('email_marketing')} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-white flex items-center gap-2"><Smartphone className="w-5 h-5" /> Push & SMS</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-200">New Data Available</div>
                                <div className="text-sm text-slate-500">Push notification when imports finish.</div>
                            </div>
                            <Switch checked={settings.push_new_data} onCheckedChange={() => toggle('push_new_data')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-200">Emergency SMS</div>
                                <div className="text-sm text-slate-500">High priority operational alerts.</div>
                            </div>
                            <Switch checked={settings.sms_alerts} onCheckedChange={() => toggle('sms_alerts')} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NotificationSystemPage;