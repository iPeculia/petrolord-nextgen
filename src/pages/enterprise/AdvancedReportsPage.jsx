import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar, Download } from 'lucide-react';

const AdvancedReportsPage = () => {
  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Reporting</h1>
        <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]"><Plus className="w-4 h-4 mr-2" /> Create Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[1, 2, 3, 4, 5, 6].map(i => (
             <Card key={i} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-colors cursor-pointer">
                 <CardHeader>
                     <CardTitle className="text-white text-lg flex items-center gap-2">
                         <FileText className="w-5 h-5 text-blue-400" />
                         Q{i} Production Summary
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p className="text-sm text-slate-400 mb-4">Comprehensive breakdown of quarterly asset performance and financial metrics.</p>
                     <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
                         <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Generated Oct {i+10}, 2024</span>
                         <Button variant="ghost" size="sm" className="h-6"><Download className="w-3 h-3 mr-1" /> PDF</Button>
                     </div>
                 </CardContent>
             </Card>
         ))}
      </div>
    </div>
  );
};

export default AdvancedReportsPage;