import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Database } from 'lucide-react';

const KnowledgeManagementPage = () => {
  return (
    <div className="p-8 space-y-6 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#BFFF00]" />
            Knowledge Management
          </h1>
          <p className="text-slate-400 mt-2">Centralized AI-indexed repository of corporate technical knowledge.</p>
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto my-12">
         <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
         <Input className="pl-12 h-12 bg-slate-900 border-slate-700 text-lg" placeholder="Search across reports, logs, and emails..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Database className="w-5 h-5" /> Technical Reports</CardTitle></CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-white">14,205</div>
               <div className="text-sm text-slate-500">Indexed Documents</div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Database className="w-5 h-5" /> Well Files</CardTitle></CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-white">892</div>
               <div className="text-sm text-slate-500">Indexed Wells</div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Database className="w-5 h-5" /> Lessons Learned</CardTitle></CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-white">3,401</div>
               <div className="text-sm text-slate-500">Extracted Insights</div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default KnowledgeManagementPage;