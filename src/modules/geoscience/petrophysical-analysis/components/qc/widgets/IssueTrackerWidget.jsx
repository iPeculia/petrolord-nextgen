import React, { useState } from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XOctagon, AlertCircle, Filter, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const IssueTrackerWidget = () => {
  const { issues, resolveIssue } = useQC();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredIssues = issues.filter(i => {
      const matchesSeverity = severityFilter === 'all' || i.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || i.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = i.description.toLowerCase().includes(search.toLowerCase()) || i.curveName.toLowerCase().includes(search.toLowerCase());
      return matchesSeverity && matchesType && matchesSearch;
  });

  const severityIcon = {
      'High': <XOctagon className="w-4 h-4 text-red-500" />,
      'Medium': <AlertTriangle className="w-4 h-4 text-amber-500" />,
      'Low': <AlertCircle className="w-4 h-4 text-blue-500" />
  };
  
  const uniqueTypes = [...new Set(issues.map(i => i.type))];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950">
          <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-200">Detected Issues ({issues.length})</h3>
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">{filteredIssues.length} Visible</Badge>
          </div>
          
          <div className="flex gap-2">
              <div className="relative flex-1">
                  <Search className="absolute left-2 top-1.5 w-3 h-3 text-slate-500" />
                  <Input 
                    className="h-7 pl-7 text-xs bg-slate-900 border-slate-700" 
                    placeholder="Search issues..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                   <SelectTrigger className="h-7 w-[90px] text-xs bg-slate-900 border-slate-700">
                       <SelectValue placeholder="Sev" />
                   </SelectTrigger>
                   <SelectContent>
                       <SelectItem value="all">All Sev</SelectItem>
                       <SelectItem value="high">High</SelectItem>
                       <SelectItem value="medium">Medium</SelectItem>
                       <SelectItem value="low">Low</SelectItem>
                   </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                   <SelectTrigger className="h-7 w-[90px] text-xs bg-slate-900 border-slate-700">
                       <SelectValue placeholder="Type" />
                   </SelectTrigger>
                   <SelectContent>
                       <SelectItem value="all">All Types</SelectItem>
                       {uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                   </SelectContent>
              </Select>
          </div>
      </div>
      
      <ScrollArea className="flex-1 bg-slate-900/50">
          {filteredIssues.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                   <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                   <p className="text-xs">No matching issues found</p>
               </div>
          ) : (
              <div className="divide-y divide-slate-800">
                {filteredIssues.map((issue) => (
                    <div key={issue.id} className="p-3 hover:bg-slate-800/30 transition-colors group">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-3">
                                <div className="mt-1">{severityIcon[issue.severity]}</div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-slate-200">{issue.curveName}</span>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 border-slate-700 text-slate-400">{issue.type}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 transition-all"
                                onClick={() => resolveIssue(issue.id)}
                            >
                                Resolve
                            </Button>
                        </div>
                    </div>
                ))}
              </div>
          )}
      </ScrollArea>
    </div>
  );
};

export default IssueTrackerWidget;