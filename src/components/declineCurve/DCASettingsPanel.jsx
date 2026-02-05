import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DCASettingsPanel = () => {
    const { toast } = useToast();

    const handleSave = () => {
        toast({ title: "Settings Saved", description: "Preferences updated successfully." });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300">General Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <Label className="text-slate-400">Default Units</Label>
                        <Select defaultValue="imperial">
                            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="imperial">Imperial (bbl, mcf)</SelectItem>
                                <SelectItem value="metric">Metric (m3)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <Label className="text-slate-400">Date Format</Label>
                        <Select defaultValue="iso">
                            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                                <SelectItem value="us">MM/DD/YYYY</SelectItem>
                                <SelectItem value="eu">DD/MM/YYYY</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-slate-300">Auto-Save Projects</Label>
                            <p className="text-xs text-slate-500">Automatically save changes to local storage</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300">Analysis Defaults</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <Label className="text-slate-400">Default Economic Limit (Oil)</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" defaultValue={5} className="bg-slate-950 border-slate-700 w-24" />
                            <span className="text-xs text-slate-500">bbl/d</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <Label className="text-slate-400">Default Max Duration</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" defaultValue={3650} className="bg-slate-950 border-slate-700 w-24" />
                            <span className="text-xs text-slate-500">days</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-slate-300">Enable Tapering by Default</Label>
                            <p className="text-xs text-slate-500">Switch hyperbolic to exponential after 5 years</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save Settings
                </Button>
            </div>
        </div>
    );
};

export default DCASettingsPanel;