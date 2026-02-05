import React, { useState } from 'react';
import { useArtificialLift } from '../../context/ArtificialLiftContext';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import WellsList from '../WellsList';
import WellForm from '../forms/WellForm';
import ProductionDataForm from '../forms/ProductionDataForm'; // Production data often coupled with well setup
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WellsTab = ({ onDesign }) => {
  const { wells } = useArtificialLift();
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editId, setEditId] = useState(null);

  const handleEdit = (id) => {
    setEditId(id);
    setView('edit');
  };

  const handleSuccess = () => {
      setView('list');
      setEditId(null);
  };

  if (view === 'list') {
      return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Well Management</h2>
                    <p className="text-slate-400">Configure and manage your production wells.</p>
                </div>
                <Button onClick={() => setView('create')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Well
                </Button>
            </div>
            
            <WellsList onEdit={handleEdit} onDesign={onDesign} />
        </div>
      );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
             <Button variant="ghost" size="sm" onClick={() => setView('list')} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
             </Button>
             <h2 className="text-xl font-bold tracking-tight text-white border-l border-slate-700 pl-4">
                {view === 'create' ? 'Create New Well' : 'Edit Well Configuration'}
             </h2>
        </div>

        <Tabs defaultValue="geometry" className="space-y-4">
            <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="geometry" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Well Geometry</TabsTrigger>
                {view === 'edit' && <TabsTrigger value="production" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Production Data</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="geometry" className="mt-4">
                <WellForm wellId={editId} onSuccess={handleSuccess} />
            </TabsContent>
            
            <TabsContent value="production" className="mt-4">
                <ProductionDataForm />
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default WellsTab;