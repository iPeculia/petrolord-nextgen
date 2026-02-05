import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Settings, CornerDownRight, ZoomIn, ZoomOut, Move, RefreshCw } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useToast } from '@/components/ui/use-toast';

const WorkflowBuilder = ({ onBack }) => {
    const { workflows, activeWorkflowId, addWorkflow, updateWorkflow } = useWorkflowStore();
    const existingWorkflow = workflows.find(w => w.id === activeWorkflowId);
    const { toast } = useToast();

    const [name, setName] = useState(existingWorkflow?.name || 'New Workflow');
    const [description, setDescription] = useState(existingWorkflow?.description || '');
    const [steps, setSteps] = useState(existingWorkflow?.steps || []);
    
    // Canvas State
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    // Dragging references
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    // --- Canvas Interaction Handlers ---
    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.001;
            const newZoom = Math.min(Math.max(0.5, zoom + scaleAmount), 2);
            setZoom(newZoom);
        }
    };

    const handleMouseDown = (e) => {
        // Only pan if middle mouse or spacebar held (simulated here by clicking background directly)
        if(e.button === 1 || e.target.id === "workflow-canvas-bg") {
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // --- Drag and Drop Handlers ---
    const handleToolDragStart = (e, toolType) => {
        e.dataTransfer.setData("toolType", toolType);
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        const toolType = e.dataTransfer.getData("toolType");
        if (toolType) {
            // We need to calculate drop position relative to zoom/pan if we were placing absolutely
            // For this list-based builder, we just append
            const newStep = {
                id: Date.now(),
                name: toolType,
                type: 'process', 
                params: {}
            };
            setSteps([...steps, newStep]);
        }
    };

    const handleCanvasDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleStepDragStart = (e, position) => {
        e.stopPropagation(); // Prevent canvas pan
        dragItem.current = position;
    };

    const handleStepDragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const handleStepDragEnd = (e) => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        
        const newSteps = [...steps];
        const draggedItemContent = newSteps[dragItem.current];
        newSteps.splice(dragItem.current, 1);
        newSteps.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        setSteps(newSteps);
    };

    const removeStep = (id) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast({ title: "Validation Error", description: "Workflow name is required.", variant: "destructive" });
            return;
        }

        const workflowData = {
            name,
            description,
            steps,
            type: 'Custom',
            updatedAt: new Date().toISOString()
        };

        if (activeWorkflowId) {
            updateWorkflow(activeWorkflowId, workflowData);
            toast({ title: "Workflow Updated", description: "Changes saved successfully." });
        } else {
            addWorkflow(workflowData);
            toast({ title: "Workflow Created", description: "New workflow saved successfully." });
            onBack();
        }
    };

    const tools = ['Import Data', 'Filter / Smooth', 'Calculate Vsh', 'Calculate Porosity', 'Machine Learning', 'Export Data', 'Generate Report'];

    return (
        <div className="flex flex-col h-full bg-[#0B101B]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Workflow Builder</h2>
                        <p className="text-xs text-slate-400">{activeWorkflowId ? 'Edit existing workflow' : 'Design new workflow'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}><ZoomOut className="w-4 h-4" /></Button>
                    <span className="text-xs text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomIn className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPan({x:0,y:0}); }}><RefreshCw className="w-4 h-4" /></Button>
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white ml-4">
                        <Save className="w-4 h-4 mr-2" /> Save Workflow
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Config */}
                <div className="w-72 border-r border-slate-800 bg-slate-900 p-6 space-y-6 overflow-y-auto z-10 shadow-xl">
                    <div className="space-y-3">
                        <Label className="text-slate-400">Workflow Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-950 border-slate-700 text-white focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-slate-400">Description</Label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-950 border-slate-700 text-white focus:ring-emerald-500" />
                    </div>
                    
                    <div className="pt-6 border-t border-slate-800">
                        <Label className="mb-4 block text-slate-400 font-medium">Toolbox</Label>
                        <div className="grid grid-cols-1 gap-3">
                            {tools.map(tool => (
                                <div 
                                    key={tool} 
                                    draggable
                                    onDragStart={(e) => handleToolDragStart(e, tool)}
                                    className="p-3 rounded bg-slate-800 border border-slate-700 cursor-grab hover:bg-slate-700 hover:border-slate-600 text-sm text-slate-200 transition-all active:cursor-grabbing flex items-center gap-2 shadow-sm"
                                >
                                    <CornerDownRight className="w-4 h-4 text-slate-500" />
                                    {tool}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">Drag tools onto the canvas</p>
                    </div>
                </div>

                {/* Main Builder Canvas */}
                <div 
                    id="workflow-canvas-bg"
                    className={`flex-1 bg-[#0F172A] overflow-hidden relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onDrop={handleCanvasDrop}
                    onDragOver={handleCanvasDragOver}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                     {/* Grid Background */}
                     <div className="absolute inset-0 pointer-events-none" 
                          style={{ 
                              backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', 
                              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                              backgroundPosition: `${pan.x}px ${pan.y}px`,
                              opacity: 0.1
                          }}>
                     </div>

                     {/* Transformed Content Container */}
                     <div 
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: 'top left'
                        }}
                     >
                         {/* Steps Container - Centered roughly */}
                         <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[600px] pointer-events-auto">
                            {steps.length === 0 ? (
                                <div className="text-center py-32 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                                    <p className="text-slate-500 mb-2 text-lg">Start building your workflow</p>
                                    <p className="text-slate-600 text-sm">Drag tools from the left sidebar here</p>
                                </div>
                            ) : (
                                steps.map((step, index) => (
                                    <div 
                                        key={step.id} 
                                        className="relative group pb-8 last:pb-0"
                                        draggable
                                        onDragStart={(e) => handleStepDragStart(e, index)}
                                        onDragEnter={(e) => handleStepDragEnter(e, index)}
                                        onDragEnd={handleStepDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-slate-700 group-last:hidden -z-10 h-full"></div>
                                        )}

                                        <Card className="bg-slate-900 border-slate-800 p-0 flex items-stretch overflow-hidden hover:border-slate-600 transition-colors shadow-lg cursor-default">
                                            <div className="w-12 bg-slate-800/50 border-r border-slate-800 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors">
                                                <GripVertical className="w-5 h-5 text-slate-500" />
                                            </div>
                                            
                                            <div className="flex-1 p-4 flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-mono text-xs border border-blue-500/20">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <Input 
                                                        value={step.name} 
                                                        onChange={(e) => {
                                                            const newSteps = [...steps];
                                                            newSteps[index].name = e.target.value;
                                                            setSteps(newSteps);
                                                        }}
                                                        className="h-8 bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 px-2 -ml-2 font-medium text-white w-full max-w-[300px]"
                                                    />
                                                    <p className="text-xs text-slate-500 px-0 mt-0.5">Type: {step.type}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                                                        <Settings className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30" onClick={() => removeStep(step.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            )}
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;