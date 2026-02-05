import React from 'react';
import { motion } from 'framer-motion';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';

const HydraulicsSchematicCanvas = () => {
  const { current_scenario, current_well, hole_sections } = useHydraulicsSimulator();

  // Basic dimensions
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  
  // Simulation of flow animation
  const flowAnimation = {
    animate: {
      strokeDashoffset: [0, -20],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#0f172a] rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-4 left-4 bg-slate-900/80 p-2 rounded border border-slate-700 backdrop-blur text-xs">
        <h3 className="font-bold text-slate-200 mb-1">System Status</h3>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Pump: Running</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Circulation: Normal</span>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="max-w-4xl max-h-[80vh]">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <linearGradient id="mudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Mud Tanks (Bottom Right) */}
        <g transform={`translate(${width - 150}, ${height - 100})`}>
             <rect x="0" y="0" width="120" height="80" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
             <rect x="5" y="20" width="110" height="55" rx="2" fill="url(#mudGradient)" />
             <text x="60" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="12">Mud Pits</text>
        </g>

        {/* Pumps (Bottom Left) */}
        <g transform={`translate(30, ${height - 100})`}>
             <rect x="0" y="0" width="100" height="60" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
             <circle cx="30" cy="30" r="20" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
             <circle cx="70" cy="30" r="20" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
             {/* Animation for pump */}
             <motion.path 
                d="M 30 15 L 30 45 M 15 30 L 45 30" 
                stroke="#22c55e" 
                strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ originX: "30px", originY: "30px" }}
             />
             <motion.path 
                d="M 70 15 L 70 45 M 55 30 L 85 30" 
                stroke="#22c55e" 
                strokeWidth="2"
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ originX: "70px", originY: "30px" }}
             />
             <text x="50" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="12">Mud Pumps</text>
             
             {/* Pump Pressure Gauge */}
             <circle cx="50" cy="-30" r="15" fill="#1e293b" stroke="#64748b" />
             <text x="50" y="-28" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">3200</text>
             <text x="50" y="-18" textAnchor="middle" fill="#64748b" fontSize="8">PSI</text>
        </g>

        {/* Discharge Line */}
        <path d={`M 80 ${height - 100} L 80 ${height - 150} L ${centerX - 60} ${height - 150} L ${centerX - 60} 100`} 
              fill="none" stroke="#475569" strokeWidth="6" />
        <motion.path d={`M 80 ${height - 100} L 80 ${height - 150} L ${centerX - 60} ${height - 150} L ${centerX - 60} 100`} 
              fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"
              {...flowAnimation} />

        {/* Standpipe Manifold */}
        <g transform={`translate(${centerX - 60}, 150)`}>
             <rect x="-10" y="-20" width="20" height="40" fill="#334155" stroke="#94a3b8" />
             <text x="-30" y="5" textAnchor="end" fill="#94a3b8" fontSize="10">Standpipe</text>
             
             {/* SPP Gauge */}
             <circle cx="-40" cy="0" r="15" fill="#1e293b" stroke="#64748b" />
             <text x="-40" y="2" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">3150</text>
             <text x="-40" y="12" textAnchor="middle" fill="#64748b" fontSize="8">PSI</text>
        </g>

        {/* Rotary Hose / Kelly */}
        <path d={`M ${centerX - 60} 100 Q ${centerX - 60} 50, ${centerX} 50 T ${centerX} 100`}
              fill="none" stroke="#475569" strokeWidth="6" />
        <motion.path d={`M ${centerX - 60} 100 Q ${centerX - 60} 50, ${centerX} 50 T ${centerX} 100`}
              fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"
              {...flowAnimation} />

        {/* Rig Floor */}
        <line x1={centerX - 100} y1="150" x2={centerX + 100} y2="150" stroke="#94a3b8" strokeWidth="4" />
        
        {/* Wellhead / BOP */}
        <rect x={centerX - 25} y="150" width="50" height="40" fill="#ef4444" stroke="#b91c1c" rx="2" />
        <text x={centerX + 35} y="175" fill="#ef4444" fontSize="10" fontWeight="bold">BOP</text>

        {/* Wellbore - Riser (if offshore) or Surface Casing */}
        <path d={`M ${centerX - 20} 190 L ${centerX - 20} 300 L ${centerX + 20} 300 L ${centerX + 20} 190 Z`}
              fill="#1e293b" stroke="#0066cc" strokeWidth="2" opacity="0.8" />
        
        {/* Intermediate Casing */}
        <path d={`M ${centerX - 15} 300 L ${centerX - 15} 450 L ${centerX + 15} 450 L ${centerX + 15} 300 Z`}
              fill="#1e293b" stroke="#00cc00" strokeWidth="2" opacity="0.8" />
        
        {/* Open Hole */}
        <path d={`M ${centerX - 10} 450 L ${centerX - 10} 550 L ${centerX + 10} 550 L ${centerX + 10} 450 Z`}
              fill="#1e293b" stroke="#ffaa00" strokeWidth="2" opacity="0.8" />

        {/* Drill String */}
        <line x1={centerX} y1="100" x2={centerX} y2="540" stroke="#cbd5e1" strokeWidth="4" />
        {/* Drill String Flow */}
        <motion.line x1={centerX} y1="100" x2={centerX} y2="540" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" 
            animate={{ strokeDashoffset: [0, 20] }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />

        {/* BHA / Bit */}
        <rect x={centerX - 6} y="520" width="12" height="20" fill="#94a3b8" />
        <path d={`M ${centerX - 6} 540 L ${centerX} 550 L ${centerX + 6} 540 Z`} fill="#cbd5e1" />

        {/* Return Flow (Annulus) */}
        {/* We simulate return flow with particles or lines going up the annulus */}
        <motion.path d={`M ${centerX - 12} 540 L ${centerX - 12} 190`} stroke="#93c5fd" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"
            animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        <motion.path d={`M ${centerX + 12} 540 L ${centerX + 12} 190`} stroke="#93c5fd" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"
             animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />

        {/* Return Line */}
        <path d={`M ${centerX + 20} 180 L ${width - 100} 180 L ${width - 100} ${height - 110}`} 
              fill="none" stroke="#475569" strokeWidth="6" />
        <motion.path d={`M ${centerX + 20} 180 L ${width - 100} 180 L ${width - 100} ${height - 110}`} 
              fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"
              {...flowAnimation} />

        {/* Choke Manifold */}
        <g transform={`translate(${centerX + 80}, 180)`}>
             <rect x="-15" y="-15" width="30" height="30" fill="#334155" stroke="#94a3b8" />
             <line x1="-15" y1="15" x2="15" y2="-15" stroke="#ef4444" strokeWidth="2" />
             <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Choke</text>
             <text x="0" y="-20" textAnchor="middle" fill="#ef4444" fontSize="10">45% Open</text>
        </g>

        {/* Legend */}
        <g transform="translate(20, 20)">
            <rect x="0" y="0" width="140" height="110" fill="#1e293b" rx="4" stroke="#334155" />
            <text x="70" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Schematic Legend</text>
            
            <circle cx="20" cy="40" r="4" fill="#3b82f6" />
            <text x="35" y="44" fill="#94a3b8" fontSize="11">Fluid Flow</text>

            <line x1="15" y1="60" x2="25" y2="60" stroke="#00cc00" strokeWidth="3" />
            <text x="35" y="64" fill="#94a3b8" fontSize="11">Casing</text>
            
            <line x1="15" y1="80" x2="25" y2="80" stroke="#ffaa00" strokeWidth="3" />
            <text x="35" y="84" fill="#94a3b8" fontSize="11">Open Hole</text>
            
            <line x1="15" y1="100" x2="25" y2="100" stroke="#cbd5e1" strokeWidth="3" />
            <text x="35" y="104" fill="#94a3b8" fontSize="11">Drill String</text>
        </g>

      </svg>
    </div>
  );
};

export default HydraulicsSchematicCanvas;