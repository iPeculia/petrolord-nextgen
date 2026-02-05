import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const EmailSettingsForm = ({ onChange }) => {
    return (
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP settings and default sender identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Sender Name</Label>
                        <Input defaultValue="Petrolord Admin" onChange={onChange} className="bg-[#0F172A] border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sender Email</Label>
                        <Input defaultValue="noreply@petrolord.com" onChange={onChange} className="bg-[#0F172A] border-slate-700" />
                    </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="font-medium text-white">SMTP Gateway</h3>
                    <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded border border-slate-700">
                        <div className="space-y-0.5">
                            <Label>Use Custom SMTP</Label>
                            <p className="text-xs text-slate-400">Override default Resend integration</p>
                        </div>
                        <Switch onCheckedChange={onChange} />
                    </div>
                </div>

                <div className="pt-4">
                     <Button variant="outline" className="border-slate-700">Send Test Email</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailSettingsForm;