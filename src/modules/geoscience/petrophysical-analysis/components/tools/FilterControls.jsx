import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';

const FilterControls = () => {
  const { activeAnalysisId, analyses, updateActiveAnalysis } = usePetrophysicalStore();

  const filters = activeAnalysisId ? analyses[activeAnalysisId]?.filters || {} : {};

  const handleFilterChange = (key, value) => {
    if (!activeAnalysisId) return;
    const currentFilters = analyses[activeAnalysisId]?.filters || {};
    updateActiveAnalysis({ filters: { ...currentFilters, [key]: value } });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="depthMin">Min Depth</Label>
          <Input
            id="depthMin"
            type="number"
            value={filters.depthMin || ''}
            onChange={(e) => handleFilterChange('depthMin', e.target.value)}
            placeholder="e.g., 1000"
            disabled={!activeAnalysisId}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depthMax">Max Depth</Label>
          <Input
            id="depthMax"
            type="number"
            value={filters.depthMax || ''}
            onChange={(e) => handleFilterChange('depthMax', e.target.value)}
            placeholder="e.g., 2000"
            disabled={!activeAnalysisId}
          />
        </div>
        <p className="text-sm text-muted-foreground">Log-specific filters will be added here.</p>
      </CardContent>
    </Card>
  );
};

export default FilterControls;