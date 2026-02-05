import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { Download, Eye, Search, FileDown, FileJson } from 'lucide-react';
import { exportWellData } from '@/services/exportService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const WellManager = () => {
    const { wells, activeWell, setActiveWell, wellLogs } = useGlobalDataStore();
    const wellList = Object.values(wells);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWells = wellList.filter(well => 
        well.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (well.metadata?.field && well.metadata.field.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (well.metadata?.operator && well.metadata.operator.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleExport = (wellId, format) => {
        const well = wells[wellId];
        const logs = wellLogs[wellId];
        if (well && logs) {
            exportWellData(well, logs, format);
        } else {
            // If logs aren't loaded, maybe try to load them first or just warn
            // For better UX, we should ideally ensure logs are fetched. 
            // Given store structure, we might need to trigger a fetch or alert.
            // Assuming active well logs are loaded, but others might not be.
            alert("Please ensure well data is loaded (activate the well first) before exporting.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1E293B] text-white">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between gap-4 bg-[#0F172A]">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search by name, field, or operator..." 
                        className="pl-9 bg-[#1E293B] border-gray-700 text-white placeholder:text-gray-500 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-xs text-gray-400">
                    {filteredWells.length} wells found
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-grow overflow-auto">
                {wellList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                        <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-lg font-medium">No wells found</p>
                        <p className="text-sm mt-2 max-w-xs text-center">Import a well file using the "Import New" tab in the Data Panel to get started.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-[#0F172A] sticky top-0 z-10">
                            <TableRow className="hover:bg-[#0F172A] border-gray-700">
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Operator</TableHead>
                                <TableHead className="text-gray-400">Field</TableHead>
                                <TableHead className="text-gray-400">Type</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="text-right text-gray-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWells.map((well) => (
                                <TableRow key={well.id} className={`border-gray-800 transition-colors hover:bg-[#2A3855] ${activeWell === well.id ? "bg-[#2A3855]/60" : ""}`}>
                                    <TableCell className="font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            {well.name}
                                            {activeWell === well.id && (
                                                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold tracking-wider">
                                                    ACTIVE
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-300">{well.metadata?.operator || '-'}</TableCell>
                                    <TableCell className="text-gray-300">{well.metadata?.field || '-'}</TableCell>
                                    <TableCell className="capitalize text-gray-300">{well.metadata?.type || '-'}</TableCell>
                                    <TableCell>
                                         <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            well.metadata?.status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-gray-700 text-gray-400'
                                         }`}>
                                            {well.metadata?.status || 'Unknown'}
                                         </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm"
                                                className="h-8 px-3 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                                                onClick={() => setActiveWell(well.id)}
                                                title="View / Activate"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                View
                                            </Button>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1E293B] border-gray-700 text-white">
                                                    <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer" onClick={() => handleExport(well.id, 'csv')}>
                                                        <FileDown className="w-4 h-4 mr-2 text-green-400" />
                                                        Export CSV
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer" onClick={() => handleExport(well.id, 'json')}>
                                                        <FileJson className="w-4 h-4 mr-2 text-yellow-400" />
                                                        Export JSON
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default WellManager;