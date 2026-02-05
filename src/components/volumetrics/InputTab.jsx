import React from 'react';
import InputMethodSelector from './InputMethodSelector';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { VolumeCalculationEngine } from '@/services/volumetrics/VolumeCalculationEngine';
import { useToast } from '@/components/ui/use-toast';
import { InputValidator } from '@/services/volumetrics/InputValidator';

const InputTab = () => {
    const { state, actions } = useVolumetrics();
    const { toast } = useToast();

    const handleCalculate = () => {
        // 1. Validate
        let validation;
        if (state.inputMethod === 'simple') validation = InputValidator.validateSimpleInput(state.data.parameters || {});
        else validation = { isValid: true }; // Skip for placeholders

        if (!validation.isValid) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields before calculating.", variant: "destructive" });
            return;
        }

        // 2. Calculate
        actions.addLog("Starting calculation...", "info");
        const result = VolumeCalculationEngine.calculateSimpleVolumetrics({
            ...state.data.parameters,
            unit_system: 'Imperial' // Defaulting for now
        });

        if (result.success) {
            actions.updateData({ results: result });
            actions.setActiveTab('results');
            actions.addLog(`Calculation successful. STOIIP: ${result.metrics.stoiip.toFixed(2)} ${result.units.volume}`, "success");
            toast({ title: "Calculation Complete", description: "Results available in the Results tab." });
        } else {
            actions.addLog(`Calculation failed: ${result.error}`, "error");
            toast({ title: "Calculation Failed", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
                <InputMethodSelector />
            </div>
            
            {/* Floating Action Bar */}
            <div className="absolute bottom-6 right-6 z-10">
                <Button 
                    onClick={handleCalculate}
                    size="lg" 
                    className="bg-[#BFFF00] hover:bg-[#a3d900] text-black font-bold shadow-lg shadow-[#BFFF00]/20 transition-all hover:scale-105"
                >
                    <Play size={18} className="mr-2 fill-black" /> Calculate Volumes
                </Button>
            </div>
        </div>
    );
};

export default InputTab;