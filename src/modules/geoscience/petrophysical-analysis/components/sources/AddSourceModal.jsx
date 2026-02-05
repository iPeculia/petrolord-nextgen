import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, Database, Globe } from 'lucide-react';
import { useSources } from '../../context/SourcesContext';

const AddSourceModal = () => {
  const { addSource } = useSources();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      type: 'Well Log',
      format: 'LAS 2.0',
      description: '',
      owner: 'Current User'
  });

  const handleSubmit = () => {
      addSource(formData);
      setOpen(false);
      setFormData({ name: '', type: 'Well Log', format: 'LAS 2.0', description: '', owner: 'Current User' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Source
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect New Data Source</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Source Name</Label>
                <Input 
                    className="bg-slate-950 border-slate-700" 
                    placeholder="e.g., Well X-01 Logs"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Source Type</Label>
                    <Select 
                        value={formData.type} 
                        onValueChange={(val) => setFormData({...formData, type: val})}
                    >
                        <SelectTrigger className="bg-slate-950 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="Well Log">Well Log</SelectItem>
                            <SelectItem value="Core Data">Core Data</SelectItem>
                            <SelectItem value="Seismic">Seismic</SelectItem>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Real-time">Real-time Stream</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Format / Protocol</Label>
                    <Select 
                        value={formData.format} 
                        onValueChange={(val) => setFormData({...formData, format: val})}
                    >
                        <SelectTrigger className="bg-slate-950 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="LAS 2.0">LAS 2.0</SelectItem>
                            <SelectItem value="LAS 3.0">LAS 3.0</SelectItem>
                            <SelectItem value="DLIS">DLIS</SelectItem>
                            <SelectItem value="CSV">CSV</SelectItem>
                            <SelectItem value="WITSML">WITSML</SelectItem>
                            <SelectItem value="ODBC">ODBC / SQL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea 
                    className="bg-slate-950 border-slate-700 h-24" 
                    placeholder="Optional details about this data source..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            {/* Fake Connection Test Area */}
            <div className="p-4 rounded bg-slate-950 border border-slate-800 border-dashed flex items-center justify-center flex-col gap-2 text-slate-400 cursor-pointer hover:bg-slate-950/50 transition-colors">
                <Upload className="w-8 h-8 text-slate-600" />
                <p className="text-sm">Drag & drop file or click to configure connection</p>
            </div>
        </div>

        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500 text-white">Create Source</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSourceModal;