import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, FileText, ArrowRight, RotateCcw, List } from 'lucide-react';

const ImportSummary = ({ results, onReset }) => {
  const { totalProcessed, successCount, errorCount, errors } = results;
  const hasErrors = errorCount > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Import Process Completed</h2>
        <p className="text-slate-400">The bulk import job has finished processing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1E293B] border-slate-800">
            <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-slate-400">Total Processed</p>
                <p className="text-3xl font-bold text-white mt-2">{totalProcessed}</p>
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-emerald-900/50 bg-emerald-900/5">
            <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-emerald-400">Successful</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{successCount}</p>
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-red-900/50 bg-red-900/5">
            <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-red-400">Failed</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{errorCount}</p>
            </CardContent>
        </Card>
      </div>

      {hasErrors && (
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" /> Failed Entries
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {errors.map((err, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded bg-red-500/5 border border-red-500/10 text-sm">
                            <span className="font-mono text-red-300 min-w-[30px]">{idx + 1}.</span>
                            <div className="flex-1">
                                <p className="text-red-200">{err.email}</p>
                                <p className="text-red-400 text-xs mt-0.5">{err.error}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
            variant="outline" 
            className="border-slate-700 text-white hover:bg-slate-800"
            onClick={onReset}
        >
            <RotateCcw className="w-4 h-4 mr-2" /> Upload Another File
        </Button>
        <Button 
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
            onClick={() => window.location.href = '/dashboard/admin/import-history'}
        >
             <List className="w-4 h-4 mr-2" /> View Import History
        </Button>
        <Button 
            className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold"
            onClick={() => window.location.href = '/dashboard/admin/users'}
        >
            View User Directory <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

    </div>
  );
};

export default ImportSummary;