import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const ImportSettingsForm = ({ onChange }) => {
    return (
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader>
                <CardTitle>Import Policies</CardTitle>
                <CardDescription>Manage constraints for bulk data operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Max Records Per Batch</Label>
                        <Input type="number" defaultValue="5000" onChange={onChange} className="bg-[#0F172A] border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Retention (Days)</Label>
                        <Input type="number" defaultValue="30" onChange={onChange} className="bg-[#0F172A] border-slate-700" />
                    </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded border border-slate-700">
                    <div className="space-y-0.5">
                        <Label>Require Admin Approval</Label>
                        <p className="text-xs text-slate-400">For imports larger than 1000 records</p>
                    </div>
                    <Switch defaultChecked onCheckedChange={onChange} />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded border border-slate-700">
                    <div className="space-y-0.5">
                        <Label>Auto-Retry Failed Records</Label>
                        <p className="text-xs text-slate-400">Attempt to re-process network errors automatically</p>
                    </div>
                    <Switch onCheckedChange={onChange} />
                </div>
            </CardContent>
        </Card>
    );
};

export default ImportSettingsForm;