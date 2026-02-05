import React, { useState, useEffect } from 'react';
import { Droplet, Upload, MapPin, Activity, AlertCircle } from 'lucide-react';
import WellsPanel from '../wells/WellsPanel';
import FileImportPanel from '../files/FileImportPanel';
import MarkersPanel from '../markers/MarkersPanel';
import LogCurveManager from '../tools/LogCurveManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataPanel = () => {
  const [activeTab, setActiveTab] = useState('wells');
  const [error, setError] = useState(null);

  // Error boundary reset effect
  useEffect(() => {
      if (error) {
          const timer = setTimeout(() => setError(null), 3000);
          return () => clearTimeout(timer);
      }
  }, [activeTab, error]);

  // Safe render wrapper
  const renderContent = () => {
      try {
          switch(activeTab) {
              case 'wells': return <WellsPanel />;
              case 'import': return <FileImportPanel />;
              case 'markers': return <MarkersPanel />;
              case 'curves': return <LogCurveManager />;
              default: return <WellsPanel />;
          }
      } catch (e) {
          console.error("DataPanel Render Error:", e);
          setError("Failed to load panel component.");
          return null;
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Sidebar Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-[#0B101B] px-1 shrink-0">
        <button
          onClick={() => setActiveTab('wells')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] font-medium border-b-2 transition-colors ${
            activeTab === 'wells' 
              ? 'border-[#BFFF00] text-[#BFFF00] bg-slate-800/50' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Droplet className="w-4 h-4 mb-1" /> Wells
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] font-medium border-b-2 transition-colors ${
            activeTab === 'import' 
              ? 'border-[#BFFF00] text-[#BFFF00] bg-slate-800/50' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Upload className="w-4 h-4 mb-1" /> Import
        </button>
        <button
          onClick={() => setActiveTab('markers')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] font-medium border-b-2 transition-colors ${
            activeTab === 'markers' 
              ? 'border-[#BFFF00] text-[#BFFF00] bg-slate-800/50' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <MapPin className="w-4 h-4 mb-1" /> Markers
        </button>
        <button
          onClick={() => setActiveTab('curves')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] font-medium border-b-2 transition-colors ${
            activeTab === 'curves' 
              ? 'border-[#BFFF00] text-[#BFFF00] bg-slate-800/50' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Activity className="w-4 h-4 mb-1" /> Curves
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative bg-slate-950">
        {error && (
            <Alert variant="destructive" className="m-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default DataPanel;