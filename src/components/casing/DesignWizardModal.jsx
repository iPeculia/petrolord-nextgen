import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useWells, useCasingOperations } from '@/hooks/useCasingDesign';
import { Steps } from '@/components/ui/steps';
import SectionEditor from './SectionEditor';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const DesignWizardModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditMode = !!initialData;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { wells } = useWells();
  const { saveFullDesign } = useCasingOperations();
  
  // State for Step 1: Basic Info
  const [formData, setFormData] = useState({
    name: '',
    type: 'Casing',
    od: '',
    well_id: '',
    description: '',
    project_id: null
  });

  // State for Step 2: Sections
  const [sections, setSections] = useState([]);
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Original sections for diffing (only in edit mode)
  const [originalSections, setOriginalSections] = useState([]);

  // Load initial data
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        id: initialData.design.id,
        name: initialData.design.name,
        type: initialData.design.type,
        od: initialData.design.od,
        well_id: initialData.design.well_id,
        description: initialData.design.description || '',
        project_id: initialData.design.project_id
      });
      setSections([...initialData.sections]);
      setOriginalSections([...initialData.sections]);
    } else if (isOpen && !initialData) {
      // Reset for create mode
      setFormData({
        name: '',
        type: 'Casing',
        od: '',
        well_id: '',
        description: '',
        project_id: null
      });
      setSections([]);
      setOriginalSections([]);
      setStep(1);
    }
  }, [isOpen, initialData]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Step 1 Validation ---
  const isStep1Valid = () => {
    return formData.name && formData.od && formData.well_id;
  };

  // --- Step 2 Logic ---
  const handleAddSection = () => {
    setEditingSection(null);
    setSectionEditorOpen(true);
  };

  const handleEditSection = (section, index) => {
    setEditingSection({ ...section, index }); // Keep track of index for updating
    setSectionEditorOpen(true);
  };

  const handleDeleteSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleSaveSection = (sectionData) => {
    if (editingSection) {
      const newSections = [...sections];
      newSections[editingSection.index] = sectionData;
      setSections(newSections);
    } else {
      // Create temporary ID for tracking
      const newSection = { ...sectionData, id: `temp-${Date.now()}` };
      setSections([...sections, newSection]);
    }
  };

  const isStep2Valid = () => {
    // Basic validation: at least one section? (Prompt says required)
    if (sections.length === 0) return false;
    
    // Check overlaps or gaps (Prompt: "Sections must not overlap")
    // Let's sort sections by top depth just in case
    const sortedSections = [...sections].sort((a, b) => a.top_depth - b.top_depth);
    
    for (let i = 0; i < sortedSections.length; i++) {
        // Top must be < Bottom
        if (sortedSections[i].top_depth >= sortedSections[i].bottom_depth) return false;
        
        // Check overlap with next
        if (i < sortedSections.length - 1) {
            if (sortedSections[i].bottom_depth > sortedSections[i+1].top_depth) return false;
        }
    }
    return true;
  };

  // --- Calculations ---
  const totalDepth = sections.reduce((max, s) => Math.max(max, s.bottom_depth), 0);
  const totalWeight = sections.reduce((sum, s) => sum + ((s.bottom_depth - s.top_depth) * s.weight), 0);

  // --- Submit ---
  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Ensure project_id is set if creating new
        const finalProjectID = formData.project_id || wells.find(w => w.id === formData.well_id)?.project_id;
        
        await saveFullDesign(
            { ...formData, project_id: finalProjectID }, 
            sections, 
            isEditMode, 
            originalSections
        );
        onSuccess();
        onClose();
    } catch (error) {
        // Handled by hook
    } finally {
        setLoading(false);
    }
  };

  const detectChanges = () => {
      if (!isEditMode) return [];
      const changes = [];
      if (formData.name !== initialData.design.name) changes.push('Design Name');
      if (formData.od != initialData.design.od) changes.push('Outer Diameter');
      if (sections.length !== originalSections.length) changes.push('Section Count');
      // Simple check for now
      return changes;
  };

  const changes = detectChanges();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F172A] border-slate-700 text-white sm:max-w-[800px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-800">
          <DialogTitle>{isEditMode ? 'Edit Design Case' : 'Create New Design Case'}</DialogTitle>
          <DialogDescription className="text-slate-400">
             {isEditMode ? `Editing: ${initialData.design.name}` : 'Initialize a new casing or tubing string configuration.'}
          </DialogDescription>
        </DialogHeader>

        {/* Wizard Steps Indicator */}
        <div className="px-12 py-6 bg-slate-900/50">
          <Steps 
            steps={[{ title: "Basic Info" }, { title: "Sections" }, { title: "Review" }]} 
            currentStep={step} 
          />
        </div>

        {/* Wizard Content Area */}
        <ScrollArea className="flex-1 px-6 py-4">
            {step === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-slate-300">Design Name <span className="text-red-400">*</span></Label>
                            <Input 
                                id="name" 
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                placeholder="e.g. Production Casing Run 1"
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="well" className="text-slate-300">Well Assignment <span className="text-red-400">*</span></Label>
                            <Select 
                                value={formData.well_id} 
                                onValueChange={(val) => updateFormData('well_id', val)}
                                disabled={isEditMode} // Usually well assignment shouldn't change easily
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Select Well" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-300">String Type</Label>
                            <RadioGroup 
                                value={formData.type} 
                                onValueChange={(val) => updateFormData('type', val)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Casing" id="r-casing" className="border-slate-500 text-[#BFFF00]" />
                                    <Label htmlFor="r-casing">Casing</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Tubing" id="r-tubing" className="border-slate-500 text-[#BFFF00]" />
                                    <Label htmlFor="r-tubing">Tubing</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="od" className="text-slate-300">Top OD (inches) <span className="text-red-400">*</span></Label>
                            <Input 
                                id="od" 
                                type="number"
                                step="0.125"
                                value={formData.od}
                                onChange={(e) => updateFormData('od', e.target.value)}
                                placeholder="e.g. 9.625"
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-3">
                            <Label htmlFor="desc" className="text-slate-300">Description</Label>
                            <Textarea 
                                id="desc"
                                value={formData.description}
                                onChange={(e) => updateFormData('description', e.target.value)}
                                placeholder="Optional notes about this design case..."
                                className="bg-slate-900 border-slate-700 min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-slate-400">
                            Define the mechanical string configuration from top to bottom.
                        </div>
                        <Button size="sm" onClick={handleAddSection} className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-700">
                            <Plus className="w-4 h-4 mr-2" /> Add Section
                        </Button>
                    </div>

                    <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#1E293B]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-900 border-slate-800 hover:bg-slate-900">
                                    <TableHead className="text-slate-400">#</TableHead>
                                    <TableHead className="text-slate-400">Interval (ft)</TableHead>
                                    <TableHead className="text-slate-400">Weight</TableHead>
                                    <TableHead className="text-slate-400">Grade</TableHead>
                                    <TableHead className="text-slate-400">Conn</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                            No sections defined yet. Click "Add Section" to start.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sections.map((section, idx) => (
                                        <TableRow key={idx} className="border-slate-800">
                                            <TableCell className="text-slate-500 font-mono">{idx + 1}</TableCell>
                                            <TableCell className="font-medium text-slate-200">{section.top_depth} - {section.bottom_depth}</TableCell>
                                            <TableCell className="text-slate-300">{section.weight} ppf</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">{section.grade}</Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-300">{section.connection_type}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-800" onClick={() => handleEditSection(section, idx)}>
                                                        <Edit className="h-4 w-4 text-blue-400" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-800" onClick={() => handleDeleteSection(idx)}>
                                                        <Trash2 className="h-4 w-4 text-red-400" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isStep2Valid() && sections.length > 0 && (
                        <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-md text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Warning: Sections contain overlap or invalid depths. Please correct before proceeding.</span>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 max-w-3xl mx-auto py-4">
                     <div className="grid grid-cols-2 gap-8">
                         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                             <h3 className="text-lg font-semibold text-white mb-4">Design Summary</h3>
                             <div className="grid grid-cols-2 gap-y-4 text-sm">
                                 <span className="text-slate-500">Name</span>
                                 <span className="text-slate-200 font-medium text-right">{formData.name}</span>
                                 
                                 <span className="text-slate-500">Type</span>
                                 <span className="text-slate-200 font-medium text-right">{formData.type}</span>
                                 
                                 <span className="text-slate-500">Well</span>
                                 <span className="text-slate-200 font-medium text-right">{wells.find(w => w.id === formData.well_id)?.name}</span>
                                 
                                 <span className="text-slate-500">Outer Diameter</span>
                                 <span className="text-slate-200 font-medium text-right">{formData.od} in</span>
                             </div>
                         </div>
                         
                         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                             <h3 className="text-lg font-semibold text-white mb-4">Calculated Metrics</h3>
                             <div className="grid grid-cols-2 gap-y-4 text-sm">
                                 <span className="text-slate-500">Section Count</span>
                                 <span className="text-slate-200 font-medium text-right">{sections.length}</span>
                                 
                                 <span className="text-slate-500">Total Measured Depth</span>
                                 <span className="text-slate-200 font-medium text-right">{totalDepth.toLocaleString()} ft</span>
                                 
                                 <span className="text-slate-500">Est. Total Weight</span>
                                 <span className="text-slate-200 font-medium text-right">{(totalWeight / 1000).toFixed(1)} klb</span>
                                 
                                 <span className="text-slate-500">Changes Detected</span>
                                 <span className={cn("font-medium text-right", changes.length > 0 ? "text-amber-400" : "text-slate-500")}>
                                     {changes.length > 0 ? changes.length : 'None'}
                                 </span>
                             </div>
                         </div>
                     </div>

                     {changes.length > 0 && (
                         <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                             <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                                 <Edit className="h-4 w-4" /> Modification Summary
                             </h4>
                             <ul className="list-disc list-inside text-sm text-slate-300">
                                 {changes.map(c => <li key={c}>{c} modified</li>)}
                             </ul>
                         </div>
                     )}

                     <div className="text-center text-sm text-slate-500">
                         Please review all details carefully before saving. This will update the system of record.
                     </div>
                </div>
            )}
        </ScrollArea>

        {/* Footer Navigation */}
        <DialogFooter className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center sm:justify-between">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          
          <div className="flex gap-3">
             {step > 1 && (
                 <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-700 text-slate-300">
                     <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                 </Button>
             )}
             
             {step < 3 ? (
                 <Button 
                    onClick={() => setStep(step + 1)} 
                    disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                    className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                 >
                     Next <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
             ) : (
                 <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[120px]"
                 >
                     {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                         <>
                            <Save className="w-4 h-4 mr-2" /> {isEditMode ? 'Update Design' : 'Create Design'}
                         </>
                     )}
                 </Button>
             )}
          </div>
        </DialogFooter>

        {/* Section Editor Sub-Modal */}
        <SectionEditor 
            isOpen={sectionEditorOpen}
            onClose={() => setSectionEditorOpen(false)}
            onSave={handleSaveSection}
            initialData={editingSection}
            mode={editingSection ? 'edit' : 'add'}
        />

      </DialogContent>
    </Dialog>
  );
};

export default DesignWizardModal;