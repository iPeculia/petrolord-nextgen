import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, Download, Send, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

const BulkActionsPanel = ({ 
  selectedCount, 
  onClear, 
  onArchive, 
  onDelete, 
  onDownload, 
  isProcessing 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
        <Badge variant="secondary" className="bg-[#BFFF00] text-black font-bold">
          {selectedCount}
        </Badge>
        <span className="text-sm font-medium text-white">Selected</span>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0 rounded-full hover:bg-slate-700">
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDownload}
            disabled={isProcessing}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
         >
            <Download className="w-4 h-4 mr-2" /> Export
         </Button>

         <Button 
            variant="ghost" 
            size="sm" 
            disabled={isProcessing}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
         >
            <Send className="w-4 h-4 mr-2" /> Notify
         </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isProcessing} className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
              <Archive className="w-4 h-4 mr-2" /> Archive
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#0F172A] border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Archive {selectedCount} imports?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                These imports will be hidden from the main list but preserved in the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onArchive} className="bg-amber-600 hover:bg-amber-700">Archive</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isProcessing} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#0F172A] border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedCount} imports?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                This action cannot be undone. All associated records and logs will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BulkActionsPanel;