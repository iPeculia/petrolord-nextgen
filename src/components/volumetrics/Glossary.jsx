import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

const GLOSSARY_TERMS = [
    { term: "STOIIP", def: "Stock Tank Oil Initially In Place. The total volume of oil stored in a reservoir prior to production." },
    { term: "GIIP", def: "Gas Initially In Place. Total gas volume in reservoir conditions." },
    { term: "GRV", def: "Gross Rock Volume. The total volume of rock within the trap above the oil-water contact." },
    { term: "Porosity", def: "The percentage of void space in a rock. It measures the rock's capacity to hold fluid." },
    { term: "Permeability", def: "A measure of the ability of a material (such as rocks) to transmit fluids." },
    { term: "Water Saturation (Sw)", def: "The fraction of the pore volume occupied by water." },
    { term: "Formation Volume Factor (Bo)", def: "The ratio of the volume of oil at reservoir conditions to the volume of oil at standard conditions." },
    { term: "Recovery Factor", def: "The percentage of hydrocarbons that can be technically and economically recovered." },
    { term: "Net-to-Gross (NTG)", def: "The ratio of the thickness of the reservoir quality rock to the total thickness of the interval." },
    { term: "HCPV", def: "Hydrocarbon Pore Volume. Pore volume occupied by hydrocarbons. GRV * NTG * Phi * (1-Sw)." },
    { term: "P10/P50/P90", def: "Probability percentiles used in resource estimation. P90 = High confidence/Low estimate, P10 = Low confidence/High estimate." }
];

const Glossary = ({ open, onOpenChange }) => {
    const [search, setSearch] = useState('');
    
    const filtered = GLOSSARY_TERMS.filter(item => 
        item.term.toLowerCase().includes(search.toLowerCase()) || 
        item.def.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
             <DialogContent className="max-w-[600px] max-h-[80vh] bg-slate-950 border-slate-800 text-slate-100 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Volumetrics Glossary</DialogTitle>
                </DialogHeader>
                
                <div className="relative my-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search terms..." 
                        className="pl-8 bg-slate-900 border-slate-800"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 mt-2">
                        {filtered.length === 0 ? (
                            <div className="text-center text-slate-500 py-8">No definitions found.</div>
                        ) : (
                            filtered.map((item, i) => (
                                <div key={i} className="pb-3 border-b border-slate-800 last:border-0">
                                    <h4 className="text-sm font-bold text-[#BFFF00]">{item.term}</h4>
                                    <p className="text-sm text-slate-300 mt-1">{item.def}</p>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
             </DialogContent>
        </Dialog>
    );
};

export default Glossary;