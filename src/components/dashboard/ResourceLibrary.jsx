import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Video, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RESOURCES = [
  { id: 1, title: 'Fundamentals of Reservoir Engineering', type: 'pdf', size: '2.4 MB' },
  { id: 2, title: 'Introduction to Phase Behavior', type: 'video', duration: '15 min' },
  { id: 3, title: 'SPE Standard Symbols', type: 'link', url: '#' },
  { id: 4, title: 'Rock Properties Cheat Sheet', type: 'pdf', size: '1.1 MB' },
];

const ResourceLibrary = () => {
  return (
    <Card className="bg-slate-900/40 border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Resource Library</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {RESOURCES.map((resource) => (
          <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 hover:bg-slate-900 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800">
                {resource.type === 'pdf' ? <FileText className="w-4 h-4" /> : 
                 resource.type === 'video' ? <Video className="w-4 h-4" /> : 
                 <LinkIcon className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium">{resource.title}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {resource.type} • {resource.size || resource.duration || 'External'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ResourceLibrary;