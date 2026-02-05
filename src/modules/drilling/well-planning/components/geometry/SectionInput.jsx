import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';

const SectionInput = ({ section, onChange, onDelete, isFirst }) => {
  const handleChange = (field, value) => {
    onChange(section.id, field, value);
  };

  return (
    <div className="section-card group relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-slate-600 cursor-move" />
          <span className="text-xs font-semibold text-[#FFC107] uppercase">
            {section.name || 'New Section'}
          </span>
        </div>
        {!isFirst && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-500 hover:text-red-400"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <Label className="text-[10px] text-slate-400">Type</Label>
          <Select 
            value={section.type} 
            onValueChange={(val) => handleChange('type', val)}
          >
            <SelectTrigger className="h-7 text-xs bg-[#1a1a2e] border-[#2f2f50]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Surface">Surface</SelectItem>
              <SelectItem value="Vertical">Vertical</SelectItem>
              <SelectItem value="Build">Build</SelectItem>
              <SelectItem value="Hold">Hold</SelectItem>
              <SelectItem value="Drop">Drop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-slate-400">Length (ft)</Label>
          <Input 
            type="number" 
            value={section.length} 
            onChange={(e) => handleChange('length', e.target.value)}
            className="h-7 text-xs bg-[#1a1a2e] border-[#2f2f50]"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-[10px] text-slate-400">Inc (°)</Label>
          <Input 
            type="number" 
            value={section.inclination} 
            onChange={(e) => handleChange('inclination', e.target.value)}
            className="h-7 text-xs bg-[#1a1a2e] border-[#2f2f50]"
          />
        </div>
        <div>
          <Label className="text-[10px] text-slate-400">Azi (°)</Label>
          <Input 
            type="number" 
            value={section.azimuth} 
            onChange={(e) => handleChange('azimuth', e.target.value)}
            className="h-7 text-xs bg-[#1a1a2e] border-[#2f2f50]"
          />
        </div>
        <div>
          <Label className="text-[10px] text-slate-400">Hole (in)</Label>
          <Input 
            type="number" 
            value={section.holeSize} 
            onChange={(e) => handleChange('holeSize', e.target.value)}
            className="h-7 text-xs bg-[#1a1a2e] border-[#2f2f50]"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionInput;