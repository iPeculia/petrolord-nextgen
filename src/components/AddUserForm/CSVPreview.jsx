import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { CSVTemplateService } from '@/lib/csvTemplate';

const CSVPreview = ({ validationResult, fileName, onCancel, onImport, importing }) => {
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);

  // Combine valid and invalid for display, sorted by row number
  const allRows = [
    ...validationResult.valid.map(r => ({ ...r, isValid: true })),
    ...validationResult.invalid.map(r => ({ ...r, isValid: false }))
  ].sort((a, b) => a.rowNumber - b.rowNumber);

  const displayedRows = showInvalidOnly ? allRows.filter(r => !r.isValid) : allRows;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] p-4 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Rows</p>
          <p className="text-2xl font-bold text-white mt-1">{validationResult.total}</p>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-lg border border-emerald-900/50 bg-emerald-900/10">
          <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Valid Rows</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{validationResult.valid.length}</p>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-lg border border-red-900/50 bg-red-900/10">
          <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">Invalid Rows</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{validationResult.invalid.length}</p>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-lg border border-slate-800 flex flex-col justify-center items-start">
            <span className="text-xs text-slate-500 mb-2 truncate max-w-full" title={fileName}>File: {fileName}</span>
             <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-0 px-2">
                <Trash2 className="w-3 h-3 mr-1" /> Discard File
             </Button>
        </div>
      </div>

      {/* Validation Message */}
      {validationResult.invalid.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-500">Action Required</h4>
            <p className="text-sm text-amber-200/80 mt-1">
              {validationResult.invalid.length} rows have errors and will be skipped during import. 
              You can proceed with the {validationResult.valid.length} valid rows, or fix the CSV and re-upload.
            </p>
            <div className="mt-3 flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowInvalidOnly(!showInvalidOnly)}
                    className="h-7 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
                >
                    {showInvalidOnly ? 'Show All Rows' : 'Filter Errors Only'}
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => CSVTemplateService.downloadTemplate()} 
                    className="h-7 text-xs text-amber-300 hover:text-white"
                >
                    Download Template Guide
                </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0F172A]">
        <div className="bg-[#1E293B] px-4 py-3 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm">Data Preview</h3>
            <span className="text-xs text-slate-500">Showing {displayedRows.length} rows</span>
        </div>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="bg-[#1E293B]">
              <TableRow className="hover:bg-[#1E293B] border-slate-800">
                <TableHead className="text-slate-400 w-[50px]">#</TableHead>
                <TableHead className="text-slate-400 w-[50px]">Status</TableHead>
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Module ID</TableHead>
                <TableHead className="text-slate-400 w-[200px]">Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow key={row.rowNumber} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-mono text-slate-500">{row.rowNumber}</TableCell>
                  <TableCell>
                    {row.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300">{row.email || '-'}</TableCell>
                  <TableCell className="text-slate-300">{row.first_name} {row.last_name}</TableCell>
                  <TableCell>
                     {row.user_type ? (
                        <Badge variant="outline" className={`
                            ${row.user_type.toLowerCase() === 'student' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                            ${row.user_type.toLowerCase() === 'lecturer' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : ''}
                        `}>
                            {row.user_type}
                        </Badge>
                     ) : <span className="text-slate-600">-</span>}
                  </TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs">{row.module_id || row.moduleId || '-'}</TableCell>
                  <TableCell>
                    {row.errors && row.errors.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {row.errors.map((err, i) => (
                          <span key={i} className="text-xs text-red-400 flex items-center gap-1">
                            • {err}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {displayedRows.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No rows found matching current filter.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button 
            variant="ghost" 
            onClick={onCancel}
            disabled={importing}
            className="text-slate-400 hover:text-white"
        >
            Cancel
        </Button>
        <div className="flex gap-3">
             <Button 
                onClick={onImport}
                disabled={validationResult.valid.length === 0 || importing}
                className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold px-8"
             >
                {importing ? (
                    <>Processing...</>
                ) : (
                    <>Import {validationResult.valid.length} Valid Users <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
             </Button>
        </div>
      </div>
    </div>
  );
};

export default CSVPreview;