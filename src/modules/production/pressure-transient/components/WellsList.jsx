import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Edit2, Trash2, LineChart, Plus } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';

const WellsList = ({ onEdit, onAnalyze, onNew }) => {
  const { wells, deleteWell } = usePressureTransient();

  if (wells.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No wells found</h3>
          <p className="text-slate-400 max-w-sm mb-6">Create your first well to get started with Pressure Transient Analysis.</p>
          <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">Create Well</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-950">
          <TableRow>
            <TableHead className="text-slate-300">Name</TableHead>
            <TableHead className="text-slate-300">Location</TableHead>
            <TableHead className="text-slate-300">Type</TableHead>
            <TableHead className="text-slate-300">Depth (TVD)</TableHead>
            <TableHead className="text-right text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-900">
          {wells.map((well) => (
            <TableRow key={well.well_id} className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium text-white">{well.name}</TableCell>
              <TableCell className="text-slate-400">{well.location}</TableCell>
              <TableCell className="text-slate-400">{well.type}</TableCell>
              <TableCell className="text-slate-400">{well.depth_tvd} ft</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onAnalyze(well)} title="Analyze" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <LineChart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(well)} title="Edit" className="text-slate-400 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteWell(well.well_id)} title="Delete" className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WellsList;