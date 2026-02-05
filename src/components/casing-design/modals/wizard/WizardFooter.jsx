import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Save, ArrowRight, ArrowLeft } from 'lucide-react';

const WizardFooter = ({ onClose, step, setStep, isStep1Valid, isStep2Valid, isEditMode, loading, handleSubmit }) => {
  return (
    <DialogFooter className="px-8 py-5 border-t border-slate-800 bg-[#1E293B] flex justify-between items-center sm:justify-between">
      <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
        Cancel
      </Button>
      
      <div className="flex gap-3">
         {step > 1 && (
             <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Previous
             </Button>
         )}
         
         {step < 3 ? (
             <Button 
                onClick={() => setStep(step + 1)} 
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 min-w-[100px]"
             >
                 Next <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
         ) : (
             <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[140px] font-semibold"
             >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                     <>
                        <Save className="w-4 h-4 mr-2" /> {isEditMode ? 'Save Changes' : 'Create Design'}
                     </>
                 )}
             </Button>
         )}
      </div>
    </DialogFooter>
  );
};

export default WizardFooter;