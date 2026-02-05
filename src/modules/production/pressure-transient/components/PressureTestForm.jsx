import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, Plus, Trash2, Save, FileText } from 'lucide-react';
import { parseCSV, validateTestData } from '../utils/dataUploadParser';

const PressureTestForm = ({ wellId, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    test_type: 'Buildup',
    start_time: new Date().toISOString().slice(0, 16),
    duration_hours: '',
    initial_pressure: '',
    flow_rate: ''
  });
  
  const [dataPoints, setDataPoints] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadError(null);
      const rawData = await parseCSV(file);
      const validation = validateTestData(rawData);
      
      if (validation.isValid) {
        setDataPoints(validation.data);
        toast({ title: "Upload Successful", description: `Loaded ${validation.data.length} data points.` });
      } else {
        setUploadError(validation.errors[0]);
        toast({ title: "Upload Failed", description: validation.errors[0], variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      setUploadError("Failed to parse CSV file");
    }
  };

  const handleAddRow = () => {
    setDataPoints([...dataPoints, { time_hours: 0, pressure_psi: 0, flow_rate: 0 }]);
  };

  const handleDeleteRow = (index) => {
    const newData = [...dataPoints];
    newData.splice(index, 1);
    setDataPoints(newData);
  };

  const handleRowChange = (index, field, value) => {
    const newData = [...dataPoints];
    newData[index][field] = parseFloat(value) || 0;
    setDataPoints(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wellId) {
       toast({ title: "Error", description: "No well selected context.", variant: "destructive" });
       return;
    }
    
    if (dataPoints.length === 0) {
      toast({ title: "Validation Error", description: "Please add or upload test data points.", variant: "destructive" });
      return;
    }

    onSave({
      ...formData,
      well_id: wellId,
      duration_hours: parseFloat(formData.duration_hours),
      initial_pressure: parseFloat(formData.initial_pressure),
      flow_rate: parseFloat(formData.flow_rate),
      data_points: dataPoints
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">New Pressure Test</CardTitle>
        <CardDescription>Configure test parameters and import data</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Params */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select value={formData.test_type} onValueChange={(val) => setFormData({...formData, test_type: val})}>
                <SelectTrigger className="bg-slate-950 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Drawdown">Drawdown</SelectItem>
                  <SelectItem value="Buildup">Buildup</SelectItem>
                  <SelectItem value="Injection">Injection</SelectItem>
                  <SelectItem value="Falloff">Falloff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input 
                type="datetime-local" 
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
             <div className="space-y-2">
              <Label>Duration (hrs)</Label>
              <Input 
                type="number" 
                value={formData.duration_hours}
                onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
              />
            </div>
             <div className="space-y-2">
              <Label>Initial Pressure (psi)</Label>
              <Input 
                type="number" 
                value={formData.initial_pressure}
                onChange={(e) => setFormData({...formData, initial_pressure: e.target.value})}
              />
            </div>
          </div>

          {/* Data Entry */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-950 border border-slate-800">
              <TabsTrigger value="upload">CSV Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="pt-4">
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-10 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-950 transition-colors">
                <UploadCloud className="w-12 h-12 text-slate-500 mb-4" />
                <p className="text-slate-300 font-medium mb-1">Drag and drop CSV file</p>
                <p className="text-slate-500 text-sm mb-4">Required columns: time, pressure</p>
                <Input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <Button asChild variant="outline" className="cursor-pointer border-slate-700 text-slate-300">
                  <label htmlFor="file-upload">Browse Files</label>
                </Button>
                {uploadError && <p className="text-red-500 text-sm mt-4">{uploadError}</p>}
                {dataPoints.length > 0 && !uploadError && (
                  <div className="flex items-center gap-2 mt-4 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-sm">
                    <FileText className="w-4 h-4" />
                    Loaded {dataPoints.length} points
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="pt-4">
               <div className="rounded-md border border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow>
                      <TableHead>Time (hr)</TableHead>
                      <TableHead>Pressure (psi)</TableHead>
                      <TableHead>Rate (bbl/d)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataPoints.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Input type="number" value={row.time_hours} onChange={(e) => handleRowChange(idx, 'time_hours', e.target.value)} className="h-8" />
                        </TableCell>
                         <TableCell>
                          <Input type="number" value={row.pressure_psi} onChange={(e) => handleRowChange(idx, 'pressure_psi', e.target.value)} className="h-8" />
                        </TableCell>
                         <TableCell>
                          <Input type="number" value={row.flow_rate} onChange={(e) => handleRowChange(idx, 'flow_rate', e.target.value)} className="h-8" />
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" type="button" onClick={() => handleDeleteRow(idx)} className="h-8 w-8 text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {dataPoints.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                          No data points added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
               </div>
               <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="mt-2 border-slate-700 text-slate-300">
                 <Plus className="w-4 h-4 mr-2" /> Add Row
               </Button>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Test Data</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PressureTestForm;