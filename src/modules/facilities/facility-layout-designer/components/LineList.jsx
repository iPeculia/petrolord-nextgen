import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, Download, Filter, Search, Loader2, Plus } from 'lucide-react';
import { useLayoutPersistence } from '../utils/layoutPersistence';
import * as XLSX from 'xlsx';
import AddLineModal from './modals/AddLineModal';
import { useToast } from '@/components/ui/use-toast';

const LineList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persistence = useLayoutPersistence();
  const { toast } = useToast();

  const [lines, setLines] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [layoutId, setLayoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        let id = searchParams.get('layout');
        
        if (!id) {
             id = await persistence.getOrCreateDefaultLayout();
        }
        setLayoutId(id);

        if (id) {
            const data = await persistence.loadLayoutData(id);
            if (data) {
                setLines(data.lines || []);
                setEquipment(data.equipment || []);
            }
        }
        setLoading(false);
    };
    loadData();
  }, [searchParams]);

  const filteredLines = lines.filter(line => 
      line.line_id.toLowerCase().includes(filter.toLowerCase()) ||
      line.from_tag.toLowerCase().includes(filter.toLowerCase()) ||
      line.to_tag.toLowerCase().includes(filter.toLowerCase())
  );

  const handleExport = () => {
      const data = filteredLines.map(line => ({
          LineID: line.line_id,
          From: line.from_tag,
          To: line.to_tag,
          Size: line.properties?.size,
          Spec: line.properties?.spec,
          Fluid: line.properties?.fluid,
          Material: line.properties?.material,
          Length: 'N/A', // Calculated in real app
          Status: line.status
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Line List");
      XLSX.writeFile(wb, "LineList.xlsx");
  };

  const handleAddLine = async (newLine) => {
      const saved = await persistence.saveLine(newLine, layoutId);
      if (saved) {
          setLines(prev => [...prev, saved]);
          toast({ title: "Line Added", description: `${saved.line_id} added successfully.` });
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Line List</h1>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Line
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="bg-[#1a1a1a] border-[#333333]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Pipeline Schedule</CardTitle>
                    <div className="flex gap-2 w-1/3">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search line id, from/to..." 
                                className="pl-9 bg-[#0f172a] border-slate-700 text-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-slate-800/50">
                                <TableHead className="text-slate-400">Line ID</TableHead>
                                <TableHead className="text-slate-400">Size</TableHead>
                                <TableHead className="text-slate-400">Spec</TableHead>
                                <TableHead className="text-slate-400">From</TableHead>
                                <TableHead className="text-slate-400">To</TableHead>
                                <TableHead className="text-slate-400">Fluid</TableHead>
                                <TableHead className="text-slate-400">Material</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLines.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                        No pipelines defined. Draw lines in the Layout Designer or Add Line.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLines.map(line => (
                                    <TableRow key={line.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-mono font-medium text-emerald-400">{line.line_id}</TableCell>
                                        <TableCell>{line.properties?.size || '-'}</TableCell>
                                        <TableCell>{line.properties?.spec || '-'}</TableCell>
                                        <TableCell className="font-mono">{line.from_tag}</TableCell>
                                        <TableCell className="font-mono">{line.to_tag}</TableCell>
                                        <TableCell>{line.properties?.fluid || '-'}</TableCell>
                                        <TableCell>{line.properties?.material || '-'}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full bg-emerald-900/50 text-emerald-400 text-xs border border-emerald-800">
                                                {line.status || 'Proposed'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             {layoutId && (
                <AddLineModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddLine}
                    layoutId={layoutId}
                    equipmentList={equipment}
                />
            )}
        </div>
    </div>
  );
};

export default LineList;