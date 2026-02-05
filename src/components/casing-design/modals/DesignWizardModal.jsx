import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Steps } from '@/components/ui/steps';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWells, useCasingOperations } from '@/hooks/useCasingDesign';
import { useDesignContext } from '../context/DesignContextProvider';

// Sub-components
import WizardHeader from './wizard/WizardHeader';
import WizardFooter from './wizard/WizardFooter';

// Steps
import BasicInformationStep from '../forms/BasicInformationStep';
import SectionManagementStep from '../sections/SectionManagementStep';
import ReviewStep from '../sections/ReviewStep';

const DesignWizardModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditMode = !!initialData;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { activeWell, activeProject } = useDesignContext();
  const { wells } = useWells();
  const { saveFullDesign } = useCasingOperations();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Casing',
    od: '',
    well_id: '',
    description: '',
    project_id: null
  });

  const [sections, setSections] = useState([]);
  const [originalSections, setOriginalSections] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
            id: initialData.design.id,
            name: initialData.design.name || '',
            type: initialData.design.type || 'Casing',
            od: initialData.design.od || '',
            well_id: initialData.design.well_id || '',
            description: initialData.design.description || '',
            project_id: initialData.design.project_id
        });
        setSections(initialData.sections ? [...initialData.sections] : []);
        setOriginalSections(initialData.sections ? [...initialData.sections] : []);
      } else {
        setFormData({
            name: '',
            type: 'Casing',
            od: '',
            well_id: activeWell ? activeWell.id : '',
            description: '',
            project_id: activeProject ? activeProject.id : null
        });
        setSections([]);
        setOriginalSections([]);
        setStep(1);
      }
    }
  }, [isOpen, initialData, activeWell, activeProject]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = () => {
    return formData.name.trim() !== '' && 
           formData.well_id !== '' && 
           Number(formData.od) > 0;
  };

  const isStep2Valid = () => {
    if (sections.length === 0) return false;
    const sorted = [...sections].sort((a,b) => a.top_depth - b.top_depth);
    for(let i=0; i<sorted.length; i++) {
        if(Number(sorted[i].top_depth) >= Number(sorted[i].bottom_depth)) return false;
        if(i < sorted.length - 1) {
            if(Number(sorted[i].bottom_depth) > Number(sorted[i+1].top_depth)) return false;
        }
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        let finalProjectID = formData.project_id;
        
        if (!finalProjectID && activeProject) {
            finalProjectID = activeProject.id;
        }

        if (!finalProjectID && formData.well_id) {
            const well = wells.find(w => w.id === formData.well_id);
            if (well) finalProjectID = well.project_id;
        }

        await saveFullDesign(
            { ...formData, project_id: finalProjectID }, 
            sections, 
            isEditMode, 
            originalSections
        );
        
        onSuccess();
        onClose();
    } catch (error) {
        console.error("DesignWizard submission failed", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F172A] border-slate-700 text-white sm:max-w-[850px] h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        <WizardHeader isEditMode={isEditMode} name={initialData?.design?.name} />

        <div className="px-12 py-6 bg-slate-900/50 border-b border-slate-800">
          <Steps 
            steps={[{ title: "Basic Info" }, { title: "Sections" }, { title: "Review" }]} 
            currentStep={step} 
          />
        </div>

        <ScrollArea className="flex-1 bg-[#0F172A]">
            <div className="px-8 py-6">
                {step === 1 && (
                    <BasicInformationStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        wells={wells}
                        isEditMode={isEditMode}
                    />
                )}
                {step === 2 && (
                    <SectionManagementStep 
                        sections={sections}
                        setSections={setSections}
                    />
                )}
                {step === 3 && (
                    <ReviewStep 
                        formData={formData}
                        sections={sections}
                        wells={wells}
                        initialData={initialData}
                        originalSections={originalSections}
                    />
                )}
            </div>
        </ScrollArea>

        <WizardFooter 
          onClose={onClose}
          step={step}
          setStep={setStep}
          isStep1Valid={isStep1Valid()}
          isStep2Valid={isStep2Valid()}
          isEditMode={isEditMode}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DesignWizardModal;