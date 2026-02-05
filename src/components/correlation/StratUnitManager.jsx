import React from 'react';
import { useStratUnits } from '@/hooks/useWellLogCorrelation';
import { useStratUnitManagement } from '@/hooks/useStratUnitManagement';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import StratUnitEditingDialog from './StratUnitEditingDialog';

const StratUnitManager = ({ projectId }) => {
  const { data: stratUnits, isLoading } = useStratUnits(projectId);
  const {
    isEditing,
    editingUnitData,
    editMode,
    startAddingUnit,
    startEditingUnit,
    cancelEditing,
    saveUnit,
    deleteUnit,
  } = useStratUnitManagement(projectId);

  if (isLoading) {
    return <div className="flex justify-center items-center p-4"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <>
      <div className="space-y-2">
        <h3 className="font-semibold mb-2">Stratigraphic Units</h3>
        <Button onClick={startAddingUnit} className="w-full" variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Unit
        </Button>
        {stratUnits?.map(unit => (
          <div key={unit.id} className="flex items-center justify-between p-2 rounded-md bg-slate-800/70">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: unit.color }}></div>
              <span className="font-medium text-sm">{unit.name}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEditingUnit(unit)} disabled={isEditing}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteUnit(unit.id)} disabled={isEditing}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      
      <StratUnitEditingDialog
        isOpen={isEditing && (editMode === 'add' || editMode === 'edit')}
        onClose={cancelEditing}
        onSave={saveUnit}
        unitData={editingUnitData}
        editMode={editMode}
      />
    </>
  );
};

export default StratUnitManager;