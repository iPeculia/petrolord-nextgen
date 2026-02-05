import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import FacilityForm from '../forms/FacilityForm';

const FacilitiesList = () => {
  const { facilities, nodes, deleteFacility, setSelectedFacility } = useNetworkOptimization();
  const [filterText, setFilterText] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [editingFacility, setEditingFacility] = useState(null);

  const filteredFacilities = facilities.filter(fac => {
    const matchesText = fac.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = typeFilter === 'All' || fac.type === typeFilter;
    return matchesText && matchesType;
  });

  const getNodeName = (id) => {
    const n = nodes.find(node => node.node_id === id);
    return n ? n.name : 'Unknown';
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this facility?')) {
        deleteFacility(id);
    }
  };

  const handleEdit = (fac, e) => {
    e.stopPropagation();
    setEditingFacility(fac);
  };

  const handleView = (fac, e) => {
    e.stopPropagation();
    setSelectedFacility(fac);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search facilities..." 
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
                <SelectItem value="Separator">Separator</SelectItem>
                <SelectItem value="Compressor">Compressor</SelectItem>
                <SelectItem value="Pump">Pump</SelectItem>
                <SelectItem value="Heater">Heater</SelectItem>
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
              <TableHead className="text-slate-400">Capacity</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No facilities found. Add facilities to nodes.
                    </TableCell>
                </TableRow>
            ) : (
                filteredFacilities.map((fac) => (
                <TableRow 
                    key={fac.facility_id} 
                    className="hover:bg-slate-800/50 border-slate-800 cursor-pointer"
                    onClick={() => setSelectedFacility(fac)}
                >
                    <TableCell className="font-medium text-slate-200">{fac.name}</TableCell>
                    <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-900/30 text-violet-400">
                            {fac.type}
                        </span>
                    </TableCell>
                    <TableCell className="text-slate-400">{getNodeName(fac.node_id)}</TableCell>
                    <TableCell className="text-slate-400 text-xs">
                        {fac.capacity} {fac.capacity_unit}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleView(fac, e)} title="View Properties">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleEdit(fac, e)} title="Edit">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={(e) => handleDelete(fac.facility_id, e)} title="Delete">
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

      <Dialog open={!!editingFacility} onOpenChange={(open) => !open && setEditingFacility(null)}>
        <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-slate-800 text-slate-50 p-0">
            {editingFacility && (
                <FacilityForm 
                    initialData={editingFacility} 
                    onSuccess={() => setEditingFacility(null)}
                    onCancel={() => setEditingFacility(null)}
                />
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacilitiesList;