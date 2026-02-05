import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Moon, Sun } from 'lucide-react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { userSettings, setUserSettings } = useNodalAnalysis();

  const handleUnitChange = (value) => {
    setUserSettings({ units: value });
  };

  const handleThemeChange = (value) => {
    setUserSettings({ theme: value });
  };

  const handleAutoSaveToggle = (checked) => {
    setUserSettings({ autoSave: checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Analysis Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your workspace preferences and calculation defaults.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-slate-300 border-b border-slate-700 pb-1">General Preferences</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="unit-system" className="flex flex-col gap-1">
                <span>Unit System</span>
                <span className="font-normal text-xs text-slate-500">Default units for new analyses</span>
              </Label>
              <Select value={userSettings.units} onValueChange={handleUnitChange}>
                <SelectTrigger id="unit-system" className="w-[140px] bg-slate-900 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="field">Field Units</SelectItem>
                  <SelectItem value="metric">Metric Units</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme-select" className="flex flex-col gap-1">
                <span>Appearance</span>
                <span className="font-normal text-xs text-slate-500">Interface color theme</span>
              </Label>
              <Select value={userSettings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme-select" className="w-[140px] bg-slate-900 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2"><Moon className="w-3 h-3" /> Dark</div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2"><Sun className="w-3 h-3" /> Light</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-slate-300 border-b border-slate-700 pb-1">Data Management</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="autosave" className="flex flex-col gap-1">
                <span>Auto-save Changes</span>
                <span className="font-normal text-xs text-slate-500">Automatically save inputs every 2 minutes</span>
              </Label>
              <Switch 
                id="autosave" 
                checked={userSettings.autoSave}
                onCheckedChange={handleAutoSaveToggle}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
           <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" /> Save Preferences
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;