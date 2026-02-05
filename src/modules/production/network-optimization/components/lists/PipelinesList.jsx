import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PipelineForm from '../forms/PipelineForm';

const PipelinesList = () => {
  const { pipelines, nodes, deletePipeline, setSelectedPipeline } = useNetworkOptimization();
  const [filterText, setFilterText] = useState('');
  const [editingPipeline, setEditingPipeline] = useState(null);

  const filteredPipelines = pipelines.filter(pipe => {
    return pipe.name.toLowerCase().includes(filterText.toLowerCase());
  });

  const getNodeName = (id) => {
    const n = nodes.find(node => node.node_id === id);
    return n ? n.name : 'Unknown';
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this pipeline?')) {
        deletePipeline(id);
    }
  };

  const handleEdit = (pipe, e) => {
    e.stopPropagation();
    setEditingPipeline(pipe);
  };

  const handleView = (pipe, e) => {
    e.stopPropagation();
    setSelectedPipeline(pipe);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search pipelines..." 
                className="pl-8 bg-slate-900 border-slate-700"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />
        </div>
      </div>

      <div className="rounded-md border border-slate-800 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-900 sticky top-0 z-10">
            <TableRow className="hover:bg-slate-900 border-slate-800">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Route</TableHead>
              <TableHead className="text-slate-400">Dims</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPipelines.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                        No pipelines found. Connect nodes to create pipelines.
                    </TableCell>
                </TableRow>
            ) : (
                filteredPipelines.map((pipe) => (
                <TableRow 
                    key={pipe.pipeline_id} 
                    className="hover:bg-slate-800/50 border-slate-800 cursor-pointer"
                    onClick={() => setSelectedPipeline(pipe)}
                >
                    <TableCell className="font-medium text-slate-200">{pipe.name}</TableCell>
                    <TableCell className="text-xs text-slate-400">
                        {getNodeName(pipe.from_node_id)} → {getNodeName(pipe.to_node_id)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                        {pipe.length_miles}mi / {pipe.diameter_inches}"
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleView(pipe, e)} title="View Properties">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleEdit(pipe, e)} title="Edit">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={(e) => handleDelete(pipe.pipeline_id, e)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingPipeline} onOpenChange={(open) => !open && setEditingPipeline(null)}>
        <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-slate-800 text-slate-50 p-0">
            {editingPipeline && (
                <PipelineForm 
                    initialData={editingPipeline} 
                    onSuccess={() => setEditingPipeline(null)}
                    onCancel={() => setEditingPipeline(null)}
                />
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelinesList;