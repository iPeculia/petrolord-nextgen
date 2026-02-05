import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const SourcesContext = createContext();

const MOCK_SOURCES = [
  { 
    id: 'src-001', 
    name: 'Well A-12 Logs (LAS)', 
    type: 'Well Log', 
    status: 'active', 
    format: 'LAS 2.0', 
    size: '2.4 MB', 
    lastUpdated: '2024-11-15T10:30:00Z', 
    dataPoints: 15420, 
    owner: 'John Doe',
    description: 'Primary logging run for section 12. Includes GR, RES, DENS, NEUT.'
  },
  { 
    id: 'src-002', 
    name: 'Core Analysis Report #44', 
    type: 'Core Data', 
    status: 'active', 
    format: 'CSV', 
    size: '450 KB', 
    lastUpdated: '2024-11-16T14:20:00Z', 
    dataPoints: 450, 
    owner: 'Sarah Smith',
    description: 'Routine core analysis data from lab. Porosity and Permeability measurements.'
  },
  { 
    id: 'src-003', 
    name: 'Seismic Horizon Export', 
    type: 'Seismic', 
    status: 'archived', 
    format: 'ASCII', 
    size: '12.1 MB', 
    lastUpdated: '2024-10-01T09:00:00Z', 
    dataPoints: 1200500, 
    owner: 'Mike Ross',
    description: 'Exported Top Reservoir horizon from seismic interpretation project.'
  },
  {
    id: 'src-004',
    name: 'Real-time WITSML Stream',
    type: 'Real-time',
    status: 'inactive',
    format: 'WITSML',
    size: '-',
    lastUpdated: '2024-12-01T08:00:00Z',
    dataPoints: 0,
    owner: 'Drilling Ops',
    description: 'Connection to rig site server for real-time LWD data.'
  }
];

export const SourcesProvider = ({ children }) => {
  const { toast } = useToast();
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({ type: 'all', status: 'all', search: '' });

  const addSource = (newSource) => {
    setIsLoading(true);
    setTimeout(() => {
      const source = {
        ...newSource,
        id: `src-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
        status: 'active',
        dataPoints: 0
      };
      setSources(prev => [source, ...prev]);
      setIsLoading(false);
      toast({ title: "Source Added", description: `${source.name} has been successfully added.` });
    }, 1000);
  };

  const updateSource = (id, updates) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    toast({ title: "Source Updated", description: "Changes saved successfully." });
  };

  const deleteSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
    if (selectedSource?.id === id) setSelectedSource(null);
    toast({ title: "Source Deleted", description: "The data source has been removed." });
  };

  const archiveSource = (id) => {
    updateSource(id, { status: 'archived' });
    toast({ title: "Source Archived", description: "Source moved to archive." });
  };
  
  const restoreSource = (id) => {
      updateSource(id, { status: 'active' });
      toast({ title: "Source Restored", description: "Source is now active." });
  }

  const syncSource = (id) => {
    setIsLoading(true);
    setTimeout(() => {
        const updatedSource = sources.find(s => s.id === id);
        if(updatedSource) {
            updateSource(id, { lastUpdated: new Date().toISOString() });
            toast({ title: "Sync Complete", description: `Successfully synced ${updatedSource.name}.` });
        }
        setIsLoading(false);
    }, 2000);
  };

  const filteredSources = sources.filter(s => {
      const matchesType = filter.type === 'all' || s.type.toLowerCase() === filter.type.toLowerCase();
      const matchesStatus = filter.status === 'all' || s.status.toLowerCase() === filter.status.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(filter.search.toLowerCase()) || 
                            s.owner.toLowerCase().includes(filter.search.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <SourcesContext.Provider value={{
      sources,
      filteredSources,
      selectedSource,
      isLoading,
      filter,
      setFilter,
      setSelectedSource,
      addSource,
      updateSource,
      deleteSource,
      archiveSource,
      restoreSource,
      syncSource
    }}>
      {children}
    </SourcesContext.Provider>
  );
};

export const useSources = () => {
  const context = useContext(SourcesContext);
  if (!context) throw new Error('useSources must be used within a SourcesProvider');
  return context;
};