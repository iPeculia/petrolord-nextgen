import React, { useState } from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Search, 
  Trash2, 
  Edit, 
  Eye,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RiskScoreBadge = ({ score }) => {
  let colorClass = "bg-green-500/20 text-green-400 border-green-500/50";
  if (score > 15) {
    colorClass = "bg-red-500/20 text-red-400 border-red-500/50";
  } else if (score >= 5) {
    colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  }
  
  return (
    <Badge variant="outline" className={cn("font-mono font-medium border", colorClass)}>
      {score.toFixed(1)}
    </Badge>
  );
};

const RiskRegisterTable = () => {
  const { 
    currentProject, 
    riskRegister, 
    setCurrentRisk, 
    deleteRisk 
  } = useRiskAnalysis();
  
  const [sortConfig, setSortConfig] = useState({ key: 'risk_score', direction: 'desc' });
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (!currentProject) return null;

  const projectRisks = riskRegister.filter(r => r.project_id === currentProject.project_id);

  const filteredRisks = projectRisks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || risk.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAction = (action, risk) => {
    if (action === 'view' || action === 'edit') {
      setCurrentRisk(risk);
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete "${risk.title}"?`)) {
        deleteRisk(risk.risk_id);
      }
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search risks..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-8 bg-[#262626] border-[#404040] text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
                className="bg-[#262626] border border-[#404040] text-slate-200 text-sm rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="All">All Categories</option>
                <option value="Market">Market</option>
                <option value="Technical">Technical</option>
                <option value="Operational">Operational</option>
                <option value="Regulatory">Regulatory</option>
                <option value="Environmental">Environmental</option>
            </select>
        </div>
      </div>

      <div className="rounded-md border border-[#333] flex-1 overflow-auto bg-[#1a1a1a]">
        <Table>
          <TableHeader className="bg-[#262626] sticky top-0 z-10">
            <TableRow className="border-[#333] hover:bg-[#262626]">
              <TableHead className="w-[300px] cursor-pointer text-slate-300" onClick={() => requestSort('title')}>
                <div className="flex items-center gap-1">Title <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-slate-300">Category</TableHead>
              <TableHead className="text-right cursor-pointer text-slate-300" onClick={() => requestSort('probability_percent')}>
                 <div className="flex items-center justify-end gap-1">Prob (%) <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-right cursor-pointer text-slate-300" onClick={() => requestSort('impact_value')}>
                 <div className="flex items-center justify-end gap-1">Impact ($) <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center cursor-pointer text-slate-300" onClick={() => requestSort('risk_score')}>
                 <div className="flex items-center justify-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center text-slate-300">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRisks.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                        No risks found. Add a risk to get started.
                    </TableCell>
                </TableRow>
            ) : (
                sortedRisks.map((risk) => (
                <TableRow key={risk.risk_id} className="border-[#333] hover:bg-[#262626] group">
                    <TableCell className="font-medium text-slate-200">
                        <div className="flex flex-col">
                            <span>{risk.title}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[280px]">{risk.description}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-slate-400">{risk.category}</TableCell>
                    <TableCell className="text-right text-slate-300">{risk.probability_percent}%</TableCell>
                    <TableCell className="text-right text-slate-300">${risk.impact_value.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                    <RiskScoreBadge score={risk.risk_score} />
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-[#333] text-slate-300 hover:bg-[#444] border-none text-[10px]">
                            {risk.status || 'Active'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#262626] border-[#404040] text-slate-200">
                        <DropdownMenuItem onClick={() => handleAction('view', risk)} className="cursor-pointer focus:bg-[#333]">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('edit', risk)} className="cursor-pointer focus:bg-[#333]">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('delete', risk)} className="text-red-400 cursor-pointer focus:bg-[#333] focus:text-red-300">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RiskRegisterTable;