import React from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

const WellsList = () => {
  const { wells, current_project, setCurrentWell, deleteWell } = useTorqueDrag();

  const projectWells = wells.filter(w => w.project_id === current_project?.project_id);

  if (!current_project) return null;
  if (projectWells.length === 0) return <div className="text-slate-500 text-center py-4">No wells in this project.</div>;

  return (
    <div className="rounded-md border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow>
            <TableHead className="text-slate-300">Well Name</TableHead>
            <TableHead className="text-slate-300">API</TableHead>
            <TableHead className="text-slate-300">Rig</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-right text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectWells.map((well) => (
            <TableRow key={well.well_id} className="hover:bg-slate-800/50">
              <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
              <TableCell>{well.api_number}</TableCell>
              <TableCell>{well.rig_name}</TableCell>
              <TableCell>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                      well.status === 'Drilling' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'
                  }`}>
                      {well.status}
                  </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentWell(well)} title="Edit">
                        <Edit2 className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWell(well.well_id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
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