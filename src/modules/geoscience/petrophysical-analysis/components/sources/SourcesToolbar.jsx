import React from 'react';
import { useSources } from '../../context/SourcesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Download, RefreshCw } from 'lucide-react';
import AddSourceModal from './AddSourceModal';

const SourcesToolbar = () => {
  const { filter, setFilter, isLoading } = useSources();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-950 border-b border-slate-800">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">Data Sources</h2>
        <p className="text-xs text-slate-400">Manage external data connections and files</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
           <Input 
              placeholder="Search sources..." 
              className="pl-8 bg-slate-900 border-slate-700 text-sm"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>

        <Select value={filter.type} onValueChange={(val) => setFilter(prev => ({ ...prev, type: val }))}>
            <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="well log">Well Logs</SelectItem>
                <SelectItem value="core data">Core Data</SelectItem>
                <SelectItem value="seismic">Seismic</SelectItem>
                <SelectItem value="real-time">Real-time</SelectItem>
            </SelectContent>
        </Select>

        <Select value={filter.status} onValueChange={(val) => setFilter(prev => ({ ...prev, status: val }))}>
            <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
        </Select>

        <AddSourceModal />
      </div>
    </div>
  );
};

export default SourcesToolbar;