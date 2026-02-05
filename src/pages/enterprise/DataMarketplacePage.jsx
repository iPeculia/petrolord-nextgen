import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ShoppingCart, Download, Database, Globe } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const DataMarketplacePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('marketplace_items')
            .select('*');
        
        // Mock data if empty for demo purposes
        if (!data || data.length === 0) {
            setItems([
                { id: 1, title: 'North Sea Seismic Vol. 4', provider: 'GeoData Corp', price: 4500, category: 'Seismic', type: '3D SEGY' },
                { id: 2, title: 'Permian Basin Well Logs', provider: 'PetroInfo', price: 1200, category: 'Petrophysics', type: 'LAS Bundle' },
                { id: 3, title: 'Global Pressure Gradient Map', provider: 'EarthInsights', price: 0, category: 'Regional', type: 'Report' },
                { id: 4, title: 'Gulf of Mexico Production History', provider: 'EnergyData', price: 2500, category: 'Production', type: 'CSV Time Series' },
                { id: 5, title: 'Carbonate Reservoir Analogues', provider: 'University Research', price: 500, category: 'Research', type: 'PDF + Data' },
                { id: 6, title: 'Offshore Facility Specifications', provider: 'Engineering Ltd', price: 3000, category: 'Facilities', type: 'CAD Models' },
            ]);
        } else {
            setItems(data);
        }
        setLoading(false);
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
       <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-8 rounded-2xl border border-blue-900/30">
           <div className="max-w-3xl">
               <h1 className="text-3xl font-bold text-white mb-4">Data Marketplace</h1>
               <p className="text-blue-100 mb-8 text-lg">Discover, purchase, and integrate premium subsurface data sets from verified providers.</p>
               
               <div className="flex gap-4">
                   <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                       <Input 
                           className="pl-10 bg-slate-900/80 border-slate-700 text-white h-12" 
                           placeholder="Search for seismic, logs, reports..." 
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                       />
                   </div>
                   <Button size="lg" className="bg-[#BFFF00] text-black hover:bg-[#A8E600]">
                       <Filter className="mr-2 h-4 w-4" /> Filters
                   </Button>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredItems.map(item => (
               <Card key={item.id} className="bg-slate-800 border-slate-700 text-white flex flex-col hover:border-[#BFFF00] transition-all duration-300 group">
                   <CardHeader>
                       <div className="flex justify-between items-start mb-2">
                           <Badge variant="secondary" className="bg-slate-700 text-blue-300 hover:bg-slate-600">{item.category}</Badge>
                           {item.price === 0 && <Badge className="bg-green-500/20 text-green-400">Free</Badge>}
                       </div>
                       <CardTitle className="line-clamp-2 text-xl group-hover:text-[#BFFF00] transition-colors">{item.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="flex-1">
                       <div className="space-y-3 text-sm text-gray-400">
                           <div className="flex items-center gap-2">
                               <Globe className="w-4 h-4" /> {item.provider}
                           </div>
                           <div className="flex items-center gap-2">
                               <Database className="w-4 h-4" /> {item.type}
                           </div>
                       </div>
                   </CardContent>
                   <CardFooter className="border-t border-slate-700 pt-4 flex justify-between items-center">
                       <span className="text-2xl font-bold text-white">
                           {item.price === 0 ? 'Free' : `$${item.price.toLocaleString()}`}
                       </span>
                       <Button size="sm" variant={item.price === 0 ? "outline" : "default"} className={item.price > 0 ? "bg-[#BFFF00] text-black hover:bg-[#A8E600]" : "border-slate-600 hover:bg-slate-700"}>
                           {item.price === 0 ? <Download className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                           {item.price === 0 ? 'Download' : 'Purchase'}
                       </Button>
                   </CardFooter>
               </Card>
           ))}
       </div>
    </div>
  );
};

export default DataMarketplacePage;