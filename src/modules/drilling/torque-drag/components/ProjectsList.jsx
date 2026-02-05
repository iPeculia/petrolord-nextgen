import React from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';

const ProjectsList = () => {
  const { projects, setCurrentProject, deleteProject, setCurrentTab } = useTorqueDrag();

  if (projects.length === 0) return <div className="text-slate-500 text-center py-8">No projects found.</div>;

  return (
    <div className="rounded-md border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow>
            <TableHead className="text-slate-300">Project Name</TableHead>
            <TableHead className="text-slate-300">Location</TableHead>
            <TableHead className="text-slate-300">System</TableHead>
            <TableHead className="text-slate-300">Created</TableHead>
            <TableHead className="text-right text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.project_id} className="hover:bg-slate-800/50">
              <TableCell className="font-medium text-slate-200">{project.name}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>{project.unit_system}</TableCell>
              <TableCell>{format(new Date(project.created_date), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentProject(project)} title="Edit">
                        <Edit2 className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(project.project_id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentProject(project); setCurrentTab('Analysis'); }} title="Analyze">
                        <PlayCircle className="h-4 w-4 text-slate-400 hover:text-green-400" />
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

export default ProjectsList;