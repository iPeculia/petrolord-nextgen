import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileJson, 
  Image as ImageIcon,
  BarChart,
  Table,
  CheckCircle2,
  AlertCircle,
  FileBarChart
} from 'lucide-react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';

const ResultsExportsTab = () => {
  const { state } = useReservoirSimulation();
  const { selectedModel, simulationState } = state;
  const { toast } = useToast();
  
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  // Data selection state
  const [selectedData, setSelectedData] = useState({
    pressure: true,
    waterSaturation: true,
    oilSaturation: true,
    gasSaturation: false,
    productionRates: true,
    wellData: true,
  });

  // Derived dummy stats for display
  const totalProduction = (simulationState.currentTimeStep || 0) * 1500; // Mock calculation
  const avgPressure = 3200 - ((simulationState.currentTimeStep || 0) * 10); // Mock decline

  if (!selectedModel) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-4 bg-slate-950">
        <AlertCircle className="w-16 h-16 text-slate-700 mb-2" />
        <h3 className="text-xl font-medium text-slate-300">No Simulation Data</h3>
        <p className="max-w-md text-center text-slate-500">
          Run a reservoir simulation model in the Lab tab to generate data for analysis and export.
        </p>
      </div>
    );
  }

  const handleExport = (type) => {
    setIsExporting(true);
    // Simulate API/Processing delay
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Successful",
        description: `${selectedModel.name}_${type}_export.${type === 'excel' ? 'xlsx' : type}`,
        duration: 3000,
      });
    }, 1500);
  };

  const toggleDataSelection = (key) => {
    setSelectedData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollArea className="h-full w-full bg-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Results & Data Export</h1>
          <p className="text-slate-400">
            Generate reports, export raw simulation data, and download high-resolution visualization snapshots for <span className="text-emerald-400 font-medium">{selectedModel.name}</span>.
          </p>
        </div>

        {/* Quick Stats Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 uppercase font-medium mb-1">Total Oil Production</div>
              <div className="text-2xl font-mono text-emerald-400">{totalProduction.toLocaleString()} <span className="text-sm text-slate-400">bbl</span></div>
            </CardContent>
          </Card>
           <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 uppercase font-medium mb-1">Avg. Reservoir Pressure</div>
              <div className="text-2xl font-mono text-blue-400">{avgPressure.toLocaleString()} <span className="text-sm text-slate-400">psi</span></div>
            </CardContent>
          </Card>
           <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 uppercase font-medium mb-1">Recovery Factor</div>
              <div className="text-2xl font-mono text-purple-400">12.4 <span className="text-sm text-slate-400">%</span></div>
            </CardContent>
          </Card>
           <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 uppercase font-medium mb-1">Simulation Time</div>
              <div className="text-2xl font-mono text-slate-200">{(simulationState.currentTimeStep || 0) * 30} <span className="text-sm text-slate-400">days</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Data Export Configuration */}
          <div className="space-y-6">
             <Card className="bg-slate-900/50 border-slate-800 h-full flex flex-col">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-slate-200">
                   <Table className="w-5 h-5 text-blue-500" />
                   Raw Data Export
                 </CardTitle>
                 <CardDescription>Configure datasets to include in your export package.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6 flex-1">
                 
                 {/* Format Selection */}
                 <div className="space-y-3">
                   <Label className="text-slate-300">Export Format</Label>
                   <div className="grid grid-cols-3 gap-3">
                     <Button 
                        variant={exportFormat === 'csv' ? "default" : "outline"} 
                        className={exportFormat === 'csv' ? "bg-blue-600 hover:bg-blue-700 border-transparent text-white" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}
                        onClick={() => setExportFormat('csv')}
                     >
                       <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                     </Button>
                      <Button 
                        variant={exportFormat === 'xlsx' ? "default" : "outline"}
                        className={exportFormat === 'xlsx' ? "bg-emerald-600 hover:bg-emerald-700 border-transparent text-white" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}
                        onClick={() => setExportFormat('xlsx')}
                     >
                       <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                     </Button>
                      <Button 
                        variant={exportFormat === 'json' ? "default" : "outline"}
                        className={exportFormat === 'json' ? "bg-purple-600 hover:bg-purple-700 border-transparent text-white" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}
                        onClick={() => setExportFormat('json')}
                     >
                       <FileJson className="w-4 h-4 mr-2" /> JSON
                     </Button>
                   </div>
                 </div>

                 <Separator className="bg-slate-800" />

                 {/* Dataset Selection */}
                 <div className="space-y-3">
                   <Label className="text-slate-300">Include Datasets</Label>
                   <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedData).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2 p-3 rounded-md bg-slate-950/50 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                          <Checkbox 
                            id={`data-${key}`} 
                            checked={value}
                            onCheckedChange={() => toggleDataSelection(key)}
                            className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <Label 
                            htmlFor={`data-${key}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 capitalize cursor-pointer flex-1"
                          >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                        </div>
                      ))}
                   </div>
                 </div>

               </CardContent>
               <CardFooter>
                 <Button className="w-full bg-slate-100 text-slate-900 hover:bg-white transition-all" onClick={() => handleExport(exportFormat)} disabled={isExporting}>
                   {isExporting ? (
                     <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent"></div>
                        Generating Package...
                     </>
                   ) : (
                     <>
                       <Download className="w-4 h-4 mr-2" /> Download {exportFormat.toUpperCase()} Package
                     </>
                   )}
                 </Button>
               </CardFooter>
             </Card>
          </div>

          {/* Right Column: Reports & Visuals */}
          <div className="space-y-6">
            
            {/* Field Report Generator */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-slate-200">
                   <FileText className="w-5 h-5 text-red-500" />
                   Field Report Generation
                 </CardTitle>
                 <CardDescription>Create comprehensive PDF reports for stakeholders.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex flex-col space-y-1.5">
                   <Label htmlFor="report-title" className="text-slate-300">Report Title</Label>
                   <Input id="report-title" placeholder={`${selectedModel.name} Analysis`} className="bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-emerald-500" />
                 </div>
                 
                 <div className="space-y-2">
                   <Label className="text-slate-300">Sections to Include</Label>
                   <div className="space-y-2 text-sm text-slate-400 bg-slate-950/50 p-4 rounded-md border border-slate-800">
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Summary</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Input Parameters & Grid Specs</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Production Curves (Oil, Water, Gas)</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Final Saturation Maps</div>
                   </div>
                 </div>
               </CardContent>
               <CardFooter>
                 <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => handleExport('pdf')} disabled={isExporting}>
                   <Download className="w-4 h-4 mr-2" /> Generate PDF Report
                 </Button>
               </CardFooter>
            </Card>

            {/* Visual Snapshots */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-slate-200">
                   <ImageIcon className="w-5 h-5 text-orange-500" />
                   Visual Snapshots
                 </CardTitle>
                 <CardDescription>Export current view states as high-res images.</CardDescription>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col gap-2 border-slate-700 bg-slate-950/50 hover:bg-slate-800 hover:text-white transition-all" onClick={() => handleExport('png')}>
                    <ImageIcon className="w-8 h-8 text-emerald-400" />
                    <span className="text-xs font-medium">Export Map View</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2 border-slate-700 bg-slate-950/50 hover:bg-slate-800 hover:text-white transition-all" onClick={() => handleExport('png')}>
                    <FileBarChart className="w-8 h-8 text-blue-400" />
                    <span className="text-xs font-medium">Export Charts</span>
                  </Button>
               </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ResultsExportsTab;