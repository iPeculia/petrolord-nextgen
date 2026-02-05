import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useArtificialLift } from '../context/ArtificialLiftContext';

const DataValidationSummary = () => {
  const { currentWell, getReservoirProperties, getProductionData } = useArtificialLift();
  
  if (!currentWell) return null;

  const reservoir = getReservoirProperties(currentWell.well_id);
  const production = getProductionData(currentWell.well_id);

  const errors = [];
  if (!reservoir) errors.push("Reservoir properties are missing");
  if (!production) errors.push("Production data is missing");
  
  // Example specific checks
  if (currentWell.tubing_id >= currentWell.casing_id) errors.push("Tubing ID must be smaller than Casing ID");
  if (currentWell.perforation_depth > currentWell.depth_tvd) errors.push("Perforation depth cannot exceed TVD");

  if (errors.length === 0) {
      return (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                  <h4 className="text-sm font-medium text-emerald-400">Data Validated</h4>
                  <p className="text-xs text-emerald-500/80 mt-1">All necessary data for design seems to be present.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
        <div>
            <h4 className="text-sm font-medium text-red-400">Data Validation Issues</h4>
            <ul className="mt-1 space-y-1">
                {errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-300">• {err}</li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default DataValidationSummary;