import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

const UniversityDepartmentsTab = () => {
  return (
    <Card className="bg-[#1E293B] border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Info className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Module-Based Architecture</h2>
            <p className="text-slate-400 max-w-md">
                This platform now uses a direct Module-to-Student assignment model. 
                Department management has been deprecated in favor of streamlined module assignments.
            </p>
        </CardContent>
    </Card>
  );
};

export default UniversityDepartmentsTab;