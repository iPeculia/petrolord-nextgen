import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import PriceDeckChart from './PriceDeckChart';

const PriceDeckManager = ({ deck, onChange }) => {
    const updateRow = (index, field, val) => {
        const newDeck = [...deck];
        newDeck[index] = { ...newDeck[index], [field]: parseFloat(val) };
        onChange(newDeck);
    };

    const addYear = () => {
        const lastYear = deck.length > 0 ? deck[deck.length-1].year : new Date().getFullYear();
        onChange([...deck, { year: lastYear + 1, oil_price: 60, gas_price: 3 }]);
    };

    const removeYear = (index) => {
        onChange(deck.filter((_, i) => i !== index));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-slate-400 uppercase">Pricing Assumptions</h4>
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
                                    <TableHead className="h-8 text-xs">Oil ($/bbl)</TableHead>
                                    <TableHead className="h-8 text-xs">Gas ($/mcf)</TableHead>
                                    <TableHead className="h-8 text-xs text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deck.map((row, i) => (
                                    <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                        <TableCell className="p-1">
                                            <Input className="h-7 text-xs bg-transparent border-0" value={row.year} onChange={e => updateRow(i, 'year', e.target.value)} />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input type="number" className="h-7 text-xs bg-transparent border-0" value={row.oil_price} onChange={e => updateRow(i, 'oil_price', e.target.value)} />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input type="number" className="h-7 text-xs bg-transparent border-0" value={row.gas_price} onChange={e => updateRow(i, 'gas_price', e.target.value)} />
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
                    <CardTitle className="text-xs font-medium text-slate-400 uppercase">Price Forecast</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-2 min-h-[250px]">
                    <PriceDeckChart data={deck} />
                </CardContent>
            </Card>
        </div>
    );
};

export default PriceDeckManager;