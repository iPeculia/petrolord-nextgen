import React from 'react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { Calculator, Layers, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const MethodOption = ({ id, label, icon: Icon, description }) => {
  const { state, actions } = useVolumetrics();
  const isSelected = state.inputMethod === id;

  return (
    <div 
      onClick={() => actions.setInputMethod(id)}
      className={cn(
        "p-3 rounded-lg cursor-pointer border transition-all mb-2",
        isSelected 
          ? "bg-[#BFFF00]/10 border-[#BFFF00] text-white" 
          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700"
      )}
    >
      <div className="flex items-center gap-3 mb-1">
        <Icon size={18} className={isSelected ? "text-[#BFFF00]" : "text-slate-500"} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      <p className="text-[10px] opacity-70 pl-7 leading-tight">
        {description}
      </p>
    </div>
  );
};

const LeftSidebar = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Calculation Method</h3>
        <MethodOption 
          id="simple" 
          label="Simple Volumetrics" 
          icon={Calculator} 
          description="Basic geometry-based calculation using average reservoir parameters."
        />
        <MethodOption 
          id="hybrid" 
          label="Hybrid Method" 
          icon={Layers} 
          description="Combines well logs with map-based area estimates."
        />
        <MethodOption 
          id="surfaces" 
          label="Surface Based" 
          icon={Database} 
          description="Advanced volumetric calculation using imported horizon surfaces."
        />
      </div>
    </div>
  );
};

export default LeftSidebar;