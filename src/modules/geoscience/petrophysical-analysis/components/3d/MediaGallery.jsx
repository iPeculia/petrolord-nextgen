import React from 'react';
import { useMediaStore } from '@/modules/geoscience/petrophysical-analysis/store/mediaStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Image as ImageIcon, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MediaGallery = () => {
    const { snapshots, recordings, deleteSnapshot, deleteRecording } = useMediaStore();

    const handleDownload = (dataUrl, filename) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.click();
    };

    const allMedia = [
        ...snapshots.map(s => ({ ...s, type: 'snapshot' })),
        ...recordings.map(r => ({ ...r, type: 'recording' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (allMedia.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <ImageIcon className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No snapshots or recordings yet.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 gap-3">
                {allMedia.map((item) => (
                    <Card key={item.id} className="bg-slate-900 border-slate-800 overflow-hidden group">
                        <div className="relative h-32 bg-black">
                             {item.type === 'snapshot' ? (
                                 <img src={item.dataUrl} alt="Snapshot" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                    <Video className="w-10 h-10 text-slate-700" />
                                 </div>
                             )}
                             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    size="icon" 
                                    variant="secondary" 
                                    className="h-7 w-7 bg-slate-900/80 hover:bg-white hover:text-black border border-slate-700"
                                    onClick={() => handleDownload(item.dataUrl, `${item.type}-${item.id}.${item.type === 'snapshot' ? 'png' : 'webm'}`)}
                                >
                                    <Download className="w-3 h-3" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="destructive" 
                                    className="h-7 w-7 bg-red-900/80 hover:bg-red-600 border border-red-800"
                                    onClick={() => item.type === 'snapshot' ? deleteSnapshot(item.id) : deleteRecording(item.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                             </div>
                        </div>
                        <div className="p-2">
                            <div className="flex items-center gap-2 mb-1">
                                {item.type === 'snapshot' ? <ImageIcon className="w-3 h-3 text-blue-400" /> : <Video className="w-3 h-3 text-purple-400" />}
                                <span className="text-xs font-medium text-slate-300 capitalize">{item.type}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default MediaGallery;