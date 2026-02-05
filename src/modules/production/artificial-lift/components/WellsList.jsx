import React, { useState } from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Trash2, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WellsList = ({ onEdit, onDesign }) => {
  const { wells, deleteWell, setCurrentWellId } = useArtificialLift();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filteredWells = wells.filter(well => 
    well.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    well.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
        deleteWell(deleteId);
        setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input
            placeholder="Search wells..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 max-w-sm"
        />
      </div>

      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
            <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Well Name</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredWells.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                            No wells found. Create a new well to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredWells.map((well) => (
                        <TableRow key={well.well_id} className="border-slate-700 hover:bg-slate-800/30">
                            <TableCell className="font-medium text-white">{well.name}</TableCell>
                            <TableCell className="text-slate-400">{well.location}</TableCell>
                            <TableCell className="text-slate-400">{well.type}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={
                                    well.status === 'Active' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 
                                    well.status === 'Inactive' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 
                                    'text-amber-500 border-amber-500/30 bg-amber-500/10'
                                }>
                                    {well.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => onEdit(well.well_id)}
                                >
                                    <Edit2 className="h-4 w-4 text-slate-400 hover:text-white" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => setDeleteId(well.well_id)}
                                >
                                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-auto px-2 text-blue-400 hover:text-blue-300"
                                    onClick={() => {
                                        setCurrentWellId(well.well_id);
                                        onDesign();
                                    }}
                                >
                                    Design <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                    This action cannot be undone. This will permanently delete the well and all associated data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WellsList;