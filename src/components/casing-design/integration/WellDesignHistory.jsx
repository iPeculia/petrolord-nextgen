import React from 'react';
import { useDesigns, useCasingOperations } from '@/hooks/useCasingDesign';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, ArrowRight, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../utils/calculationUtils';

const WellDesignHistory = ({ wellId }) => {
    const { designs, loading, refetch } = useDesigns();
    const { toggleDesignActive } = useCasingOperations();
    const navigate = useNavigate();

    // Filter designs for this well
    const wellDesigns = designs.filter(d => d.well_id === wellId);

    if (loading) return <div className="text-slate-500 text-sm">Loading history...</div>;
    if (wellDesigns.length === 0) return <div className="text-slate-500 text-sm italic">No casing designs found for this well.</div>;

    const handleToggleActive = async (design) => {
        await toggleDesignActive(design.id, wellId, !design.is_active);
        refetch();
    };

    return (
        <Card className="bg-[#1E293B] border-slate-700">
            <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Design History
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800">
                            <TableHead className="text-slate-400 w-[50px]">Status</TableHead>
                            <TableHead className="text-slate-400">Design Name</TableHead>
                            <TableHead className="text-slate-400">Type</TableHead>
                            <TableHead className="text-slate-400">OD</TableHead>
                            <TableHead className="text-slate-400">Created</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wellDesigns.map((design) => (
                            <TableRow key={design.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell>
                                    <button 
                                        onClick={() => handleToggleActive(design)}
                                        title={design.is_active ? "Currently Active Design" : "Set as Active"}
                                        className="focus:outline-none transition-transform active:scale-95"
                                    >
                                        {design.is_active ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                                        )}
                                    </button>
                                </TableCell>
                                <TableCell className="font-medium text-slate-200">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        {design.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                                        {design.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-slate-300">{design.od}"</TableCell>
                                <TableCell className="text-slate-500 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(design.created_at).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                        onClick={() => navigate(`/dashboard/modules/drilling/casing-design/${design.id}`)}
                                    >
                                        View <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default WellDesignHistory;