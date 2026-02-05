import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const DataValidationSummary = () => {
  const { currentFacility, processUnits, productionProfiles } = useFacilityMasterPlanner();

  if (!currentFacility) return null;

  const errors = [];
  const warnings = [];

  // Logic checks
  const totalUnitsCapacity = processUnits.reduce((acc, u) => acc + (u.design_capacity_bpd || 0), 0); // Simplified check logic
  
  if (processUnits.length > 0 && totalUnitsCapacity > currentFacility.design_capacity_oil_bpd * 2) { // Just a heuristic
      warnings.push("Total unit capacity significantly exceeds facility design.");
  }

  // Check Schedule vs Design
  if (productionProfiles.length > 0) {
      const maxProd = Math.max(...productionProfiles.map(p => p.oil_rate_bpd));
      if (maxProd > currentFacility.design_capacity_oil_bpd) {
          errors.push(`Peak production (${(maxProd/1000).toFixed(1)}k bpd) exceeds facility design (${(currentFacility.design_capacity_oil_bpd/1000).toFixed(0)}k bpd).`);
      }
  }

  if (errors.length === 0 && warnings.length === 0) {
      return (
          <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-400">System validation passed. No critical issues.</span>
          </div>
      );
  }

  return (
    <div className="space-y-2 mt-4">
        {errors.map((err, i) => (
            <div key={i} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-xs text-red-300">{err}</span>
            </div>
        ))}
        {warnings.map((warn, i) => (
             <div key={i} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-xs text-yellow-300">{warn}</span>
            </div>
        ))}
    </div>
  );
};

export default DataValidationSummary;