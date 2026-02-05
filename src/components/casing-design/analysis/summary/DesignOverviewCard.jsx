import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, Ruler, Weight, Award, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '../../utils/calculationUtils';

const MetricItem = ({ icon: Icon, label, value, subtext }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
        <div className="p-2 bg-slate-800 rounded-md text-[#BFFF00]">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1">
                <p className="text-lg font-bold text-white">{value}</p>
                {subtext && <span className="text-xs text-slate-500">{subtext}</span>}
            </div>
        </div>
    </div>
);

const DesignOverviewCard = ({ design, calculations }) => {
    return (
        <Card className="bg-[#1E293B] border-slate-700 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                            {design.name}
                            <Badge variant="outline" className="border-[#BFFF00] text-[#BFFF00] bg-[#BFFF00]/10">
                                {design.type}
                            </Badge>
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                             Created by User on {new Date(design.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-white">{design.od}"</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Outer Diameter</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricItem 
                        icon={Ruler}
                        label="Total Measured Depth"
                        value={formatNumber(calculations.totalDepth)}
                        subtext="ft"
                    />
                    <MetricItem 
                        icon={Layers}
                        label="Total Sections"
                        value={calculations.sectionCount}
                    />
                    <MetricItem 
                        icon={Weight}
                        label="Total String Weight"
                        value={formatNumber(calculations.totalWeight / 1000, 1)}
                        subtext="klb"
                    />
                    <MetricItem 
                        icon={Award}
                        label="Primary Grade"
                        value={calculations.averageGrade}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default DesignOverviewCard;