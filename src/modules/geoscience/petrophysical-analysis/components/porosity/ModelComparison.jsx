import React, { useState } from 'react';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const ModelComparison = () => {
    const { models } = usePorosityStore();

    if (models.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>No models available to compare.</p>
                <p className="text-xs">Create and save models in the Builder tab first.</p>
            </div>
        );
    }

    const comparisonData = models.map(m => ({
        name: m.name,
        r2: m.metrics?.r2 || 0,
        rmse: m.metrics?.rmse || 0,
        type: m.type
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-4 overflow-y-auto">
            <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white">Model Performance Comparison</CardTitle>
                    <CardDescription>Compare R² (higher is better) and RMSE (lower is better) across saved models.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                cursor={{fill: '#1e293b'}}
                            />
                            <Legend />
                            <Bar dataKey="r2" name="R-Squared" fill="#34d399" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="rmse" name="RMSE" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white">Detailed Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Model Name</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400 text-right">R² Score</TableHead>
                                <TableHead className="text-slate-400 text-right">RMSE</TableHead>
                                <TableHead className="text-slate-400 text-right">Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {models.map((model) => (
                                <TableRow key={model.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">{model.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-slate-700 text-slate-400 uppercase text-[10px]">
                                            {model.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-emerald-400">{model.metrics?.r2}</TableCell>
                                    <TableCell className="text-right font-mono text-blue-400">{model.metrics?.rmse}</TableCell>
                                    <TableCell className="text-right text-slate-500 text-xs">{model.created}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelComparison;