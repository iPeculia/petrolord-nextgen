import React, { useState } from 'react';
import { Edit2, Trash2, Cog, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import EquipmentForm from './EquipmentForm';

const EquipmentList = () => {
  const { equipment, deleteEquipment, currentFacility } = useFacilityMasterPlanner();
  const [filter, setFilter] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter for current facility (assuming units are linked, here simplistic filter on all for demo)
  const filteredEquipment = equipment.filter(e => 
    e.tag_number.toLowerCase().includes(filter.toLowerCase()) ||
    e.equipment_type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Filter equipment..." 
          className="max-w-xs bg-slate-900 border-slate-700 text-white"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)} className="bg-blue-600 text-white">
                    <Cog className="w-4 h-4 mr-2" /> Add Equipment
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-slate-800 p-0 text-white max-w-lg">
                <EquipmentForm onClose={() => setIsFormOpen(false)} editEquipment={editingItem} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-slate-800 bg-[#1a1a1a]">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400">Tag No</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Capacity</TableHead>
              <TableHead className="text-slate-400">Manufacturer</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.equipment_id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-white">{item.tag_number}</TableCell>
                <TableCell className="text-slate-300">{item.equipment_type}</TableCell>
                <TableCell className="text-slate-300">{item.design_capacity} {item.design_capacity_unit}</TableCell>
                <TableCell className="text-slate-300">{item.manufacturer}</TableCell>
                <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Operational' ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                        {item.status}
                    </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-white">
                      <DropdownMenuItem onClick={() => { setEditingItem(item); setIsFormOpen(true); }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteEquipment(item.equipment_id)} className="text-red-400 focus:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredEquipment.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No equipment found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EquipmentList;