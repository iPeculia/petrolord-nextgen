import React from 'react';
import { useMaterialBalanceStore } from '@/modules/reservoir-engineering/store/materialBalanceStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const InitialConditionsPanel = ({ disabled }) => {
  const { initialConditions, setInitialCondition } = useMaterialBalanceStore();

  const handleNumericChange = (key, value) => {
    const numValue = value === '' ? null : parseFloat(value);
    setInitialCondition(key, numValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="initialPressure">Initial Pressure (psi)</Label>
        <Input
          id="initialPressure"
          type="number"
          value={initialConditions.initialPressure ?? ''}
          onChange={(e) => handleNumericChange('initialPressure', e.target.value)}
          placeholder="e.g., 4500"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="initialWaterSaturation">Initial Water Saturation (Swi)</Label>
        <Input
          id="initialWaterSaturation"
          type="number"
          step="0.01"
          value={initialConditions.initialWaterSaturation ?? ''}
          onChange={(e) => handleNumericChange('initialWaterSaturation', e.target.value)}
          placeholder="e.g., 0.2"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="formationCompressibility">Formation Compressibility (Cf)</Label>
        <Input
          id="formationCompressibility"
          type="number"
          step="1e-7"
          value={initialConditions.formationCompressibility ?? ''}
          onChange={(e) => handleNumericChange('formationCompressibility', e.target.value)}
          placeholder="e.g., 3e-6"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="hasGasCap"
          checked={initialConditions.hasGasCap}
          onCheckedChange={(checked) => setInitialCondition('hasGasCap', checked)}
          disabled={disabled}
        />
        <Label htmlFor="hasGasCap">Has Gas Cap</Label>
      </div>
      {initialConditions.hasGasCap && (
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="gasCapRatio">Gas Cap Ratio (m)</Label>
          <Input
            id="gasCapRatio"
            type="number"
            step="0.1"
            value={initialConditions.gasCapRatio ?? ''}
            onChange={(e) => handleNumericChange('gasCapRatio', e.target.value)}
            placeholder="Ratio of gas cap to oil zone volume"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default InitialConditionsPanel;