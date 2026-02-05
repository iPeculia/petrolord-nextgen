import React from 'react';
import { Settings, Save, RotateCcw, Download, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '../../hooks/useSettings';

const SettingsPanel = ({ open, onOpenChange }) => {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[700px] bg-[#0f172a] border-slate-800 p-0 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#131b2b]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={exportSettings} className="border-slate-700 text-slate-300">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
             <label htmlFor="import-settings">
                <Button variant="outline" size="sm" asChild className="border-slate-700 text-slate-300 cursor-pointer">
                    <span><Upload className="w-4 h-4 mr-2" /> Import</span>
                </Button>
             </label>
             <input type="file" id="import-settings" className="hidden" onChange={(e) => importSettings(e.target.files[0])} accept=".json" />
             
             <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
                </Button>
            </DialogClose>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
            <Tabs defaultValue="general" orientation="vertical" className="flex w-full">
                <div className="w-[200px] bg-[#161e2e] border-r border-slate-800 pt-4">
                    <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-2 w-full">
                        {['General', 'Facility', 'Analysis', 'Export', 'Notifications'].map(tab => (
                            <TabsTrigger 
                                key={tab} 
                                value={tab.toLowerCase()}
                                className="w-full justify-start px-4 py-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1 bg-[#1a1a1a] p-8 overflow-y-auto">
                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-6 mt-0">
                        <h3 className="text-xl font-semibold text-white mb-6">General Preferences</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="text-slate-300">Theme</Label>
                                <Select value={settings.general.theme} onValueChange={(v) => updateSetting('general', 'theme', v)}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                                <div>
                                    <div className="text-slate-200 font-medium">Auto-Save</div>
                                    <div className="text-slate-500 text-xs">Automatically save project changes</div>
                                </div>
                                <Switch 
                                    checked={settings.general.autoSave} 
                                    onCheckedChange={(c) => updateSetting('general', 'autoSave', c)} 
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Facility Settings */}
                    <TabsContent value="facility" className="space-y-6 mt-0">
                        <h3 className="text-xl font-semibold text-white mb-6">Facility Defaults</h3>
                        <div className="grid gap-4 max-w-sm">
                            <div className="grid gap-2">
                                <Label className="text-slate-300">Default Currency</Label>
                                <Select value={settings.facility.defaultCurrency} onValueChange={(v) => updateSetting('facility', 'defaultCurrency', v)}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-slate-300">Default Units</Label>
                                <Select value={settings.facility.defaultUnits} onValueChange={(v) => updateSetting('facility', 'defaultUnits', v)}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="Imperial">Imperial (bpd, psi, F)</SelectItem>
                                        <SelectItem value="Metric">Metric (m3/d, bar, C)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Analysis Settings */}
                    <TabsContent value="analysis" className="space-y-6 mt-0">
                        <h3 className="text-xl font-semibold text-white mb-6">Analysis Parameters</h3>
                        <div className="grid gap-4 max-w-sm">
                            <div className="grid gap-2">
                                <Label className="text-slate-300">Default Discount Rate (%)</Label>
                                <Input 
                                    type="number" 
                                    value={settings.analysis.defaultDiscountRate} 
                                    onChange={(e) => updateSetting('analysis', 'defaultDiscountRate', parseFloat(e.target.value))}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-slate-300">Analysis Horizon (Years)</Label>
                                <Input 
                                    type="number" 
                                    value={settings.analysis.analysisHorizon} 
                                    onChange={(e) => updateSetting('analysis', 'analysisHorizon', parseInt(e.target.value))}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#131b2b] flex justify-between items-center">
            <Button variant="ghost" onClick={resetSettings} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
            </Button>
            <div className="flex gap-2">
                <DialogClose asChild>
                    <Button variant="ghost" className="text-slate-400">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </DialogClose>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;