import React from 'react';
import { MapPin, Activity, Info, Copy, Calendar, Database, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useGlobalDataStore } from '@/store/globalDataStore';
import WellLogs from './WellLogs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WellDetails = ({ well: propWell, onEdit, onDelete }) => {
  const { toast } = useToast();
  const { wells, activeWell, wellLogs } = useGlobalDataStore();
  
  // Determine which well to show: Prop, then Active Well, then null
  const displayWellId = propWell?.id || activeWell;
  const well = displayWellId ? wells[displayWellId] : null;
  
  // Get logs for this specific well from the store
  const logs = well ? wellLogs[well.id] : null;

  // If no well is selected or passed
  if (!well) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-950/50">
              <div className="bg-slate-900 p-4 rounded-full mb-4 border border-slate-800">
                <Database className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">No Well Selected</h3>
              <p className="text-sm text-slate-500 max-w-[250px]">
                  Select a well from the list on the left to view its details, metadata, and available logs.
              </p>
          </div>
      );
  }

  const copyId = () => {
      navigator.clipboard.writeText(well.id);
      toast({ title: "ID Copied", description: "Well ID copied to clipboard." });
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'abandoned': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'planned': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-start justify-between mb-4 px-4 py-4 border-b border-slate-800 bg-slate-900/20 shrink-0">
        <div>
            <h2 className="text-xl font-bold text-white leading-none tracking-tight">{well.name}</h2>
            <div className="flex items-center gap-2 mt-2.5">
                <Badge variant="outline" className={getStatusColor(well.status)}>
                    {well.status || 'Unknown'}
                </Badge>
                <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                    {well.type || 'Vertical'}
                </span>
            </div>
        </div>
        {/* Optional: Action buttons if this is a standalone view */}
        {onEdit && onDelete && (
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => onEdit(well)}>
                    <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/20">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200">
                        <AlertDialogHeader>
                        <AlertDialogTitle>Delete Well?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete "{well.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-900 border-slate-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(well.id)}>
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )}
      </div>

      <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 shrink-0">
            <TabsList className="w-full grid grid-cols-2 bg-slate-900 border border-slate-800 mb-4">
                <TabsTrigger value="info">Overview</TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Logs & Curves
                    {logs && Object.keys(logs).length > 0 && (
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full">
                            {Object.keys(logs).length}
                        </span>
                    )}
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="info" className="flex-1 mt-0 overflow-hidden">
             <ScrollArea className="h-full">
                <div className="space-y-6 px-4 pb-6">
                    
                    {/* General Info */}
                    <Card className="bg-slate-900/30 border-slate-800 shadow-none">
                        <CardHeader className="py-3 px-4 border-b border-slate-800/50">
                            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-400" />
                                General Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">Operator</span>
                                    <span className="text-sm text-slate-200 font-medium">{well.operator || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">Field / Block</span>
                                    <span className="text-sm text-slate-200 font-medium">{well.location || well.field || 'N/A'}</span>
                                </div>
                            </div>
                            <Separator className="bg-slate-800/50" />
                            <div className="flex items-center justify-between group cursor-pointer" onClick={copyId}>
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">System ID</span>
                                    <span className="text-xs font-mono text-slate-400">{well.id}</span>
                                </div>
                                <Copy className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spatial Data */}
                    <Card className="bg-slate-900/30 border-slate-800 shadow-none">
                        <CardHeader className="py-3 px-4 border-b border-slate-800/50">
                            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                Spatial & Depth
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs text-slate-500">Total Depth (MD)</span>
                                    <span className="text-sm font-mono text-[#BFFF00]">{well.depth ? `${well.depth} m` : 'N/A'}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#BFFF00]/50 w-3/4 rounded-full" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Latitude</span>
                                    <span className="text-sm font-mono text-slate-300">{well.latitude ? Number(well.latitude).toFixed(6) : 'N/A'}</span>
                                </div>
                                <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Longitude</span>
                                    <span className="text-sm font-mono text-slate-300">{well.longitude ? Number(well.longitude).toFixed(6) : 'N/A'}</span>
                                </div>
                            </div>
                            
                            {/* Extended Spatial Info */}
                             <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/30">
                                    <span className="text-[10px] text-slate-500 block">Country</span>
                                    <span className="text-xs text-slate-300 truncate">{well.country || '-'}</span>
                                </div>
                                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/30">
                                    <span className="text-[10px] text-slate-500 block">State</span>
                                    <span className="text-xs text-slate-300 truncate">{well.state || '-'}</span>
                                </div>
                                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/30">
                                    <span className="text-[10px] text-slate-500 block">County</span>
                                    <span className="text-xs text-slate-300 truncate">{well.county || '-'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/20 p-3 rounded-lg border border-slate-800/50 flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div>
                                <span className="text-xs text-slate-500 block">Spud Date</span>
                                <span className="text-xs text-slate-300">{formatDate(well.spud_date)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/20 p-3 rounded-lg border border-slate-800/50 flex items-start gap-3">
                            <Activity className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div>
                                <span className="text-xs text-slate-500 block">Completion</span>
                                <span className="text-xs text-slate-300">{formatDate(well.completion_date)}</span>
                            </div>
                        </div>
                    </div>

                </div>
             </ScrollArea>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 mt-0 overflow-hidden">
             <WellLogs logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellDetails;