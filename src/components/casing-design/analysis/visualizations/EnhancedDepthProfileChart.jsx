import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/components/casing-design/utils/calculationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EnhancedDepthProfileChart = ({ sections, design }) => {
    const totalDepth = Math.max(...sections.map(s => s.bottom_depth), 1);
    
    // Sort sections
    const sortedSections = [...sections].sort((a,b) => a.top_depth - b.top_depth);
    
    // Assign colors based on grade
    const gradeColors = {
        'H-40': 'bg-slate-500',
        'J-55': 'bg-emerald-500',
        'K-55': 'bg-emerald-600',
        'L-80': 'bg-blue-500',
        'N-80': 'bg-blue-600',
        'P-110': 'bg-purple-500',
        'Q-125': 'bg-pink-500'
    };
    
    // Fallback color
    const getColor = (grade) => gradeColors[grade] || 'bg-slate-400';

    return (
        <Card className="bg-[#1E293B] border-slate-700 h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Wellbore Schematic</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 relative p-4 flex justify-center bg-slate-950/30">
                
                {/* Scale Markers (Left Side) */}
                <div className="absolute left-2 top-4 bottom-4 w-12 flex flex-col justify-between text-xs text-slate-500 font-mono py-2">
                    <span>0'</span>
                    <span>{formatNumber(totalDepth * 0.25, 0)}'</span>
                    <span>{formatNumber(totalDepth * 0.5, 0)}'</span>
                    <span>{formatNumber(totalDepth * 0.75, 0)}'</span>
                    <span>{formatNumber(totalDepth, 0)}'</span>
                </div>

                {/* String Visualization Container */}
                <div className="relative w-24 h-full bg-slate-900/50 border-x border-dashed border-slate-800 ml-8">
                    {sortedSections.map((section, idx) => {
                        const topPct = (section.top_depth / totalDepth) * 100;
                        const heightPct = ((section.bottom_depth - section.top_depth) / totalDepth) * 100;
                        
                        return (
                            <TooltipProvider key={idx}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div 
                                            className={`absolute w-full border-b border-white/10 hover:brightness-125 transition-all cursor-pointer ${getColor(section.grade)}`}
                                            style={{ 
                                                top: `${topPct}%`, 
                                                height: `${heightPct}%`,
                                                opacity: 0.9
                                            }}
                                        >
                                            {/* Visual "coupling" line */}
                                            <div className="w-full h-[1px] bg-black/20 absolute top-0"></div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 border-slate-700 p-3">
                                        <div className="space-y-1">
                                            <p className="font-bold text-white">Section {idx + 1}</p>
                                            <p className="text-xs text-slate-300">{formatNumber(section.top_depth, 0)} - {formatNumber(section.bottom_depth, 0)} ft</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${getColor(section.grade)}`}>{section.grade}</span>
                                                <span className="text-[10px] text-slate-400">{section.weight} ppf</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-400">
                                                <span>Burst: {section.burst_rating}</span>
                                                <span>Clps: {section.collapse_rating}</span>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>

                {/* OD Indicator (Bottom) */}
                <div className="absolute bottom-1 left-0 right-0 text-center">
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        OD: {design.od}"
                    </span>
                </div>

            </CardContent>
        </Card>
    );
};

export default EnhancedDepthProfileChart;