import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWellSelection } from '@/hooks/useWellSelection';
import { Loader2, ArrowRight, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

const WellSelectionDialog = ({ isOpen, onClose, projectId, panelId }) => {
  const {
    availableWells,
    wellsInPanel,
    isLoading,
    reorderWells,
    isUpdating,
  } = useWellSelection(projectId, panelId);

  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelected(JSON.parse(JSON.stringify(wellsInPanel || [])));
    }
  }, [isOpen, wellsInPanel]);

  const filteredAvailableWells = useMemo(() => {
    if (!availableWells) return [];
    const selectedWellboreIds = new Set((localSelected || []).map(w => w.wellbore_id));
    
    return availableWells
        .flatMap(well => well.wellbores.map(wb => ({ ...wb, wellName: well.name, field: well.field })))
        .filter(wb => 
            !selectedWellboreIds.has(wb.id) && 
            wb.wellName.toLowerCase().includes(search.toLowerCase())
        );
  }, [availableWells, localSelected, search]);

  const handleAddWell = (wellboreId) => {
    const wellboreToAdd = availableWells
        .flatMap(w => w.wellbores.map(wb => ({...wb, well: w})))
        .find(wb => wb.id === wellboreId);
    
    if (wellboreToAdd) {
        const newEntry = {
            id: `temp-${Date.now()}`,
            panel_id: panelId,
            wellbore_id: wellboreId,
            order_index: localSelected.length,
            wellbores: {
                ...wellboreToAdd,
                wells: wellboreToAdd.well,
            }
        };
        setLocalSelected(prev => [...prev, newEntry]);
    }
  };

  const handleRemoveWell = (wellboreId) => {
    setLocalSelected(prev => prev.filter(w => w.wellbore_id !== wellboreId));
  };
  
  const moveItem = (wellboreId, direction) => {
    const currentIndex = localSelected.findIndex(w => w.wellbore_id === wellboreId);
    if (currentIndex === -1) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= localSelected.length) return;
    
    const newOrder = [...localSelected];
    const [movedItem] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);
    
    setLocalSelected(newOrder.map((item, index) => ({ ...item, order_index: index })));
  };

  const handleSave = () => {
    reorderWells(localSelected.map(w => w.wellbore_id));
    onClose();
  };

  const renderWellItem = (wellData, isSelected) => {
    let well, wellbore, wellboreId;
    
    if (isSelected) {
        well = wellData.wellbores.wells;
        wellbore = wellData.wellbores;
        wellboreId = wellData.wellbore_id;
    } else {
        well = { name: wellData.wellName };
        wellbore = wellData;
        wellboreId = wellData.id;
    }

    if (!wellboreId || !well || !wellbore) return null;

    return (
      <div key={wellboreId} className="flex items-center justify-between p-2 rounded-md bg-slate-800 hover:bg-slate-700/50">
        <div className="flex items-center gap-2">
          {isSelected && <GripVertical className="h-5 w-5 text-slate-500 cursor-grab" />}
          <div>
            <p className="font-semibold">{well.name}</p>
            <p className="text-xs text-slate-400">{wellbore.name}</p>
          </div>
        </div>
        <div>
          {isSelected ? (
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => moveItem(wellboreId, -1)} disabled={localSelected.findIndex(w => w.wellbore_id === wellboreId) === 0}><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => moveItem(wellboreId, 1)} disabled={localSelected.findIndex(w => w.wellbore_id === wellboreId) === localSelected.length - 1}><ArrowDown className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleRemoveWell(wellboreId)}><X className="h-4 w-4 text-red-500" /></Button>
            </div>
          ) : (
            <Button size="icon" variant="ghost" onClick={() => handleAddWell(wellboreId)}><ArrowRight className="h-4 w-4" /></Button>
          )}
        </div>
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[70vh] flex flex-col bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Add and Order Wells</DialogTitle>
          <DialogDescription>Select wells from the left list to add them to the panel on the right. You can reorder wells in the panel using the arrows.</DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8" />
            <span className="ml-2">Loading wells...</span>
          </div>
        ) : (
          <div className="flex-grow grid grid-cols-2 gap-4 overflow-hidden pt-4">
            {/* Available Wells */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-1">Available Wellbores</h3>
              <Input placeholder="Search wells..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="flex-grow overflow-y-auto space-y-2 p-1 border border-slate-800 rounded-md">
                {filteredAvailableWells.length > 0 ? 
                  filteredAvailableWells.map(wb => renderWellItem(wb, false)) :
                  <p className="p-4 text-center text-slate-400">No more wellbores available.</p>
                }
              </div>
            </div>

            {/* Selected Wells */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-1">Wellbores in Panel</h3>
              <div className="flex-grow overflow-y-auto space-y-2 p-1 border border-slate-700 rounded-md">
                {localSelected && localSelected.length > 0 ? 
                  localSelected.map(pw => renderWellItem(pw, true)) :
                  <p className="p-4 text-center text-slate-400">No wells in panel. Add from the left.</p>
                }
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading || isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WellSelectionDialog;