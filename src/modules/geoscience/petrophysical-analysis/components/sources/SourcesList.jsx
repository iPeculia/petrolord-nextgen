import React from 'react';
import { useSources } from '../../context/SourcesContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Database, FileText, Activity, Archive, RotateCw, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SourcesList = () => {
  const { filteredSources, setSelectedSource, deleteSource, archiveSource, restoreSource, syncSource } = useSources();

  const getIcon = (type) => {
      switch(type.toLowerCase()) {
          case 'well log': return <FileText className="w-4 h-4 text-blue-400" />;
          case 'real-time': return <Activity className="w-4 h-4 text-emerald-400" />;
          case 'seismic': return <Activity className="w-4 h-4 text-purple-400" />;
          default: return <Database className="w-4 h-4 text-slate-400" />;
      }
  };

  const getStatusColor = (status) => {
      switch(status.toLowerCase()) {
          case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          case 'inactive': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
          case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
          default: return 'bg-slate-800 text-slate-400';
      }
  };

  if (filteredSources.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 border border-slate-800 border-dashed rounded-xl m-6 bg-slate-900/30">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No sources found</p>
              <p className="text-sm">Try adjusting your filters or add a new data source.</p>
          </div>
      );
  }

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-950">
          <TableRow className="hover:bg-slate-950 border-slate-800">
            <TableHead className="text-slate-400 pl-4">Source Name</TableHead>
            <TableHead className="text-slate-400">Type</TableHead>
            <TableHead className="text-slate-400">Format</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Last Updated</TableHead>
            <TableHead className="text-slate-400 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSources.map((source) => (
            <TableRow key={source.id} className="hover:bg-slate-800/50 border-slate-800 group cursor-pointer" onClick={() => setSelectedSource(source)}>
              <TableCell className="font-medium text-slate-200 pl-4">
                  <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-800">
                          {getIcon(source.type)}
                      </div>
                      <div>
                          <p className="text-sm">{source.name}</p>
                          <p className="text-xs text-slate-500">{source.owner}</p>
                      </div>
                  </div>
              </TableCell>
              <TableCell className="text-slate-400 text-sm">{source.type}</TableCell>
              <TableCell>
                  <Badge variant="outline" className="bg-slate-950 border-slate-700 text-slate-400 font-mono text-[10px]">
                      {source.format}
                  </Badge>
              </TableCell>
              <TableCell>
                  <Badge variant="outline" className={`border ${getStatusColor(source.status)} capitalize`}>
                      {source.status}
                  </Badge>
              </TableCell>
              <TableCell className="text-slate-400 text-sm">
                  {source.lastUpdated ? format(new Date(source.lastUpdated), 'MMM dd, yyyy HH:mm') : '-'}
              </TableCell>
              <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={() => setSelectedSource(source)}>
                        <ExternalLink className="w-4 h-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => syncSource(source.id)}>
                        <RotateCw className="w-4 h-4 mr-2" /> Sync Now
                    </DropdownMenuItem>
                    {source.status === 'archived' ? (
                        <DropdownMenuItem onClick={() => restoreSource(source.id)}>
                            <RotateCw className="w-4 h-4 mr-2" /> Restore
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => archiveSource(source.id)}>
                            <Archive className="w-4 h-4 mr-2" /> Archive
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300" onClick={() => deleteSource(source.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SourcesList;