import React from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Calendar, User, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

const FileHistory = ({ wellId }) => {
    const { files, removeFile } = useGlobalDataStore();
    const wellFiles = files[wellId] || [];

    const handleDelete = (fileId) => {
        removeFile(wellId, fileId);
    };

    if (wellFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No files uploaded for this well.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="space-y-2 p-1">
                {wellFiles.map((file) => (
                    <div key={file.id} className="flex items-start justify-between p-3 bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors group">
                        <div className="flex gap-3">
                            <div className="mt-1 p-2 bg-blue-500/10 rounded text-blue-400">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-200">{file.filename}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {file.upload_date ? formatDistanceToNow(new Date(file.upload_date), { addSuffix: true }) : 'Unknown date'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        User
                                    </span>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                                        {file.file_type}
                                    </span>
                                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                                        {(file.file_size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white hover:bg-slate-800" title="Download">
                                <Download className="w-3.5 h-3.5" />
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-950/30" title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete File?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-400">
                                            This will remove the file record. Associated log data in the well might persist if not manually removed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-slate-900 border-slate-700">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(file.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

export default FileHistory;