import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Trash2, Copy, AlertTriangle, Upload, Sliders } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DesignerProperties = ({ selectedItems, items, onItemUpdate, onDelete, violations }) => {
  if (selectedItems.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <Sliders className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Select an object to view properties.</p>
        </div>
    );
  }

  // Handle single selection for now
  const selectedId = selectedItems[0];
  const item = items.find(i => i.id === selectedId);
  if (!item) return null;

  const itemViolations = violations.filter(v => v.itemId === item.id);

  const handleChange = (field, value) => {
      onItemUpdate(item.id, { [field]: value });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] border-l border-[#333333]">
        <div className="p-4 border-b border-[#333333] flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                Properties
            </h3>
            <Badge variant="outline" className="text-xs border-slate-600">{item.type}</Badge>
        </div>

        <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
                
                {/* Violations Section */}
                {itemViolations.length > 0 && (
                    <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
                            <AlertTriangle className="w-3 h-3" />
                            Validation Issues
                        </div>
                        {itemViolations.map((v, idx) => (
                            <div key={idx} className="text-xs text-red-300 pl-5 relative">
                                <span className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {v.message}
                            </div>
                        ))}
                    </div>
                )}

                {/* Identification */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identification</h4>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Tag Number</Label>
                        <Input 
                            value={item.tag} 
                            onChange={(e) => handleChange('tag', e.target.value)} 
                            className="bg-slate-900 border-slate-700 h-8 text-xs text-white focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Service Description</Label>
                        <Input 
                            value={item.service || ''} 
                            onChange={(e) => handleChange('service', e.target.value)} 
                            className="bg-slate-900 border-slate-700 h-8 text-xs text-white focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Status</Label>
                        <Select 
                            value={item.status || 'Active'} 
                            onValueChange={(val) => handleChange('status', val)}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700 h-8 text-xs text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-slate-700 text-white">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Proposed">Proposed</SelectItem>
                                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Geometry */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geometry</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Rotation (°)</Label>
                            <div className="flex gap-1">
                                <Input 
                                    type="number"
                                    value={item.rotation || 0} 
                                    onChange={(e) => handleChange('rotation', parseFloat(e.target.value))} 
                                    className="bg-slate-900 border-slate-700 h-8 text-xs text-white"
                                />
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => handleChange('rotation', (item.rotation || 0) + 15)}>
                                    <span className="text-[10px]">+15</span>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Scale</Label>
                            <Input 
                                type="number" step="0.1"
                                value={item.scale_x || 1} 
                                onChange={(e) => handleChange('scale_x', parseFloat(e.target.value))} 
                                className="bg-slate-900 border-slate-700 h-8 text-xs text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Lat</Label>
                            <Input value={item.lat?.toFixed(6)} disabled className="bg-slate-900 border-slate-700 h-8 text-xs text-slate-500" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Lng</Label>
                            <Input value={item.lng?.toFixed(6)} disabled className="bg-slate-900 border-slate-700 h-8 text-xs text-slate-500" />
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Engineering Data */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engineering</h4>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Design Capacity</Label>
                        <Input 
                            value={item.capacity || ''} 
                            onChange={(e) => handleChange('capacity', e.target.value)} 
                            className="bg-slate-900 border-slate-700 h-8 text-xs text-white"
                            placeholder="e.g. 5000 bpd"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Pressure Rating</Label>
                            <Input 
                                value={item.pressure_rating || ''} 
                                onChange={(e) => handleChange('pressure_rating', e.target.value)} 
                                className="bg-slate-900 border-slate-700 h-8 text-xs text-white"
                                placeholder="e.g. 150#"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Material</Label>
                            <Input 
                                value={item.material || ''} 
                                onChange={(e) => handleChange('material', e.target.value)} 
                                className="bg-slate-900 border-slate-700 h-8 text-xs text-white"
                                placeholder="e.g. CS, SS316"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Attachments */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attachments</h4>
                        <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-800">
                            <Upload className="w-3 h-3 text-slate-400" />
                        </Button>
                    </div>
                    <div className="p-3 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 text-center hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <span className="text-[10px] text-slate-500">Drag datasheets or drawings here</span>
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</h4>
                    <Textarea 
                        value={item.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        className="bg-slate-900 border-slate-700 text-xs text-white min-h-[80px] focus:border-blue-500"
                        placeholder="Engineering comments, inspection notes..."
                    />
                </div>

            </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#333333] flex gap-2">
            <Button variant="destructive" className="w-full h-8 text-xs" onClick={() => onDelete(item.id)}>
                <Trash2 className="w-3 h-3 mr-2" /> Delete
            </Button>
            <Button variant="secondary" className="w-full h-8 text-xs">
                <Copy className="w-3 h-3 mr-2" /> Duplicate
            </Button>
        </div>
    </div>
  );
};

export default DesignerProperties;