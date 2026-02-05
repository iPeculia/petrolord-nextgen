import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const WellSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
      <Input
        placeholder="Search wells..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 bg-slate-900 border-slate-800 text-xs h-9 focus-visible:ring-1 focus-visible:ring-slate-700"
      />
    </div>
  );
};

export default WellSearch;