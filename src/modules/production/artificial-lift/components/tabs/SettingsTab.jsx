import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-slate-400">Configure application preferences and defaults.</p>
      </div>
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="bg-slate-700/50 p-4 rounded-full mb-4">
                <span className="text-4xl">🔧</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Application Configuration</h3>
            <p className="text-slate-400 max-w-md mx-auto">
                Set default units, economic parameters, and calculation preferences.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;