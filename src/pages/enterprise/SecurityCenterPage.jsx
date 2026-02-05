import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Key, Lock, Globe, AlertTriangle } from 'lucide-react';

const SecurityCenterPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Command Center</h1>
          <p className="text-gray-400 mt-2">Manage SSO, API Access, and Security Policies.</p>
        </div>
        <Button variant="destructive">
          <Shield className="mr-2 h-4 w-4" /> Emergency Lockdown
        </Button>
      </div>

      <Tabs defaultValue="sso" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="sso">SSO / SAML</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="mt-6 space-y-6">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 text-[#BFFF00]" /> SAML 2.0 Configuration
              </CardTitle>
              <CardDescription>Configure your Identity Provider (IdP) settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">IdP Entity ID</label>
                  <Input className="bg-slate-900 border-slate-700" placeholder="https://idp.example.com/entity" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SSO Service URL</label>
                  <Input className="bg-slate-900 border-slate-700" placeholder="https://idp.example.com/sso" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">X.509 Certificate</label>
                <textarea className="w-full h-32 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm font-mono" placeholder="-----BEGIN CERTIFICATE-----..." />
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#BFFF00] text-black hover:bg-[#A8E600]">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="bg-slate-800 border-slate-700 text-white">
             <CardHeader>
                <CardTitle>API Access Tokens</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-center py-10 text-gray-400">
                   <Lock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                   <p>No active API keys found. Generate one to access the platform programmatically.</p>
                   <Button className="mt-4 bg-[#BFFF00] text-black">Generate New Key</Button>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would go here */}
      </Tabs>
    </div>
  );
};

export default SecurityCenterPage;