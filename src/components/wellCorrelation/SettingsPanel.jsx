import React from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Sliders, Grid, MoveVertical } from 'lucide-react';

const SettingsPanel = () => {
    const { state, actions } = useWellCorrelation();
    const { settings } = state;

    const updateSetting = (key, value) => {
        actions.updateSettings({ [key]: value });
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800">
            <div className="p-4 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Settings size={14} className="text-[#CCFF00]" />
                    Display Settings
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                
                {/* Scale & Units */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <MoveVertical size={12} /> Scale & Units
                    </h4>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-300">Vertical Scale (pixels/unit)</span>
                            <span className="font-mono text-[#CCFF00]">{settings.verticalScale || 5}</span>
                        </div>
                        <Slider 
                            value={[settings.verticalScale || 5]} 
                            min={1} 
                            max={20} 
                            step={1} 
                            onValueChange={([val]) => updateSetting('verticalScale', val)}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">Depth Unit</Label>
                        <Select 
                            value={settings.depthUnit || 'M'} 
                            onValueChange={(val) => updateSetting('depthUnit', val)}
                        >
                            <SelectTrigger className="h-8 bg-[#020617] border-slate-700 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                <SelectItem value="M">Meters (MD)</SelectItem>
                                <SelectItem value="FT">Feet (MD)</SelectItem>
                                <SelectItem value="TVD">TVD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Appearance */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Grid size={12} /> Track Appearance
                    </h4>

                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300">Show Grid Lines</Label>
                        <Switch 
                            checked={settings.showGrid ?? true}
                            onCheckedChange={(val) => updateSetting('showGrid', val)}
                            className="data-[state=checked]:bg-[#CCFF00]"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-300">Track Width (px)</span>
                            <span className="font-mono text-[#CCFF00]">{settings.trackWidth || 200}</span>
                        </div>
                        <Slider 
                            value={[settings.trackWidth || 200]} 
                            min={100} 
                            max={400} 
                            step={10} 
                            onValueChange={([val]) => updateSetting('trackWidth', val)}
                        />
                    </div>
                </div>

                 <div className="h-px bg-slate-800" />

                 {/* Analysis */}
                 <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Sliders size={12} /> Automation
                    </h4>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300">Auto-Suggest Markers</Label>
                        <Switch 
                            checked={settings.autoSuggest ?? true}
                            onCheckedChange={(val) => updateSetting('autoSuggest', val)}
                            className="data-[state=checked]:bg-[#CCFF00]"
                        />
                    </div>
                 </div>

            </div>
        </div>
    );
};

export default SettingsPanel;