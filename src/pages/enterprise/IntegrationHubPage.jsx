import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plug, Check, AlertCircle } from 'lucide-react';

const IntegrationHubPage = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', category: 'Communication', connected: true, description: 'Send alerts and reports to Slack channels.' },
    { id: 'teams', name: 'Microsoft Teams', category: 'Communication', connected: false, description: 'Collaborate on projects via Teams.' },
    { id: 'sap', name: 'SAP ERP', category: 'ERP', connected: false, description: 'Sync financial data with SAP.' },
    { id: 'powerbi', name: 'Power BI', category: 'Analytics', connected: true, description: 'Export dashboards to Power BI.' },
    { id: 'petrel', name: 'Petrel', category: 'Geoscience', connected: false, description: 'Direct connector for Schlumberger Petrel projects.' },
    { id: 'spotfire', name: 'TIBCO Spotfire', category: 'Analytics', connected: false, description: 'Advanced visualization integration.' },
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(prev => prev.map(item => 
        item.id === id ? { ...item, connected: !item.connected } : item
    ));
  };

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold text-white">Integration Hub</h1>
          <p className="text-gray-400 mt-1">Connect Petrolord with your existing enterprise ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {integrations.map(integration => (
              <Card key={integration.id} className={`bg-slate-800 border-slate-700 text-white transition-all ${integration.connected ? 'border-green-500/50 bg-slate-800/80' : ''}`}>
                  <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-lg ${integration.connected ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-gray-400'}`}>
                              <Plug className="w-6 h-6" />
                          </div>
                          <Switch 
                              checked={integration.connected} 
                              onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                      </div>
                      <CardTitle className="mt-4 text-xl">{integration.name}</CardTitle>
                      <Badge variant="secondary" className="bg-slate-700 text-blue-300">{integration.category}</Badge>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-gray-400 min-h-[40px]">{integration.description}</p>
                      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-2 text-sm">
                          {integration.connected ? (
                              <span className="text-green-400 flex items-center gap-1"><Check className="w-4 h-4" /> Active Connection</span>
                          ) : (
                              <span className="text-gray-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Not Connected</span>
                          )}
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
      
      <Card className="bg-slate-900 border-slate-800 p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Need a Custom Integration?</h3>
          <p className="text-gray-400 mb-6">Our API allows you to build custom connectors for proprietary systems.</p>
          <Button variant="outline" className="border-[#BFFF00] text-[#BFFF00] hover:bg-[#BFFF00] hover:text-black">
              Read API Documentation
          </Button>
      </Card>
    </div>
  );
};

export default IntegrationHubPage;