import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

const VideoTutorials = () => {
  const videos = [
    { title: "Introduction to Material Balance", duration: "5:00" },
    { title: "Importing Production Data", duration: "3:45" },
    { title: "PVT Analysis Workflow", duration: "8:20" },
    { title: "Understanding Diagnostic Plots", duration: "6:15" },
    { title: "Creating Scenarios", duration: "4:30" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Video Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 overflow-hidden group cursor-pointer">
            <div className="aspect-video bg-slate-950 relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#BFFF00] transition-colors">
                <Play className="w-5 h-5 text-white group-hover:text-black ml-1" />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-medium group-hover:text-[#BFFF00] transition-colors">{vid.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{vid.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoTutorials;