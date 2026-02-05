import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import SectionInput from './SectionInput';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SectionManager = () => {
  const { geometryState, geometryActions } = useWellPlanningDesign();
  const { sections } = geometryState;

  const addSection = () => {
    const lastSection = sections[sections.length - 1];
    geometryActions.addSection({
      id: uuidv4(),
      name: `Section ${sections.length + 1}`,
      type: 'Hold',
      length: 1000,
      inclination: lastSection ? lastSection.inclination : 0,
      azimuth: lastSection ? lastSection.azimuth : 0,
      holeSize: lastSection ? lastSection.holeSize : 12.25
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#e0e0e0]">Well Sections</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={addSection}
          className="h-7 text-xs border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Section
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <SectionInput 
            key={section.id} 
            section={section} 
            onChange={geometryActions.updateSection}
            onDelete={geometryActions.deleteSection}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionManager;