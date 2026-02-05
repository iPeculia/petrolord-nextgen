import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, MoreVertical, FileText, Trash2, Edit, Database,
  ChevronRight, Layers, LayoutGrid, List as ListIcon, Copy, Clock, BookTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDesigns, useCasingOperations, useDesignDetails } from '@/hooks/useCasingDesign';
import DesignWizardModal from '@/components/casing-design/modals/DesignWizardModal';
import TemplateLibraryModal from '@/components/casing-design/templates/TemplateLibraryModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { DesignContextProvider, useDesignContext } from '@/components/casing-design/context/DesignContextProvider';
import DesignContextHeader from '@/components/casing-design/integration/DesignContextHeader';
import WellDesignHistory from '@/components/casing-design/integration/WellDesignHistory';

// Helper component to load design details for editing
const EditDesignLoader = ({ designId, onClose, onSuccess }) => {
    const { design, sections, loading } = useDesignDetails(designId);
    
    if (loading) return null; 
    if (!design) return null;

    return (
        <DesignWizardModal 
            isOpen={true}
            onClose={onClose}
            onSuccess={onSuccess}
            initialData={{ design, sections }}
        />
    );
};

// Internal content component to use context
const CasingDesignContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeWell, hasActiveContext } = useDesignContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); 
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('casingDesignViewMode') || 'table');
  
  // Modals State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [templateData, setTemplateData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { designs, loading, refetch } = useDesigns(); 
  const { deleteDesign } = useCasingOperations();

  // Filtering Logic
  const filteredDesigns = designs.filter(d => {
    // 1. Text Filter
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.wells?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    // 2. Type Filter
    const matchesType = filterType === 'All' || d.type === filterType;
    
    // 3. Context Filter (if active context exists)
    const matchesContext = activeWell ? d.well_id === activeWell.id : true;

    return matchesSearch && matchesType && matchesContext;
  });

  const totalPages = Math.ceil(filteredDesigns.length / itemsPerPage);
  const paginatedDesigns = filteredDesigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this design? This action cannot be undone.")) {
          try {
              await deleteDesign(id);
              refetch();
          } catch (e) { }
      }
  };

  const handleDuplicate = async (design) => {
      try {
          const { data: newDesign } = await supabase
            .from('casing_tubing_designs')
            .insert([{
                name: `${design.name} (Copy)`,
                type: design.type,
                od: design.od,
                well_id: design.well_id,
                project_id: design.project_id
            }])
            .select()
            .single();

          if (newDesign) {
             const { data: sections } = await supabase
                .from('design_sections')
                .select('*')
                .eq('design_id', design.id);
             
             if (sections && sections.length > 0) {
                 const newSections = sections.map(s => ({
                     ...s,
                     id: undefined, 
                     design_id: newDesign.id
                 }));
                 await supabase.from('design_sections').insert(newSections);
             }
          }
          toast({ title: "Design Duplicated", description: `Created copy of ${design.name}` });
          refetch();
      } catch (e) {
         toast({ title: "Error", description: "Failed to duplicate design", variant: "destructive" });
      }
  };

  const toggleViewMode = (mode) => {
      setViewMode(mode);
      localStorage.setItem('casingDesignViewMode', mode);
  };

  const handleCreateNew = () => {
      setEditingId(null);
      setTemplateData(null);
      setWizardOpen(true);
  };

  const handleEdit = (id) => {
      setEditingId(id);
  };

  const handleUseTemplate = (template) => {
      setTemplateOpen(false);
      const prefillData = {
          design: {
              name: `New ${template.name}`,
              type: template.type,
              od: template.od,
              description: template.description
          },
          sections: template.sections.map(s => ({ ...s, id: undefined }))
      };
      setTemplateData(prefillData);
      setEditingId(null);
      setWizardOpen(true);
  };

  const EmptyState = () => (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-[#1E293B]/50 rounded-lg border border-slate-800 border-dashed">
          <div className="p-4 rounded-full bg-slate-800/50">
              <Layers className="h-12 w-12 text-slate-500" />
          </div>
          <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">No designs found</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                  {hasActiveContext 
                      ? "No designs found for the current well context. Create one to get started." 
                      : (searchTerm || filterType !== 'All' 
                          ? "Try adjusting your filters or search terms." 
                          : "Get started by creating your first casing or tubing design case.")}
              </p>
          </div>
          <div className="flex gap-2 mt-4">
              <Button onClick={() => setTemplateOpen(true)} variant="outline" className="border-slate-700 text-slate-300">
                  <BookTemplate className="mr-2 h-4 w-4" /> Use Template
              </Button>
              <Button onClick={handleCreateNew} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                  <Plus className="mr-2 h-4 w-4" /> Create New Design
              </Button>
          </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 space-y-6">
          <div className="space-y-4">
              <div className="flex items-center text-sm text-slate-500">
                  <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate('/dashboard/modules/drilling')}>Drilling</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-white">Casing Design</span>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Layers className="h-8 w-8 text-orange-500" />
                    Casing & Tubing Design
                  </h1>
                  <p className="text-slate-400 mt-1">Configure strings, verify grades, and analyze load cases.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setTemplateOpen(true)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                       <BookTemplate className="mr-2 h-4 w-4" /> Templates
                    </Button>
                    <Button onClick={handleCreateNew} className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold shadow-lg shadow-[#BFFF00]/20">
                        <Plus className="mr-2 h-4 w-4" /> Create New Design
                    </Button>
                </div>
              </div>
          </div>

          <DesignContextHeader />
          
          {/* If context is active, show history widget at top */}
          {hasActiveContext && activeWell && (
              <div className="mb-6">
                  <WellDesignHistory wellId={activeWell.id} />
              </div>
          )}

          <Card className="bg-[#1E293B] border-slate-700 sticky top-4 z-20 shadow-xl">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-1 gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0">
                        {['All', 'Casing', 'Tubing'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", filterType === t ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800")}
                            >
                                {t === 'All' ? 'All' : `${t} Only`}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                           placeholder="Search designs..." 
                           className="pl-9 bg-slate-900 border-slate-800 text-white focus:ring-orange-500/50"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                    <Button variant="ghost" size="icon" onClick={() => toggleViewMode('table')} className={cn(viewMode === 'table' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}>
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleViewMode('grid')} className={cn(viewMode === 'grid' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
          </Card>

          {loading ? (
             <div className="space-y-4">
                 {[1, 2, 3].map(i => (<div key={i} className="h-20 w-full bg-slate-800/50 rounded-lg animate-pulse" />))}
             </div>
          ) : paginatedDesigns.length === 0 ? (
             <EmptyState />
          ) : (
             <div className="space-y-6">
                 {viewMode === 'table' ? (
                     <Card className="bg-[#1E293B] border-slate-700 overflow-hidden">
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-slate-800/20">
                                        <TableHead className="text-slate-300 w-[40%]">Design Name</TableHead>
                                        <TableHead className="text-slate-300">Type</TableHead>
                                        <TableHead className="text-slate-300">Top OD</TableHead>
                                        <TableHead className="text-slate-300">Well</TableHead>
                                        <TableHead className="text-slate-300">Last Modified</TableHead>
                                        <TableHead className="text-right text-slate-300 w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedDesigns.map((design) => (
                                        <TableRow key={design.id} className="border-slate-800 hover:bg-slate-800/50 group transition-colors">
                                            <TableCell className="font-medium text-white">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 cursor-pointer hover:text-orange-400 transition-colors" onClick={() => navigate(`/dashboard/modules/drilling/casing-design/${design.id}`)}>
                                                        <FileText className="h-4 w-4 text-slate-400" />
                                                        {design.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("border-opacity-50", design.type === 'Casing' ? "border-blue-500 text-blue-400" : "border-pink-500 text-pink-400")}>
                                                    {design.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-mono">{design.od}"</TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Database className="h-3 w-3" /> {design.wells?.name || 'Unknown Well'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">{new Date(design.updated_at || design.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => handleEdit(design.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => handleDelete(design.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                     </Card>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {paginatedDesigns.map(design => (
                            <Card key={design.id} className="bg-[#1E293B] border-slate-700 hover:border-slate-600 transition-all duration-200 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-slate-800 text-slate-400">
                                                  <MoreVertical className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                                              <DropdownMenuItem onClick={() => handleEdit(design.id)}>
                                                  <Edit className="mr-2 h-4 w-4" /> Edit Design
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                                                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator className="bg-slate-800" />
                                              <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDelete(design.id)}>
                                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                </div>
                                <CardHeader className="pb-3">
                                   <div className="flex justify-between items-start">
                                       <div>
                                          <Badge variant="outline" className={cn("mb-2", design.type === 'Casing' ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-pink-500/50 text-pink-400 bg-pink-500/10")}>
                                              {design.type}
                                          </Badge>
                                          <CardTitle className="text-white text-lg line-clamp-1" title={design.name}>{design.name}</CardTitle>
                                          <CardDescription className="flex items-center gap-1 mt-1">
                                              <Database className="h-3 w-3" /> {design.wells?.name || 'Unknown Well'}
                                          </CardDescription>
                                       </div>
                                   </div>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-slate-500 text-xs uppercase tracking-wider">Top OD</span>
                                            <div className="text-slate-200 font-mono">{design.od}"</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-3 border-t border-slate-800/50 flex justify-between items-center">
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(design.created_at).toLocaleDateString()}
                                    </div>
                                    <Button 
                                      size="sm" variant="ghost" 
                                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 p-0 h-auto font-normal"
                                      onClick={() => navigate(`/dashboard/modules/drilling/casing-design/${design.id}`)}
                                    >
                                        Open <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                         ))}
                     </div>
                 )}
                 {totalPages > 1 && (
                     <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                         <p className="text-sm text-slate-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDesigns.length)} of {filteredDesigns.length} designs</p>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="border-slate-700 text-slate-300">Previous</Button>
                             <div className="text-sm text-slate-400 px-2">Page {currentPage} of {totalPages}</div>
                             <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="border-slate-700 text-slate-300">Next</Button>
                         </div>
                     </div>
                 )}
             </div>
          )}

          {wizardOpen && (
            <DesignWizardModal 
              isOpen={wizardOpen} 
              onClose={() => {
                  setWizardOpen(false);
                  setTemplateData(null); 
              }}
              onSuccess={refetch}
              initialData={templateData} 
            />
          )}
          
          {templateOpen && (
              <TemplateLibraryModal 
                isOpen={templateOpen}
                onClose={() => setTemplateOpen(false)}
                onSelectTemplate={handleUseTemplate}
              />
          )}

          {editingId && (
              <EditDesignLoader 
                designId={editingId}
                onClose={() => setEditingId(null)}
                onSuccess={() => {
                    setEditingId(null);
                    refetch();
                }}
              />
          )}
      </div>
  );
};

const CasingDesignPage = () => {
  return (
    <DesignContextProvider>
      <CasingDesignContent />
    </DesignContextProvider>
  );
};

export default CasingDesignPage;