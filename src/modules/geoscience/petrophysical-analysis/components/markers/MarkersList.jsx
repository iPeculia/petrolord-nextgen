import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Bookmark, ChevronRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const MarkersList = ({ markers, activeMarkerId, onSelect, onEdit, onDelete }) => {
    if (!markers || markers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 p-8 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                <Layers className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm text-center">No markers defined.</p>
                <p className="text-xs text-center mt-1 opacity-60">Create markers to interpret formation tops and zones.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-1 pr-3">
                {markers.map((marker) => (
                    <div
                        key={marker.id}
                        onClick={() => onSelect(marker)}
                        className={cn(
                            "group flex items-center gap-3 p-2 rounded-md border transition-all cursor-pointer hover:bg-slate-800/50",
                            activeMarkerId === marker.id
                                ? "bg-blue-900/20 border-blue-500/30"
                                : "bg-slate-900/40 border-slate-800"
                        )}
                    >
                        <div 
                            className="w-1 h-10 rounded-full shrink-0 shadow-sm" 
                            style={{ backgroundColor: marker.color }}
                            title={marker.marker_type}
                        />
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className={cn("text-sm font-medium truncate", activeMarkerId === marker.id ? "text-blue-100" : "text-slate-200")}>
                                    {marker.name}
                                </h4>
                                <span className="text-xs font-mono text-[#BFFF00] font-semibold ml-2">
                                    {marker.depth.toFixed(2)} m
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider border border-slate-800 px-1 rounded bg-slate-950/50">
                                    {marker.marker_type}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 text-slate-400 hover:text-white hover:bg-slate-700"
                                        onClick={(e) => { e.stopPropagation(); onEdit(marker); }}
                                        title="Edit"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                                                onClick={(e) => e.stopPropagation()}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200" onClick={e => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Marker?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-slate-400">
                                                    Are you sure you want to delete <strong>{marker.name}</strong>? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-slate-900 border-slate-700">Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    className="bg-red-600 hover:bg-red-700"
                                                    onClick={(e) => { e.stopPropagation(); onDelete(marker.id); }}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

export default MarkersList;