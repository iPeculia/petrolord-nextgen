import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ParameterInput = ({ label, id, unit, storeKey }) => {
    const { localChanges, updateLocalChanges } = usePetrophysicalStore();
    const value = (localChanges.parameters && localChanges.parameters[storeKey]) || '';

    const handleChange = (e) => {
        updateLocalChanges({
            parameters: {
                ...localChanges.parameters,
                [storeKey]: parseFloat(e.target.value),
            }
        });
    };

    return (
        <div className="grid grid-cols-2 items-center gap-2 mb-2">
            <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
            <div className="relative">
                <Input 
                    id={id} 
                    type="number" 
                    step="0.01"
                    value={value} 
                    onChange={handleChange} 
                    className="h-7 text-xs pr-6" 
                />
                {unit && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{unit}</span>}
            </div>
        </div>
    );
};

const ParameterInputPanel = () => {
    return (
        <Card className="flex flex-col border-border bg-card shadow-sm mt-4">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Analysis Parameters</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 overflow-y-auto max-h-[400px]">
                <Accordion type="single" collapsible defaultValue="matrix">
                    <AccordionItem value="matrix">
                        <AccordionTrigger className="text-xs py-2">Matrix & Fluid Properties</AccordionTrigger>
                        <AccordionContent>
                             <ParameterInput label="Matrix Density" id="p-rho-ma" unit="g/cc" storeKey="matrixDensity" />
                             <ParameterInput label="Fluid Density" id="p-rho-fl" unit="g/cc" storeKey="fluidDensity" />
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="vsh">
                        <AccordionTrigger className="text-xs py-2">Shale Volume (Vsh)</AccordionTrigger>
                        <AccordionContent>
                             <ParameterInput label="GR Clean (Sand)" id="p-gr-cl" unit="API" storeKey="grClean" />
                             <ParameterInput label="GR Clay (Shale)" id="p-gr-sh" unit="API" storeKey="grClay" />
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="archie">
                        <AccordionTrigger className="text-xs py-2">Archie Parameters (Sw)</AccordionTrigger>
                        <AccordionContent>
                             <ParameterInput label="Tortuosity (a)" id="p-arch-a" unit="" storeKey="archieA" />
                             <ParameterInput label="Cementation (m)" id="p-arch-m" unit="" storeKey="archieM" />
                             <ParameterInput label="Saturation Exp (n)" id="p-arch-n" unit="" storeKey="archieN" />
                             <ParameterInput label="Water Resistivity (Rw)" id="p-rw" unit="Ωm" storeKey="rw" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default ParameterInputPanel;