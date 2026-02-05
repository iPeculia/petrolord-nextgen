import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import SectionEditorModal from '../modals/SectionEditorModal';

const SectionManagementStep = ({ sections, setSections }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const handleAddSection = () => {
    setEditingSection(null);
    setEditorOpen(true);
  };

  const handleEditSection = (section, index) => {
    setEditingSection({ ...section, index });
    setEditorOpen(true);
  };

  const handleDeleteSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleSaveSection = (sectionData) => {
    if (editingSection) {
      const newSections = [...sections];
      newSections[editingSection.index] = sectionData;
      setSections(newSections);
    } else {
      setSections([...sections, { ...sectionData, tempId: Date.now() }]);
    }
  };

  // Validate overlap and gaps
  const validationError = useMemo(() => {
    const sortedSections = [...sections].sort((a, b) => a.top_depth - b.top_depth);
    for (let i = 0; i < sortedSections.length; i++) {
       if (sortedSections[i].top_depth >= sortedSections[i].bottom_depth) {
           return "Invalid Interval: Top depth must be less than bottom depth.";
       }
       if (i < sortedSections.length - 1) {
           if (sortedSections[i].bottom_depth > sortedSections[i+1].top_depth) {
               return "Overlap Detected: Sections must not overlap.";
           }
       }
    }
    return null;
  }, [sections]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-400">
          Define mechanical string configuration from top to bottom.
        </div>
        <Button size="sm" onClick={handleAddSection} className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-700">
          <Plus className="w-4 h-4 mr-2" /> Add Section
        </Button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#1E293B]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900 border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 w-[50px]">#</TableHead>
              <TableHead className="text-slate-400">Interval (ft)</TableHead>
              <TableHead className="text-slate-400">Weight</TableHead>
              <TableHead className="text-slate-400">Grade</TableHead>
              <TableHead className="text-slate-400">Conn</TableHead>
              <TableHead className="text-slate-400 text-right">Burst/Collapse</TableHead>
              <TableHead className="text-right text-slate-400 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <span>No sections defined yet.</span>
                    <Button variant="link" onClick={handleAddSection} className="text-[#BFFF00]">Add your first section</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sections.map((section, idx) => (
                <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-slate-500 font-mono">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-slate-200">{section.top_depth} - {section.bottom_depth}</TableCell>
                  <TableCell className="text-slate-300">{section.weight} ppf</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/50 bg-emerald-500/10">
                      {section.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">{section.connection_type}</TableCell>
                  <TableCell className="text-slate-400 text-right font-mono text-xs">
                    {section.burst_rating} / {section.collapse_rating}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-700 hover:text-blue-400" onClick={() => handleEditSection(section, idx)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-700 hover:text-red-400" onClick={() => handleDeleteSection(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-sm animate-pulse">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <SectionEditorModal 
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveSection}
        initialData={editingSection}
        mode={editingSection ? 'edit' : 'add'}
      />
    </div>
  );
};

export default SectionManagementStep;