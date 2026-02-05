import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';
import { useToast } from '@/components/ui/use-toast';
import { pressureTransientService } from '@/services/pressureTransientService';

// Components
import WellsList from '../components/WellsList';
import WellForm from '../components/WellForm';
import ReservoirForm from '../components/ReservoirForm';
import FluidForm from '../components/FluidForm';
import ProgressIndicator from '../components/ProgressIndicator';
import SmartGuidance from '../components/SmartGuidance';

const WellsTab = ({ onNewWell: onNewWellProp }) => {
  const { wells, addWell, updateWell, setCurrentWell } = usePressureTransient();
  const { toast } = useToast();
  
  // View State: 'list', 'create', 'edit'
  const [view, setView] = useState('list');
  const [selectedWell, setSelectedWell] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Well, 1: Reservoir, 2: Fluid
  
  // Auxiliary Data for selected well
  const [reservoirData, setReservoirData] = useState(null);
  const [fluidData, setFluidData] = useState(null);

  const steps = [
    { id: 'well', label: 'Well Setup' },
    { id: 'reservoir', label: 'Reservoir Properties' },
    { id: 'fluid', label: 'Fluid Properties' }
  ];

  // If a well is selected for editing, fetch its related data
  useEffect(() => {
    if (selectedWell && view === 'edit') {
      const fetchData = async () => {
        try {
          const res = await pressureTransientService.getReservoirByWell(selectedWell.well_id);
          const flu = await pressureTransientService.getFluidByWell(selectedWell.well_id);
          setReservoirData(res);
          setFluidData(flu);
        } catch (e) {
          console.error("Failed to fetch well details", e);
        }
      };
      fetchData();
    }
  }, [selectedWell, view]);

  // If external prop triggers new well (from header button)
  useEffect(() => {
    if (onNewWellProp && view === 'list') {
        // This effect might be redundant if we just handle the prop in parent, 
        // but for now, let's keep internal state control
    }
  }, [onNewWellProp]);

  // --- Handlers ---

  const handleCreateWell = async (data) => {
    try {
      const newWell = await addWell(data);
      setSelectedWell(newWell);
      setCurrentWell(newWell);
      setCurrentStep(1); // Move to Reservoir
      setView('edit'); // Switch to edit mode for the flow
      toast({ title: "Well Created", description: "Proceeding to reservoir setup." });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateWell = async (data) => {
    try {
      const updated = await updateWell(selectedWell.well_id, data);
      setSelectedWell(updated);
      toast({ title: "Well Updated", description: "Changes saved successfully." });
      // Don't auto-advance on update, user might just be editing
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveReservoir = async (data) => {
    try {
        if (reservoirData) {
            await pressureTransientService.updateReservoir(reservoirData.reservoir_id, data);
        } else {
            await pressureTransientService.createReservoir({ ...data, well_id: selectedWell.well_id });
        }
        // Refresh local data
        const res = await pressureTransientService.getReservoirByWell(selectedWell.well_id);
        setReservoirData(res);
        
        toast({ title: "Reservoir Saved", description: "Properties recorded." });
        if (currentStep === 1) setCurrentStep(2);
    } catch (e) {
        toast({ title: "Error", description: "Failed to save reservoir data", variant: "destructive" });
    }
  };

  const handleSaveFluid = async (data) => {
    try {
        if (fluidData) {
            await pressureTransientService.updateFluid(fluidData.fluid_id, data);
        } else {
            await pressureTransientService.createFluid({ ...data, well_id: selectedWell.well_id });
        }
         // Refresh local data
         const flu = await pressureTransientService.getFluidByWell(selectedWell.well_id);
         setFluidData(flu);

        toast({ title: "Fluid Saved", description: "Properties recorded." });
        if (currentStep === 2) {
             // Complete
             setView('list');
             toast({ title: "Setup Complete", description: "Well fully configured." });
             setCurrentStep(0);
        }
    } catch (e) {
        toast({ title: "Error", description: "Failed to save fluid data", variant: "destructive" });
    }
  };

  const startNewWell = () => {
    setSelectedWell(null);
    setReservoirData(null);
    setFluidData(null);
    setCurrentStep(0);
    setView('create');
  };

  const startEditWell = (well) => {
    setSelectedWell(well);
    setCurrentWell(well);
    setCurrentStep(0); // Or determine based on data completeness
    setView('edit');
  };

  const goBackToList = () => {
    setView('list');
    setSelectedWell(null);
  };

  // --- Render ---

  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-2xl font-bold text-white">Wells</h2>
            <p className="text-slate-400">Manage your wells and reservoir properties</p>
            </div>
            <Button onClick={startNewWell} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Well
            </Button>
        </div>
        
        <WellsList 
            onEdit={startEditWell}
            onAnalyze={(well) => { setCurrentWell(well); toast({title: "Well Selected", description: `Active: ${well.name}`}); }}
            onNew={startNewWell}
        />
      </div>
    );
  }

  // Create / Edit View
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={goBackToList} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">{view === 'create' ? 'Create New Well' : `Edit: ${selectedWell?.name}`}</h2>
          <p className="text-slate-400">Step {currentStep + 1} of 3</p>
        </div>
      </div>

      <ProgressIndicator steps={steps} currentStep={currentStep} completedSteps={[0, 1, 2].filter(s => s < currentStep)} />
      
      <SmartGuidance 
        currentStep={currentStep} 
        onAction={() => {}} // Internal action usually
      />

      <div className="mt-6">
        {currentStep === 0 && (
          <WellForm 
            initialData={selectedWell} 
            onSave={view === 'create' ? handleCreateWell : handleUpdateWell} 
            onCancel={goBackToList} 
          />
        )}

        {currentStep === 1 && (
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-slate-400">Back to Well</Button>
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="text-slate-400">Skip to Fluids</Button>
              </div>
              <ReservoirForm 
                initialData={reservoirData}
                onSave={handleSaveReservoir}
                onCancel={goBackToList}
              />
           </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-slate-400">Back to Reservoir</Button>
              </div>
              <FluidForm 
                initialData={fluidData}
                onSave={handleSaveFluid}
                onCancel={goBackToList}
              />
            </div>
        )}
      </div>
    </div>
  );
};

export default WellsTab;