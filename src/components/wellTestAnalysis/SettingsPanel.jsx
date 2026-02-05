import React from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { state, dispatch } = useWellTestAnalysisContext();
  const { appSettings, plotSettings } = state;

  const updateAppSetting = (key, value) => {
    dispatch({ type: 'UPDATE_APP_SETTINGS', payload: { [key]: value } });
  };

  const updatePlotSetting = (key, value) => {
    dispatch({ type: 'UPDATE_PLOT_SETTINGS', payload: { [key]: value } });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-slate-950 border-l border-slate-800 text-white w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-white">Analysis Settings</SheetTitle>
          <SheetDescription>Configure global preferences and calculation defaults.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
            {/* General Preferences */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-blue-400">General Preferences</h4>
                <div className="flex items-center justify-between">
                    <Label>Unit System</Label>
                    <Select 
                        value={appSettings.unitSystem} 
                        onValueChange={(val) => updateAppSetting('unitSystem', val)}
                    >
                        <SelectTrigger className="w-[140px] h-8 bg-slate-900 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="field">Field Units</SelectItem>
                            <SelectItem value="si">SI Units</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <Label>Show Tooltips</Label>
                    <Switch 
                        checked={appSettings.showTooltips}
                        onCheckedChange={(val) => updateAppSetting('showTooltips', val)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label>Auto-Save Project</Label>
                    <Switch 
                        checked={appSettings.autoSave}
                        onCheckedChange={(val) => updateAppSetting('autoSave', val)}
                    />
                </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Plot Defaults */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-blue-400">Plot Visualization</h4>
                <div className="flex items-center justify-between">
                    <Label>Show Derivative by Default</Label>
                    <Switch 
                        checked={plotSettings.showDerivative}
                        onCheckedChange={(val) => updatePlotSetting('showDerivative', val)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label>Use Log-Log Scale</Label>
                    <Switch 
                        checked={plotSettings.logScale}
                        onCheckedChange={(val) => updatePlotSetting('logScale', val)}
                    />
                </div>
                 <div className="flex items-center justify-between">
                    <Label>Show Flow Regimes</Label>
                    <Switch 
                        checked={plotSettings.showRegimes}
                        onCheckedChange={(val) => updatePlotSetting('showRegimes', val)}
                    />
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;