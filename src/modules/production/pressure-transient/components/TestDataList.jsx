import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Trash2, LineChart, Upload } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';

const TestDataList = ({ onAnalyze, onUpload }) => {
  const { tests, wells, deleteTest } = usePressureTransient();

  const getWellName = (wellId) => {
    const well = wells.find(w => w.well_id === wellId);
    return well ? well.name : 'Unknown Well';
  };

  if (tests.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No test data</h3>
          <p className="text-slate-400 max-w-sm mb-6">Upload pressure transient data to begin analysis.</p>
          <Button onClick={onUpload} className="bg-blue-600 hover:bg-blue-700">Upload Data</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-950">
          <TableRow>
            <TableHead className="text-slate-300">Type</TableHead>
            <TableHead className="text-slate-300">Well</TableHead>
            <TableHead className="text-slate-300">Date</TableHead>
            <TableHead className="text-slate-300">Duration</TableHead>
            <TableHead className="text-right text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-900">
          {tests.map((test) => (
            <TableRow key={test.test_id} className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium text-white">{test.test_type}</TableCell>
              <TableCell className="text-slate-400">{getWellName(test.well_id)}</TableCell>
              <TableCell className="text-slate-400">{new Date(test.start_time).toLocaleDateString()}</TableCell>
              <TableCell className="text-slate-400">{test.duration_hours} hrs</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onAnalyze(test)} title="Analyze" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <LineChart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteTest(test.test_id)} title="Delete" className="text-slate-400 hover:text-red-400">
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

export default TestDataList;