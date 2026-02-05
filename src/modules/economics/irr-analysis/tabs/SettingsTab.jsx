import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

const SettingsTab = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Module Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Configure global parameters and defaults for your analysis.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      <Card className="bg-[#1E293B] border-slate-700">
        <CardHeader>
            <CardTitle className="text-white">Default Financial Parameters</CardTitle>
            <CardDescription>These values will be applied to new projects automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-slate-300">Base Discount Rate (%)</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" defaultValue="10.0" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Inflation Rate (%)</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" defaultValue="2.5" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Corporate Tax Rate (%)</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" defaultValue="21.0" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Currency</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" defaultValue="USD ($)" />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1E293B] border-slate-700">
        <CardHeader>
            <CardTitle className="text-white">Calculation Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base text-slate-200">Mid-Year Discounting</Label>
                    <p className="text-sm text-slate-500">Apply discounting to the middle of the period instead of end-of-period.</p>
                </div>
                <Switch />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base text-slate-200">Include Terminal Value</Label>
                    <p className="text-sm text-slate-500">Calculate and include terminal value at end of project life.</p>
                </div>
                <Switch defaultChecked />
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;