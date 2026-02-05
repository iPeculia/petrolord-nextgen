import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, Play, Trash2, MoveRight, Settings, GitBranch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const WorkflowNode = ({ type, label, onDelete, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative flex items-center p-4 bg-slate-800 border border-slate-700 rounded-lg w-64 shadow-lg group"
  >
    <div className={`w-3 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${
      type === 'input' ? 'bg-blue-500' : 
      type === 'process' ? 'bg-yellow-500' : 
      type === 'output' ? 'bg-green-500' : 'bg-gray-500'
    }`} />
    
    <div className="ml-4 flex-1">
        <h4 className="text-sm font-bold text-white">{label}</h4>
        <span className="text-xs text-gray-400 uppercase">{type}</span>
    </div>

    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(index)}>
        <Trash2 className="w-3 h-3 text-red-400" />
    </Button>

    {/* Connector Line */}
    <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-[-1]">
       <MoveRight className="text-slate-600 w-6 h-6" />
    </div>
  </motion.div>
);

const WorkflowBuilderPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState({ name: 'New Workflow', nodes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWorkflows();
  }, [user]);

  const fetchWorkflows = async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
    
    if (data) setWorkflows(data);
    setLoading(false);
  };

  const addNode = (type, label) => {
    setActiveWorkflow(prev => ({
        ...prev,
        nodes: [...prev.nodes, { type, label, id: Date.now() }]
    }));
  };

  const removeNode = (index) => {
    setActiveWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.filter((_, i) => i !== index)
    }));
  };

  const saveWorkflow = async () => {
    if (!user) return;
    
    const { error } = await supabase.from('workflows').insert({
        user_id: user.id,
        name: activeWorkflow.name,
        description: `Workflow with ${activeWorkflow.nodes.length} steps`,
        definition: { nodes: activeWorkflow.nodes },
        is_active: true
    });

    if (error) {
        toast({ title: "Error", description: "Failed to save workflow.", variant: "destructive" });
    } else {
        toast({ title: "Success", description: "Workflow saved successfully." });
        fetchWorkflows();
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflow Automation</h1>
          <p className="text-gray-400 mt-1">Design custom data processing pipelines.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveWorkflow({ name: 'New Workflow', nodes: [] })}>New</Button>
            <Button className="bg-[#BFFF00] text-black hover:bg-[#A8E600]" onClick={saveWorkflow}>
                <Save className="mr-2 h-4 w-4" /> Save Workflow
            </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
         {/* Sidebar: Saved Workflows & Tools */}
         <Card className="col-span-3 bg-slate-900 border-slate-800 flex flex-col">
             <CardHeader>
                 <CardTitle className="text-md">Library</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 overflow-y-auto space-y-2">
                 {loading ? <div className="text-center p-4 text-gray-500">Loading...</div> : 
                    workflows.map(wf => (
                        <div 
                            key={wf.id} 
                            className="p-3 bg-slate-800 rounded cursor-pointer hover:bg-slate-700 transition-colors border border-transparent hover:border-[#BFFF00]/50"
                            onClick={() => setActiveWorkflow({ name: wf.name, nodes: wf.definition.nodes })}
                        >
                            <h4 className="font-medium text-white">{wf.name}</h4>
                            <p className="text-xs text-gray-400">{new Date(wf.created_at).toLocaleDateString()}</p>
                        </div>
                    ))
                 }
                 {workflows.length === 0 && !loading && <p className="text-sm text-gray-500 text-center">No saved workflows.</p>}
             </CardContent>
             
             <div className="p-4 border-t border-slate-800 space-y-2">
                 <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Add Step</p>
                 <Button variant="secondary" className="w-full justify-start" onClick={() => addNode('input', 'Data Import')}>
                     <Plus className="mr-2 h-3 w-3" /> Data Source
                 </Button>
                 <Button variant="secondary" className="w-full justify-start" onClick={() => addNode('process', 'Filter / Clean')}>
                     <Settings className="mr-2 h-3 w-3" /> Process
                 </Button>
                 <Button variant="secondary" className="w-full justify-start" onClick={() => addNode('process', 'ML Prediction')}>
                     <GitBranch className="mr-2 h-3 w-3" /> ML Model
                 </Button>
                 <Button variant="secondary" className="w-full justify-start" onClick={() => addNode('output', 'Export Report')}>
                     <Save className="mr-2 h-3 w-3" /> Output
                 </Button>
             </div>
         </Card>

         {/* Canvas */}
         <Card className="col-span-9 bg-slate-950 border-slate-800 relative overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            
            <CardHeader className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                <div className="flex items-center gap-4">
                    <Input 
                        value={activeWorkflow.name} 
                        onChange={(e) => setActiveWorkflow(prev => ({ ...prev, name: e.target.value }))}
                        className="max-w-xs bg-slate-800 border-slate-700"
                    />
                    <div className="flex-1" />
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="mr-2 h-3 w-3" /> Run Workflow
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 p-10 h-full overflow-auto flex items-center gap-6">
                {activeWorkflow.nodes.length === 0 ? (
                    <div className="w-full text-center text-gray-500 mt-20">
                        <Settings className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Add steps from the sidebar to build your workflow.</p>
                    </div>
                ) : (
                    activeWorkflow.nodes.map((node, idx) => (
                        <React.Fragment key={node.id}>
                            <WorkflowNode 
                                index={idx}
                                type={node.type}
                                label={node.label}
                                onDelete={removeNode}
                            />
                            {idx < activeWorkflow.nodes.length - 1 && (
                                <div className="w-8 h-1 bg-slate-700 shrink-0" />
                            )}
                        </React.Fragment>
                    ))
                )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;