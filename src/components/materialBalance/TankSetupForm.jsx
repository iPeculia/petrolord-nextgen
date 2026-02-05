import React, { useState, useEffect } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TankSetupForm = () => {
    const { state, updateTank } = useMaterialBalance();
    const { currentTank } = state;
    const { toast } = useToast();

    // Local state to manage form inputs
    const [formData, setFormData] = useState({
        name: '',
        reservoirType: 'Oil',
        driveType: 'Volumetric',
        parameters: {
            area: '',
            thickness: '',
            porosity: '',
            swi: '',
            cf: '',
            cw: '',
        }
    });

    // Load tank data into form when currentTank changes
    useEffect(() => {
        if (currentTank) {
            setFormData({
                name: currentTank.name || '',
                reservoirType: currentTank.type || 'Oil',
                driveType: currentTank.parameters?.driveType || 'Volumetric',
                parameters: {
                    area: currentTank.parameters?.area || '',
                    thickness: currentTank.parameters?.thickness || '',
                    porosity: currentTank.parameters?.porosity || '',
                    swi: currentTank.parameters?.swi || '',
                    cf: currentTank.parameters?.cf || '',
                    cw: currentTank.parameters?.cw || '',
                }
            });
        }
    }, [currentTank]);

    const handleParamChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            parameters: { ...prev.parameters, [key]: value }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentTank) {
            toast({ title: "No Tank Selected", description: "Please select or create a tank first.", variant: "destructive" });
            return;
        }

        // Basic validation
        if (!formData.name) {
             toast({ title: "Validation Error", description: "Tank name is required.", variant: "destructive" });
             return;
        }

        updateTank(currentTank.id, {
            name: formData.name,
            type: formData.reservoirType,
            parameters: {
                ...formData.parameters,
                driveType: formData.driveType
            }
        });

        toast({ title: "Saved", description: "Tank parameters updated successfully.", variant: "success" });
    };

    if (!currentTank) {
        return (
            <Card className="bg-slate-800 border-slate-700 h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                    <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Select a tank to configure parameters.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800 border-slate-700 h-full overflow-hidden flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center text-white">
                    <Settings className="mr-2 h-5 w-5 text-[#BFFF00]" />
                    Tank Configuration
                </CardTitle>
                <CardDescription>Physical properties and drive mechanisms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                <form id="tank-form" onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Basic Info */}
                    <div className="space-y-2">
                        <Label>Tank Name</Label>
                        <Input 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-slate-900 border-slate-700 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Reservoir Type</Label>
                            <Select 
                                value={formData.reservoirType} 
                                onValueChange={(val) => setFormData({...formData, reservoirType: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    <SelectItem value="Oil">Oil</SelectItem>
                                    <SelectItem value="Gas">Gas</SelectItem>
                                    <SelectItem value="Condensate">Condensate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Drive Type</Label>
                            <Select 
                                value={formData.driveType} 
                                onValueChange={(val) => setFormData({...formData, driveType: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    <SelectItem value="Volumetric">Volumetric</SelectItem>
                                    <SelectItem value="Water Drive">Water Drive</SelectItem>
                                    <SelectItem value="Gas Cap">Gas Cap Drive</SelectItem>
                                    <SelectItem value="Combination">Combination</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <TooltipProvider>
                            <div className="space-y-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="cursor-help underline decoration-dotted">Area (acres)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>Reservoir surface area in acres.</TooltipContent>
                                </Tooltip>
                                <Input 
                                    type="number" 
                                    value={formData.parameters.area} 
                                    onChange={(e) => handleParamChange('area', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="cursor-help underline decoration-dotted">Net Pay (ft)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>Average net pay thickness in feet.</TooltipContent>
                                </Tooltip>
                                <Input 
                                    type="number" 
                                    value={formData.parameters.thickness} 
                                    onChange={(e) => handleParamChange('thickness', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="cursor-help underline decoration-dotted">Porosity (dec)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>Average reservoir porosity (0-1).</TooltipContent>
                                </Tooltip>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={formData.parameters.porosity} 
                                    onChange={(e) => handleParamChange('porosity', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="cursor-help underline decoration-dotted">Swi (dec)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>Initial water saturation (0-1).</TooltipContent>
                                </Tooltip>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={formData.parameters.swi} 
                                    onChange={(e) => handleParamChange('swi', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>Cf (1/psi)</Label>
                                <Input 
                                    type="number" 
                                    step="0.000001"
                                    value={formData.parameters.cf} 
                                    onChange={(e) => handleParamChange('cf', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                    placeholder="e.g. 4.0e-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cw (1/psi)</Label>
                                <Input 
                                    type="number" 
                                    step="0.000001"
                                    value={formData.parameters.cw} 
                                    onChange={(e) => handleParamChange('cw', e.target.value)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                    placeholder="e.g. 3.0e-6"
                                />
                            </div>
                        </TooltipProvider>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
                <Button type="submit" form="tank-form" className="w-full bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900]">
                    <Save className="mr-2 h-4 w-4" /> Save Parameters
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TankSetupForm;