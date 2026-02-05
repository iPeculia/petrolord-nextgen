import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ImportRecordsTable = ({ records = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 border border-slate-800 rounded-md bg-[#1E293B]">
        Loading records...
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 border border-slate-800 rounded-md bg-[#1E293B]">
        No records found.
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-md overflow-hidden flex flex-col bg-[#1E293B]">
       {/* Sticky Header */}
       <div className="flex items-center bg-[#0F172A] border-b border-slate-700 text-slate-400 font-medium text-xs h-10 sticky top-0 z-10">
          <div className="w-[100px] px-4 shrink-0">Status</div>
          <div className="w-[200px] px-4 shrink-0">Email</div>
          <div className="w-[150px] px-4 shrink-0">Name</div>
          <div className="w-[150px] px-4 shrink-0">Role</div>
          <div className="flex-1 px-4">Message</div>
       </div>

       {/* Scrollable Body */}
       <ScrollArea className="h-[600px]">
          <div className="divide-y divide-slate-800/50">
            {records.map((record, index) => {
              const rowData = typeof record.row_data === 'string' ? JSON.parse(record.row_data) : record.row_data;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={record.id || index} 
                  className={`flex items-center text-sm ${isEven ? 'bg-[#1E293B]' : 'bg-[#131C31]'} hover:bg-slate-800/80 transition-colors h-12`}
                >
                   <div className="w-[100px] px-4 shrink-0">
                      <Badge variant={record.status === 'success' ? 'success' : 'destructive'} className="text-[10px]">
                          {record.status}
                      </Badge>
                   </div>
                   <div className="w-[200px] px-4 truncate shrink-0 text-slate-300" title={rowData.email}>
                      {rowData.email}
                   </div>
                   <div className="w-[150px] px-4 truncate shrink-0 text-slate-300" title={`${rowData.first_name} ${rowData.last_name}`}>
                      {rowData.first_name} {rowData.last_name}
                   </div>
                   <div className="w-[150px] px-4 truncate shrink-0 text-slate-400">
                      {rowData.user_type || rowData.role}
                   </div>
                   <div className="flex-1 px-4 truncate text-slate-500" title={record.error_message}>
                      {record.error_message || '-'}
                   </div>
                </div>
              );
            })}
          </div>
       </ScrollArea>
    </div>
  );
};

export default ImportRecordsTable;