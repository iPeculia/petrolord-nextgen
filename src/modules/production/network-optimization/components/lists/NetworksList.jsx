import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, PlayCircle, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NetworkForm from '../forms/NetworkForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const NetworksList = () => {
  const { networks, deleteNetwork, setCurrentNetwork, setCurrentTab } = useNetworkOptimization();
  const [filterText, setFilterText] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [editingNetwork, setEditingNetwork] = useState(null);

  const filteredNetworks = networks.filter(net => {
    const matchesText = net.name.toLowerCase().includes(filterText.toLowerCase()) || 
                        net.location.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = typeFilter === 'All' || net.type === typeFilter;
    return matchesText && matchesType;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this network?')) {
        deleteNetwork(id);
    }
  };

  const handleEdit = (network, e) => {
    e.stopPropagation();
    setEditingNetwork(network);
  };

  const handleOptimize = (network, e) => {
    e.stopPropagation();
    setCurrentNetwork(network);
    setCurrentTab('Optimization');
  };

  const handleSelect = (network) => {
    setCurrentNetwork(network);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search networks..." 
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
                <SelectItem value="Oil">Oil</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-slate-800 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-900 sticky top-0 z-10">
            <TableRow className="hover:bg-slate-900 border-slate-800">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Location</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNetworks.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No networks found. Create one to get started.
                    </TableCell>
                </TableRow>
            ) : (
                filteredNetworks.map((net) => (
                <TableRow 
                    key={net.network_id} 
                    className="hover:bg-slate-800/50 border-slate-800 cursor-pointer"
                    onClick={() => handleSelect(net)}
                >
                    <TableCell className="font-medium text-slate-200">{net.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                            {net.type}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{net.location}</TableCell>
                    <TableCell>
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/30 text-emerald-400">
                            {net.status || 'Active'}
                         </span>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleOptimize(net, e)} title="Optimize">
                                <PlayCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleEdit(net, e)} title="Edit">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={(e) => handleDelete(net.network_id, e)} title="Delete">
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

      <Dialog open={!!editingNetwork} onOpenChange={(open) => !open && setEditingNetwork(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#0F172A] border-slate-800 text-slate-50 p-0">
            {editingNetwork && (
                <NetworkForm 
                    initialData={editingNetwork} 
                    onSuccess={() => setEditingNetwork(null)}
                    onCancel={() => setEditingNetwork(null)}
                />
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworksList;