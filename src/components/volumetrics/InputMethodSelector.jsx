import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SimpleInput from './SimpleInput';
import HybridInput from './HybridInput';
import SurfacesInput from './SurfacesInput';
import { useVolumetrics } from '@/hooks/useVolumetrics';

const InputMethodSelector = () => {
    const { state, actions } = useVolumetrics();

    const handleMethodChange = (method) => {
        actions.setInputMethod(method);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/30">
                <Tabs value={state.inputMethod} onValueChange={handleMethodChange} className="w-full">
                    <TabsList className="bg-slate-950 border border-slate-800 w-full justify-start">
                        <TabsTrigger value="simple" className="flex-1">Simple (Parameters)</TabsTrigger>
                        <TabsTrigger value="hybrid" className="flex-1">Hybrid (Profile)</TabsTrigger>
                        <TabsTrigger value="surfaces" className="flex-1">Surfaces (Map)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-hidden p-4">
                {state.inputMethod === 'simple' && <SimpleInput />}
                {state.inputMethod === 'hybrid' && <HybridInput />}
                {state.inputMethod === 'surfaces' && <SurfacesInput />}
            </div>
        </div>
    );
};

export default InputMethodSelector;