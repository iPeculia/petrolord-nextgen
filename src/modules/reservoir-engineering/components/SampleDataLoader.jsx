import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { getAllScenarios } from '@/modules/reservoir-engineering/data/sampleData';
import { Loader2 } from 'lucide-react';

const SampleDataLoader = ({ onDataLoad, isLoading }) => {
  const [selectedScenario, setSelectedScenario] = useState('solution_gas_drive');
  const scenarios = getAllScenarios();

  const handleLoad = () => {
    if (selectedScenario) {
      onDataLoad(selectedScenario);
    }
  };

  const selectedScenarioDetails = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-grow w-full sm:w-auto">
        <Select onValueChange={setSelectedScenario} value={selectedScenario}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sample scenario" />
          </SelectTrigger>
          <SelectContent>
            {scenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedScenarioDetails && (
            <p className="text-sm text-gray-400 mt-2">{selectedScenarioDetails.description}</p>
        )}
      </div>
      <Button onClick={handleLoad} disabled={isLoading || !selectedScenario} className="w-full sm:w-auto">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Load Scenario
      </Button>
    </div>
  );
};

export default SampleDataLoader;