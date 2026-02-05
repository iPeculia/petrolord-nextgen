import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, BarChart3, Shield } from 'lucide-react';

const APIManagementPage = () => {
  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Management</h1>
          <p className="text-slate-400 mt-1">Manage API keys, monitor usage, and configure access controls.</p>
        </div>
        <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">Generate New Key</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-400"><Key className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-slate-400">Active Keys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10 text-green-400"><BarChart3 className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-white">1.2M</div>
                <div className="text-sm text-slate-400">Requests / Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-400"><Shield className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">Active API Keys</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="font-mono text-sm text-slate-200">pk_live_51Ha...x892</div>
                    <div className="text-xs text-slate-500">Created on Nov 12, 2024 • Production</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">Active</Badge>
                  <Button variant="ghost" size="icon" className="text-slate-400"><Copy className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIManagementPage;