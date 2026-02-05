import React from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import { Button } from '@/components/ui/button';
import { Play, Download, Settings, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const QCToolbar = () => {
  const { runQCChecks, isRunning, settings, updateSettings, qcResults } = useQC();

  const hasResults = Object.keys(qcResults).length > 0;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
      <div className="flex items-center gap-3">
         <div className="p-2 bg-emerald-900/30 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
         </div>
         <div>
             <h2 className="text-sm font-semibold text-white">Quality Control</h2>
             <p className="text-xs text-slate-400">Automated data validation & integrity checks</p>
         </div>
      </div>

      <div className="flex items-center gap-2">
         
         {/* Settings Dialog */}
         <Dialog>
             <DialogTrigger asChild>
                 <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800">
                     <Settings className="w-4 h-4 mr-2" /> Configure
                 </Button>
             </DialogTrigger>
             <DialogContent className="bg-slate-900 border-slate-800 text-white">
                 <DialogHeader>
                     <DialogTitle>QC Parameters</DialogTitle>
                     <DialogDescription className="text-slate-400">Adjust sensitivity thresholds for automated detection.</DialogDescription>
                 </DialogHeader>
                 <div className="space-y-6 py-4">
                     <div className="space-y-2">
                         <div className="flex justify-between">
                             <Label>Z-Score Threshold (Outliers)</Label>
                             <span className="text-sm text-slate-400">{settings.zScoreThreshold}σ</span>
                         </div>
                         <Slider 
                            value={[settings.zScoreThreshold]} 
                            min={1.0} max={5.0} step={0.1}
                            onValueChange={([val]) => updateSettings({ zScoreThreshold: val })}
                         />
                     </div>
                     <div className="flex items-center justify-between">
                         <Label>Detect Spikes</Label>
                         <Switch 
                            checked={settings.checkForSpikes}
                            onCheckedChange={(val) => updateSettings({ checkForSpikes: val })}
                         />
                     </div>
                 </div>
             </DialogContent>
         </Dialog>

         {/* Run Button */}
         <Button 
            onClick={runQCChecks} 
            disabled={isRunning}
            className={`${isRunning ? 'bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-500'} text-white transition-all`}
         >
            {isRunning ? (
                <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Running...
                </>
            ) : (
                <>
                    <Play className="w-4 h-4 mr-2" /> Run Analysis
                </>
            )}
         </Button>
      </div>
    </div>
  );
};

export default QCToolbar;