import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Box, Layers, Grid } from 'lucide-react';

const AdvancedVisualizations = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Box className="w-4 h-4 text-purple-400" /> 3D Production Surface
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center min-h-[300px] bg-slate-950">
                    {/* Placeholder for Three.js Canvas */}
                    <div className="text-center text-slate-500">
                        <Grid className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Interactive 3D Surface Plot</p>
                        <p className="text-xs mt-2">(Rate vs Time vs Cumulative)</p>
                    </div>
                </CardContent>
            </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" /> Advanced Heatmaps
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center min-h-[300px] bg-slate-950">
                    <div className="text-center text-slate-500">
                        <div className="grid grid-cols-5 gap-1 w-32 h-32 mx-auto mb-4 opacity-30">
                            {Array(25).fill(0).map((_, i) => (
                                <div key={i} className={`bg-blue-${(i%5 + 4)*100} rounded-sm`}></div>
                            ))}
                        </div>
                        <p>Well Performance Heatmap</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdvancedVisualizations;