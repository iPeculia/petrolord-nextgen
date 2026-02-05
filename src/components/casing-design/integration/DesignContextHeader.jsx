import React from 'react';
import { useDesignContext } from '../context/DesignContextProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Folder, X, MapPin, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DesignContextHeader = () => {
  const { activeProject, activeWell, clearContext, hasActiveContext } = useDesignContext();
  const navigate = useNavigate();

  if (!hasActiveContext) return null;

  const handleClear = () => {
    clearContext();
    navigate('/dashboard/modules/drilling/casing-design'); // Remove query params
  };

  return (
    <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 mt-1">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-200 uppercase tracking-wide mb-1">Active Context</h3>
          <div className="flex flex-wrap items-center gap-2">
            {activeProject && (
              <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-slate-300 flex items-center gap-1">
                <Folder className="w-3 h-3" /> {activeProject.name}
              </Badge>
            )}
            {activeProject && activeWell && <span className="text-slate-600">/</span>}
            {activeWell && (
              <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-white font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#BFFF00]" /> {activeWell.name}
              </Badge>
            )}
          </div>
          
          {activeWell && (
             <div className="flex gap-4 mt-2 text-xs text-slate-400">
                {activeWell.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {typeof activeWell.location === 'string' ? activeWell.location : 'Lat/Long Data'}
                    </span>
                )}
                {/* Assuming depth field exists or using placeholder */}
                <span className="flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> TVD: {activeWell.tvd || 'N/A'} ft
                </span>
             </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
            <X className="w-4 h-4 mr-2" /> Clear Context
        </Button>
      </div>
    </div>
  );
};

export default DesignContextHeader;