import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const FilePreview = ({ data, validationResult }) => {
  if (!data || !data.logs) return null;

  // Get first 5 rows for preview
  const curveNames = Object.keys(data.logs);
  const previewLimit = 5;
  const depthArray = data.logs[curveNames[0]]?.depth || [];
  
  return (
    <div className="space-y-4">
       {/* Validation Status */}
       {validationResult && !validationResult.valid ? (
           <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
               <div className="flex items-center gap-2 font-bold mb-1">
                   <AlertTriangle className="w-4 h-4" />
                   Validation Issues
               </div>
               <ul className="list-disc list-inside pl-1 space-y-0.5">
                   {validationResult.issues.map((issue, i) => (
                       <li key={i}>{issue}</li>
                   ))}
               </ul>
           </div>
       ) : (
           <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs flex items-center gap-2">
               <CheckCircle className="w-4 h-4" />
               Data structure is valid. Ready for import.
           </div>
       )}

       <div className="grid grid-cols-2 gap-2 text-xs">
           <div className="bg-secondary p-2 rounded border border-border">
               <span className="text-muted-foreground block">Curves Found</span>
               <span className="text-lg font-mono font-bold">{curveNames.length}</span>
           </div>
           <div className="bg-secondary p-2 rounded border border-border">
               <span className="text-muted-foreground block">Data Points</span>
               <span className="text-lg font-mono font-bold">{depthArray.length.toLocaleString()}</span>
           </div>
       </div>

       {/* Preview Table */}
       <div className="border rounded-md overflow-hidden">
           <div className="bg-muted p-2 text-xs font-medium border-b">Data Preview (First 5 rows)</div>
           <ScrollArea className="h-[200px]">
               <Table>
                   <TableHeader>
                       <TableRow className="hover:bg-transparent">
                           <TableHead className="w-[80px] text-xs">Depth</TableHead>
                           {curveNames.map(name => (
                               <TableHead key={name} className="text-xs text-right min-w-[80px]">{name}</TableHead>
                           ))}
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {depthArray.slice(0, previewLimit).map((depth, idx) => (
                           <TableRow key={idx} className="hover:bg-muted/50">
                               <TableCell className="font-mono text-xs font-medium">{depth.toFixed(2)}</TableCell>
                               {curveNames.map(name => {
                                   const val = data.logs[name].values[idx];
                                   return (
                                       <TableCell key={name} className="font-mono text-xs text-right text-muted-foreground">
                                           {val !== null ? val.toFixed(4) : '-'}
                                       </TableCell>
                                   );
                               })}
                           </TableRow>
                       ))}
                   </TableBody>
               </Table>
           </ScrollArea>
       </div>
    </div>
  );
};

export default FilePreview;