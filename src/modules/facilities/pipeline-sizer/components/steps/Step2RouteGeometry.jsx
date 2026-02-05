import React from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { ROUGHNESS_VALUES } from '../../utils/constants';

const Step2RouteGeometry = ({ segments, setSegments }) => {
  const addSegment = () => {
    const newId = segments.length > 0 ? Math.max(...segments.map(s => s.id)) + 1 : 1;
    setSegments([...segments, { 
      id: newId, 
      name: `Segment ${newId}`, 
      length: 1000, 
      elevation: 0, 
      roughness: 'new_steel', 
      fittings: { elbow90: 0, elbow45: 0, tee: 0, valve: 0 },
      heatTransfer: 'adiabatic',
      ambientTemp: 60
    }]);
  };

  const removeSegment = (id) => {
    if (segments.length > 1) {
      setSegments(segments.filter(s => s.id !== id));
    }
  };

  const updateSegment = (id, field, value) => {
    setSegments(segments.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateFittings = (id, type, val) => {
    setSegments(segments.map(s => 
      s.id === id ? { ...s, fittings: { ...s.fittings, [type]: parseInt(val) || 0 } } : s
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <Card className="bg-slate-900 border-slate-700 shadow-xl">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Route Geometry & Segmentation</h3>
              <Button size="sm" onClick={addSegment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Segment
              </Button>
            </div>

            <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Length (ft)</TableHead>
                    <TableHead className="text-slate-300">Elev. Change (ft)</TableHead>
                    <TableHead className="text-slate-300">Roughness</TableHead>
                    <TableHead className="text-slate-300">Heat Transfer</TableHead>
                    <TableHead className="text-slate-300 text-center">Fittings</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segments.map((seg, idx) => (
                    <TableRow key={seg.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell className="text-center font-mono text-slate-500">{idx + 1}</TableCell>
                      <TableCell>
                        <Input 
                          value={seg.name} 
                          onChange={(e) => updateSegment(seg.id, 'name', e.target.value)}
                          className="h-8 bg-slate-950 border-slate-700 text-white" 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={seg.length} 
                          onChange={(e) => updateSegment(seg.id, 'length', parseFloat(e.target.value))}
                          className="h-8 bg-slate-950 border-slate-700 text-white w-24" 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={seg.elevation} 
                          onChange={(e) => updateSegment(seg.id, 'elevation', parseFloat(e.target.value))}
                          className="h-8 bg-slate-950 border-slate-700 text-white w-24" 
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={seg.roughness} 
                          onValueChange={(val) => updateSegment(seg.id, 'roughness', val)}
                        >
                          <SelectTrigger className="h-8 w-32 bg-slate-950 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {Object.keys(ROUGHNESS_VALUES).map(k => (
                              <SelectItem key={k} value={k}>{k.replace('_', ' ')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                         <Select 
                          value={seg.heatTransfer} 
                          onValueChange={(val) => updateSegment(seg.id, 'heatTransfer', val)}
                        >
                          <SelectTrigger className="h-8 w-32 bg-slate-950 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="adiabatic">Adiabatic</SelectItem>
                            <SelectItem value="isothermal">Isothermal</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white">
                                <Settings className="w-4 h-4 mr-2" />
                                {Object.values(seg.fittings).reduce((a, b) => a + b, 0)} Items
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 border-slate-700 p-4 w-64 text-white">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-white mb-2">Fitting Counts</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <Label className="text-xs">90° Elbows</Label>
                                  <Input type="number" size="sm" className="h-6 text-xs bg-slate-800 border-slate-600 text-white" value={seg.fittings.elbow90} onChange={(e) => updateFittings(seg.id, 'elbow90', e.target.value)} />
                                  <Label className="text-xs">45° Elbows</Label>
                                  <Input type="number" size="sm" className="h-6 text-xs bg-slate-800 border-slate-600 text-white" value={seg.fittings.elbow45} onChange={(e) => updateFittings(seg.id, 'elbow45', e.target.value)} />
                                  <Label className="text-xs">Tees</Label>
                                  <Input type="number" size="sm" className="h-6 text-xs bg-slate-800 border-slate-600 text-white" value={seg.fittings.tee} onChange={(e) => updateFittings(seg.id, 'tee', e.target.value)} />
                                  <Label className="text-xs">Valves</Label>
                                  <Input type="number" size="sm" className="h-6 text-xs bg-slate-800 border-slate-600 text-white" value={seg.fittings.valve} onChange={(e) => updateFittings(seg.id, 'valve', e.target.value)} />
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeSegment(seg.id)}
                          className="text-slate-500 hover:text-red-400 hover:bg-slate-800"
                          disabled={segments.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-3 bg-slate-800/50 flex justify-between text-sm text-slate-400 border-t border-slate-700">
                <span>Total Segments: {segments.length}</span>
                <div className="space-x-4">
                   <span>Total Length: <span className="text-white font-mono">{segments.reduce((acc, s) => acc + (s.length || 0), 0).toLocaleString()} ft</span></span>
                   <span>Net Elevation: <span className="text-white font-mono">{segments.reduce((acc, s) => acc + (s.elevation || 0), 0).toLocaleString()} ft</span></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2RouteGeometry;