import React, { useState } from 'react';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Download } from 'lucide-react';
import { exportHorizonsToCSV } from '@/modules/geoscience/seismic-interpretation/utils/seismicCalculations';

const HorizonPicker = ({ activeHorizon, setActiveHorizon }) => {
  const { horizons, addHorizon, fileName } = useSeismicStore();
  const [newHorizonName, setNewHorizonName] = useState('');
  const [newHorizonColor, setNewHorizonColor] = useState('#34D399');

  const handleAddHorizon = () => {
    if (newHorizonName.trim()) {
      addHorizon(newHorizonName.trim(), newHorizonColor);
      setNewHorizonName('');
    }
  };

  const handleExport = () => {
    exportHorizonsToCSV(horizons, fileName);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">Horizon Picking</h3>
      <div className="space-y-2">
        <Label htmlFor="new-horizon-name">New Horizon Name</Label>
        <div className="flex gap-2">
          <Input
            id="new-horizon-name"
            value={newHorizonName}
            onChange={(e) => setNewHorizonName(e.target.value)}
            placeholder="e.g., Top Chalk"
          />
          <Input
            type="color"
            value={newHorizonColor}
            onChange={(e) => setNewHorizonColor(e.target.value)}
            className="p-1 h-10 w-12"
          />
          <Button onClick={handleAddHorizon} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Horizons</Label>
        {horizons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No horizons created yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {horizons.map((h) => (
              <div
                key={h.name}
                onClick={() => setActiveHorizon(h.name)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  activeHorizon === h.name ? 'bg-primary/20' : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: h.color }}
                  />
                  <span className="font-medium">{h.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{h.picks.length} picks</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {activeHorizon && (
        <div className="p-2 bg-primary/10 rounded-md text-center text-sm">
          Picking on: <span className="font-bold">{activeHorizon}</span>. Click to deactivate.
        </div>
      )}
      <Button onClick={handleExport} disabled={horizons.length === 0} className="w-full" variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export Horizons (CSV)
      </Button>
    </div>
  );
};

export default HorizonPicker;