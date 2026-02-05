import React, { useState } from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search,
  Filter,
  AlertTriangle,
  FolderOpen,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const RiskItem = ({ risk, isActive, onClick, isCollapsed }) => {
  let scoreColor = "text-green-500";
  let borderColor = "border-green-500/30";
  
  if (risk.risk_score > 15) {
    scoreColor = "text-red-500";
    borderColor = "border-red-500/30";
  } else if (risk.risk_score >= 5) {
    scoreColor = "text-yellow-500";
    borderColor = "border-yellow-500/30";
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-3 cursor-pointer transition-all border-l-2",
        isActive 
          ? "bg-blue-600/10 border-blue-500" 
          : "hover:bg-[#262626] border-transparent"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded flex items-center justify-center shrink-0 border bg-[#1a1a1a]",
        borderColor
      )}>
        <span className={cn("text-xs font-bold", scoreColor)}>
          {Math.round(risk.risk_score)}
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm font-medium truncate transition-colors",
            isActive ? "text-blue-400" : "text-slate-300 group-hover:text-slate-100"
          )}>
            {risk.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{risk.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const LeftSidebar = () => {
  const { 
    currentProject, 
    riskRegister, 
    currentRisk, 
    setCurrentRisk,
    addRisk,
    leftSidebarCollapsed, 
    toggleLeftSidebar 
  } = useRiskAnalysis();
  
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);
  const [newRiskData, setNewRiskData] = useState({
    title: '',
    category: 'Market',
    probability_percent: 50,
    impact_value: 0,
    impact_type: 'Financial'
  });

  const projectRisks = riskRegister.filter(
    r => r.project_id === currentProject?.project_id && 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRisk = () => {
    if (!currentProject) return;
    
    addRisk({
      ...newRiskData,
      project_id: currentProject.project_id,
      owner: user?.id
    });
    
    setIsAddRiskOpen(false);
    setNewRiskData({
      title: '',
      category: 'Market',
      probability_percent: 50,
      impact_value: 0,
      impact_type: 'Financial'
    });
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-[#1a1a1a] border-r border-[#333] transition-all duration-300 ease-in-out z-40",
        leftSidebarCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-[50px] flex items-center px-3 border-b border-[#333] shrink-0 justify-between">
        {!leftSidebarCollapsed && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Risk Register
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-slate-400 hover:text-white ml-auto"
          onClick={toggleLeftSidebar}
        >
          {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Projects Section (Collapsed view icon only) */}
      <div className="py-2 border-b border-[#333]">
         {leftSidebarCollapsed ? (
            <div className="flex justify-center py-2" title="Projects">
               <FolderOpen className="w-5 h-5 text-slate-400" />
            </div>
         ) : (
            <div className="px-3 py-2">
               <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Projects</span>
               </div>
               <div className="pl-6 text-xs text-slate-500 truncate">
                  {currentProject ? currentProject.name : 'No project selected'}
               </div>
            </div>
         )}
      </div>

      {/* Search Bar */}
      {!leftSidebarCollapsed && (
        <div className="p-3 border-b border-[#333]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-3 h-3 text-slate-500" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search risks..." 
              className="h-8 pl-7 bg-[#262626] border-[#333] text-xs focus:ring-blue-500/20"
            />
          </div>
        </div>
      )}

      {/* Risks List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {projectRisks.map(risk => (
            <RiskItem 
              key={risk.risk_id}
              risk={risk}
              isActive={currentRisk?.risk_id === risk.risk_id}
              onClick={() => setCurrentRisk(risk)}
              isCollapsed={leftSidebarCollapsed}
            />
          ))}
          {projectRisks.length === 0 && !leftSidebarCollapsed && (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500">No risks found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer / Add Button */}
      <div className="p-3 border-t border-[#333] shrink-0">
        {leftSidebarCollapsed ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddRiskOpen(true)}
            disabled={!currentProject}
          >
            <Plus className="w-5 h-5" />
          </Button>
        ) : (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => setIsAddRiskOpen(true)}
            disabled={!currentProject}
          >
            <Plus className="w-4 h-4" />
            <span>Add Risk</span>
          </Button>
        )}
      </div>

      {/* Add Risk Dialog */}
      <Dialog open={isAddRiskOpen} onOpenChange={setIsAddRiskOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-slate-200">
          <DialogHeader>
            <DialogTitle>Add New Risk</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Risk Title</Label>
              <Input 
                value={newRiskData.title}
                onChange={e => setNewRiskData({...newRiskData, title: e.target.value})}
                className="bg-[#262626] border-[#333]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-[#333] bg-[#262626] px-3 py-2 text-sm text-slate-200"
                  value={newRiskData.category}
                  onChange={e => setNewRiskData({...newRiskData, category: e.target.value})}
                >
                  <option>Market</option>
                  <option>Technical</option>
                  <option>Operational</option>
                  <option>Regulatory</option>
                  <option>Environmental</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Impact Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-[#333] bg-[#262626] px-3 py-2 text-sm text-slate-200"
                  value={newRiskData.impact_type}
                  onChange={e => setNewRiskData({...newRiskData, impact_type: e.target.value})}
                >
                  <option>Financial</option>
                  <option>Schedule</option>
                  <option>Technical</option>
                  <option>Reputational</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Probability (%)</Label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={newRiskData.probability_percent}
                  onChange={e => setNewRiskData({...newRiskData, probability_percent: Number(e.target.value)})}
                  className="bg-[#262626] border-[#333]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Impact Value ($)</Label>
                <Input 
                  type="number"
                  min="0"
                  value={newRiskData.impact_value}
                  onChange={e => setNewRiskData({...newRiskData, impact_value: Number(e.target.value)})}
                  className="bg-[#262626] border-[#333]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRiskOpen(false)} className="border-[#333] text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleAddRisk} className="bg-blue-600 text-white">
              Add Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftSidebar;