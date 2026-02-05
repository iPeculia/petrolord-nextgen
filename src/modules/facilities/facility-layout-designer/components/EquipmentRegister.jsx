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
import AddEquipmentModal from './modals/AddEquipmentModal';
import { useToast } from '@/components/ui/use-toast';

const EquipmentRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persistence = useLayoutPersistence();
  const { toast } = useToast();
  
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [layoutId, setLayoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get layout ID from URL or fetch default
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
            if (data && data.equipment) setItems(data.equipment);
        }
        setLoading(false);
    };
    loadData();
  }, [searchParams]);

  const filteredItems = items.filter(item => 
      item.tag.toLowerCase().includes(filter.toLowerCase()) ||
      item.type.toLowerCase().includes(filter.toLowerCase())
  );

  const handleExport = () => {
      const data = filteredItems.map(item => ({
          Tag: item.tag,
          Type: item.type,
          Service: item.properties?.service || '',
          Capacity: item.properties?.capacity || '',
          Pressure: item.properties?.pressure_rating || '',
          Lat: item.lat,
          Lng: item.lng,
          Status: item.status
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Equipment Register");
      XLSX.writeFile(wb, "EquipmentRegister.xlsx");
  };

  const handleAddEquipment = async (newItem) => {
      const saved = await persistence.saveEquipment(newItem, layoutId);
      if (saved) {
          setItems(prev => [...prev, saved]);
          toast({ title: "Equipment Added", description: `${saved.tag} added successfully.` });
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
                    <h1 className="text-2xl font-bold">Equipment Register</h1>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Equipment
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="bg-[#1a1a1a] border-[#333333]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Project Equipment List</CardTitle>
                    <div className="flex gap-2 w-1/3">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search tag or type..." 
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
                                <TableHead className="text-slate-400">Tag</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400">Service</TableHead>
                                <TableHead className="text-slate-400">Capacity</TableHead>
                                <TableHead className="text-slate-400">Pressure</TableHead>
                                <TableHead className="text-slate-400">Coordinates</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        No equipment found. Add equipment via the button or Layout Designer.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map(item => (
                                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-mono font-medium text-blue-400">{item.tag}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.properties?.service || '-'}</TableCell>
                                        <TableCell>{item.properties?.capacity || '-'}</TableCell>
                                        <TableCell>{item.properties?.pressure_rating || '-'}</TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs border border-blue-800">
                                                {item.status || 'Active'}
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
                <AddEquipmentModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddEquipment}
                    layoutId={layoutId}
                />
            )}
        </div>
    </div>
  );
};

export default EquipmentRegister;