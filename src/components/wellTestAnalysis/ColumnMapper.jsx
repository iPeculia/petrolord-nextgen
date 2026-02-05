import React, { useState, useEffect } from 'react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { processImportedData } from '@/utils/wellTestAnalysis/dataProcessor';
import { ArrowRight, RefreshCw } from 'lucide-react';

const ColumnMapper = () => {
  const { state, dispatch, log } = useWellTestAnalysis();
  const { rawImportData, importColumns } = state;
  
  const [mapping, setMapping] = useState({
    time: '',
    pressure: '',
    rate: ''
  });

  // Auto-detect columns
  useEffect(() => {
    const newMapping = { ...mapping };
    importColumns.forEach(col => {
        const lower = col.toLowerCase();
        if (!newMapping.time && (lower.includes('time') || lower === 't')) newMapping.time = col;
        if (!newMapping.pressure && (lower.includes('press') || lower === 'p')) newMapping.pressure = col;
        if (!newMapping.rate && (lower.includes('rate') || lower === 'q')) newMapping.rate = col;
    });
    setMapping(newMapping);
  }, [importColumns]);

  const handleConfirm = () => {
    if (!mapping.time || !mapping.pressure) {
        log('Time and Pressure columns are required.', 'error');
        return;
    }

    dispatch({ type: 'SET_COLUMN_MAPPING', payload: mapping });
    
    try {
        const standardized = processImportedData(rawImportData, mapping);
        dispatch({ type: 'SET_STANDARDIZED_DATA', payload: standardized });
        log('Data mapped and standardized successfully.', 'success');
    } catch (e) {
        log('Error processing data mapping: ' + e.message, 'error');
    }
  };

  const previewData = rawImportData.slice(0, 5);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">Map Columns</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Time Column *</CardTitle>
            </CardHeader>
            <CardContent>
                <Select value={mapping.time} onValueChange={(v) => setMapping({...mapping, time: v})}>
                   <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder="Select Column" /></SelectTrigger>
                   <SelectContent>
                      {importColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                   </SelectContent>
                </Select>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Pressure Column *</CardTitle>
            </CardHeader>
            <CardContent>
                <Select value={mapping.pressure} onValueChange={(v) => setMapping({...mapping, pressure: v})}>
                   <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder="Select Column" /></SelectTrigger>
                   <SelectContent>
                      {importColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                   </SelectContent>
                </Select>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Rate Column (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
                <Select value={mapping.rate} onValueChange={(v) => setMapping({...mapping, rate: v})}>
                   <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder="None" /></SelectTrigger>
                   <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {importColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                   </SelectContent>
                </Select>
            </CardContent>
         </Card>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden mb-8">
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider">
            Raw Data Preview
        </div>
        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    {importColumns.map(col => (
                        <TableHead key={col} className="text-slate-400">{col}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {previewData.map((row, i) => (
                    <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                        {importColumns.map(col => (
                            <TableCell key={col} className="text-slate-300 font-mono text-xs">{row[col]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3">
         <Button variant="ghost" className="text-slate-400" onClick={() => dispatch({ type: 'SET_RAW_IMPORT', payload: { data: [], columns: [] } })}>
             <RefreshCw className="w-4 h-4 mr-2" /> Reset
         </Button>
         <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]" onClick={handleConfirm}>
             Next: Test Setup <ArrowRight className="w-4 h-4 ml-2" />
         </Button>
      </div>
    </div>
  );
};

export default ColumnMapper;