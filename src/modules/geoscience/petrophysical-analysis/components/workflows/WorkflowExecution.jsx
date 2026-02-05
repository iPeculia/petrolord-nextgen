import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Terminal } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { ScrollArea } from '@/components/ui/scroll-area';

const WorkflowExecution = ({ onBack }) => {
    const { activeWorkflowId, workflows, runWorkflow, completeExecution } = useWorkflowStore();
    const workflow = workflows.find(w => w.id === activeWorkflowId);
    
    const [status, setStatus] = useState('ready'); // ready, running, completed, failed
    const [executionId, setExecutionId] = useState(null);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleStart = () => {
        setStatus('running');
        const id = runWorkflow(activeWorkflowId);
        setExecutionId(id);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INFO: Workflow execution started.`]);
        
        // Simulate steps
        let step = 0;
        const interval = setInterval(() => {
            step++;
            const percentage = Math.min(step * 20, 100);
            setProgress(percentage);
            
            if (workflow.steps[step-1]) {
                 setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INFO: Executing step: ${workflow.steps[step-1].name}...`]);
            }

            if (percentage >= 100) {
                clearInterval(interval);
                setStatus('completed');
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SUCCESS: Execution completed successfully.`]);
                completeExecution(id, 'completed', logs);
            }
        }, 1000);
    };

    if (!workflow) return <div>Error: Workflow not found</div>;

    return (
        <div className="flex flex-col h-full bg-[#0B101B]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Executing: {workflow.name}</h2>
                        <p className="text-xs text-slate-400">ID: {activeWorkflowId}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-6">
                {/* Status Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 text-center">
                        <div className="mb-6">
                            {status === 'ready' && <div className="text-slate-400 text-sm">Ready to start execution</div>}
                            {status === 'running' && (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                    <h3 className="text-xl font-bold text-white">Processing...</h3>
                                    <div className="w-full max-w-md h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <p className="mt-2 text-slate-400">{progress}% Complete</p>
                                </div>
                            )}
                            {status === 'completed' && (
                                <div className="flex flex-col items-center">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                                    <h3 className="text-2xl font-bold text-white">Success!</h3>
                                    <p className="text-slate-400">Workflow completed without errors.</p>
                                </div>
                            )}
                        </div>

                        {status === 'ready' && (
                             <Button size="lg" onClick={handleStart} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                 Start Execution
                             </Button>
                        )}
                        {status === 'completed' && (
                             <Button variant="outline" onClick={onBack} className="border-slate-700 text-slate-300">
                                 Return to Dashboard
                             </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Console Logs */}
                <Card className="bg-black border-slate-800 font-mono text-xs h-64 flex flex-col">
                    <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-slate-400">
                        <Terminal className="w-4 h-4" /> Execution Logs
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        {logs.length === 0 ? (
                            <span className="text-slate-600 italic">Waiting for logs...</span>
                        ) : (
                            <div className="space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-slate-300">{log}</div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
};

export default WorkflowExecution;