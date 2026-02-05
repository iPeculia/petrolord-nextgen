import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NodeForm from '../forms/NodeForm';

const NodesList = () => {
  const { nodes, deleteNode, setSelectedNode } = useNetworkOptimization();
  const [filterText, setFilterText] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [editingNode, setEditingNode] = useState(null);

  const filteredNodes = nodes.filter(node => {
    const matchesText = node.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = typeFilter === 'All' || node.type === typeFilter;
    return matchesText && matchesType;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
        deleteNode(id);
    }
  };

  const handleEdit = (node, e) => {
    e.stopPropagation();
    setEditingNode(node);
  };

  const handleView = (node, e) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search nodes..." 
                className="pl-8 bg-slate-900 border-slate-700"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] bg-slate-900 border-slate-700">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Well">Well</SelectItem>
                <SelectItem value="Junction">Junction</SelectItem>
                <SelectItem value="Separator">Separator</SelectItem>
                <SelectItem value="Compressor">Compressor</SelectItem>
                <SelectItem value="Sink">Sink</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-slate-800 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-900 sticky top-0 z-10">
            <TableRow className="hover:bg-slate-900 border-slate-800">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Location (X, Y)</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNodes.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                        No nodes found. Add nodes via the visualization canvas.
                    </TableCell>
                </TableRow>
            ) : (
                filteredNodes.map((node) => (
                <TableRow 
                    key={node.node_id} 
                    className="hover:bg-slate-800/50 border-slate-800 cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                >
                    <TableCell className="font-medium text-slate-200">{node.name}</TableCell>
                    <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                            ${node.type === 'Well' ? 'bg-blue-900/30 text-blue-400' : 
                              node.type === 'Junction' ? 'bg-emerald-900/30 text-emerald-400' : 
                              'bg-slate-800 text-slate-400'}`}>
                            {node.type}
                        </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                        {Math.round(node.location.x)}, {Math.round(node.location.y)}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleView(node, e)} title="View Properties">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleEdit(node, e)} title="Edit">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={(e) => handleDelete(node.node_id, e)} title="Delete">
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

      <Dialog open={!!editingNode} onOpenChange={(open) => !open && setEditingNode(null)}>
        <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-slate-800 text-slate-50 p-0">
            {editingNode && (
                <NodeForm 
                    initialData={editingNode} 
                    onSuccess={() => setEditingNode(null)}
                    onCancel={() => setEditingNode(null)}
                />
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NodesList;