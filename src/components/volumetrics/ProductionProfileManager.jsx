import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import ProductionProfileChart from './ProductionProfileChart';

const ProductionProfileManager = ({ profile, onChange }) => {
    // profile is array of { year, oil_rate, cumulative_oil }

    const updateRow = (index, field, val) => {
        const newProfile = [...profile];
        newProfile[index] = { ...newProfile[index], [field]: parseFloat(val) };
        
        // Recalc cumulative
        let cum = 0;
        newProfile.forEach(p => {
            cum += (p.oil_rate * 365) / 1000000; // Assuming rate is bopd, cum is MMbbl
            p.cumulative_oil = cum;
        });
        
        onChange(newProfile);
    };

    const addYear = () => {
        const lastYear = profile.length > 0 ? profile[profile.length-1].year : new Date().getFullYear();
        onChange([...profile, { year: lastYear + 1, oil_rate: 0, cumulative_oil: 0 }]);
    };

    const removeYear = (index) => {
        const newProfile = profile.filter((_, i) => i !== index);
        onChange(newProfile);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-slate-400 uppercase">Profile Data</h4>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-6 text-xs"><Upload className="w-3 h-3 mr-1"/> Import</Button>
                        <Button size="sm" onClick={addYear} className="h-6 text-xs bg-slate-800 hover:bg-slate-700"><Plus className="w-3 h-3 mr-1"/> Add Year</Button>
                    </div>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded overflow-hidden">
                    <div className="overflow-y-auto h-[300px]">
                        <Table>
                            <TableHeader className="bg-slate-900 sticky top-0">
                                <TableRow className="hover:bg-slate-900 border-slate-800">
                                    <TableHead className="h-8 text-xs w-20">Year</TableHead>
                                    <TableHead className="h-8 text-xs">Rate (bopd)</TableHead>
                                    <TableHead className="h-8 text-xs text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profile.map((row, i) => (
                                    <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                        <TableCell className="p-1">
                                            <Input 
                                                className="h-7 text-xs bg-transparent border-0" 
                                                value={row.year} 
                                                onChange={e => updateRow(i, 'year', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input 
                                                type="number"
                                                className="h-7 text-xs bg-transparent border-0" 
                                                value={row.oil_rate} 
                                                onChange={e => updateRow(i, 'oil_rate', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="p-1 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => removeYear(i)} className="h-6 w-6 p-0 text-slate-500 hover:text-red-400">
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <Card className="bg-slate-950 border-slate-800 flex flex-col">
                <CardHeader className="py-3 border-b border-slate-900">
                    <CardTitle className="text-xs font-medium text-slate-400 uppercase">Production Forecast</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-2 min-h-[250px]">
                    <ProductionProfileChart data={profile} />
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductionProfileManager;