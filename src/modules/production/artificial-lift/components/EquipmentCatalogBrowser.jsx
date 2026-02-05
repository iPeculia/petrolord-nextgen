import React, { useState } from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search, Filter, PlusCircle, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EquipmentCatalogBrowser = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterManufacturer, setFilterManufacturer] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState({});

  // Mock catalog data (since we don't have a backend population script for this yet)
  const catalogItems = [
    { id: '1', category: 'ESP Pump', manufacturer: 'Schlumberger', model: 'REDA Maximus', specs: { flow: '1000-5000 bpd', head: '50ft/stage' }, cost: 45000, availability: 'In Stock' },
    { id: '2', category: 'ESP Pump', manufacturer: 'Baker Hughes', model: 'Centrilift Flex', specs: { flow: '500-3000 bpd', head: '60ft/stage' }, cost: 42000, availability: '2-4 weeks' },
    { id: '3', category: 'Motor', manufacturer: 'Schlumberger', model: 'Dominator 562', specs: { power: '200 HP', voltage: '2400V' }, cost: 25000, availability: 'In Stock' },
    { id: '4', category: 'Gas Lift Valve', manufacturer: 'Weatherford', model: 'W-1R', specs: { size: '1.5 in', type: 'Wireline' }, cost: 2500, availability: 'In Stock' },
    { id: '5', category: 'Rod Pump', manufacturer: 'Harbison-Fischer', model: 'API 25-175', specs: { bore: '1.75 in', stroke: '144 in' }, cost: 8000, availability: '4-8 weeks' },
  ];

  const filteredItems = catalogItems.filter(item => {
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    const matchesManufacturer = filterManufacturer === "All" || item.manufacturer === filterManufacturer;
    const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesManufacturer && matchesSearch;
  });

  const handleAdd = (id, model) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
    toast({
        title: "Equipment Added",
        description: `${model} has been added to your current design configuration.`,
    });
    // In a real scenario, this would update the context's current design equipment list
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search by model..." 
                className="pl-9 bg-slate-800 border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Category" />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="ESP Pump">ESP Pump</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Gas Lift Valve">Gas Lift Valve</SelectItem>
                <SelectItem value="Rod Pump">Rod Pump</SelectItem>
            </SelectContent>
        </Select>
        <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="All">All Manufacturers</SelectItem>
                <SelectItem value="Schlumberger">Schlumberger</SelectItem>
                <SelectItem value="Baker Hughes">Baker Hughes</SelectItem>
                <SelectItem value="Weatherford">Weatherford</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredItems.length === 0 ? (
             <div className="p-8 text-center text-slate-500 bg-slate-800/30 rounded-lg">
                No equipment found matching your filters.
             </div>
        ) : (
            filteredItems.map((item) => (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-slate-400 border-slate-600">{item.category}</Badge>
                                <span className="text-xs text-slate-500">{item.manufacturer}</span>
                            </div>
                            <h4 className="text-lg font-medium text-white">{item.model}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
                                {Object.entries(item.specs).map(([key, val]) => (
                                    <span key={key} className="capitalize">{key}: <span className="text-slate-200">{val}</span></span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto justify-between">
                            <div className="text-right">
                                <div className="text-lg font-bold text-white">${item.cost.toLocaleString()}</div>
                                <div className={`text-xs ${item.availability === 'In Stock' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {item.availability}
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                className={`${addedItems[item.id] ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
                                onClick={() => handleAdd(item.id, item.model)}
                                disabled={addedItems[item.id]}
                            >
                                {addedItems[item.id] ? (
                                    <><Check className="w-4 h-4 mr-2" /> Added</>
                                ) : (
                                    <><PlusCircle className="w-4 h-4 mr-2" /> Add to Design</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default EquipmentCatalogBrowser;