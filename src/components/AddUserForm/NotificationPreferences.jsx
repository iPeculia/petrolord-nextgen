import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, ChevronDown, ChevronUp, Bell, Key, UserCheck } from 'lucide-react';

const NotificationPreferences = ({ preferences, onUpdate }) => {
  const [openPreview, setOpenPreview] = useState(null);

  const togglePreview = (key) => {
    setOpenPreview(openPreview === key ? null : key);
  };

  const handleCheck = (key, checked) => {
    onUpdate({ ...preferences, [key]: checked });
  };

  return (
    <Card className="bg-[#1E293B] border-slate-800 mb-6">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-[#BFFF00]" /> Notification & Email Settings
        </h3>
        
        <div className="space-y-3">
          {/* Admin Notification */}
          <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-900/50">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="notifyAdmin" 
                checked={preferences.notifyAdmin} 
                onCheckedChange={(c) => handleCheck('notifyAdmin', c)}
                className="mt-1 border-slate-600 data-[state=checked]:bg-[#BFFF00] data-[state=checked]:text-black"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <Label htmlFor="notifyAdmin" className="text-slate-200 cursor-pointer font-medium">
                     Email me a summary report when complete
                   </Label>
                   <Button variant="ghost" size="sm" onClick={() => togglePreview('admin')} className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0">
                      {openPreview === 'admin' ? 'Hide Preview' : 'Preview Email'}
                   </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sends a breakdown of successful and failed records to your admin email.</p>
                
                <Collapsible open={openPreview === 'admin'}>
                  <CollapsibleContent className="mt-3 text-xs bg-white text-black p-3 rounded font-mono border border-slate-300 shadow-inner">
                    <p><strong>Subject:</strong> Bulk Import Completed: [University Name]</p>
                    <br/>
                    <p>Hello [Admin Name],</p>
                    <p>Your bulk import job has finished processing.</p>
                    <ul className="list-disc pl-4 my-2">
                        <li>Total Processed: 150</li>
                        <li>Successful: 148</li>
                        <li>Failed: 2</li>
                    </ul>
                    <p>[View Full Report Button]</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* User Welcome */}
          <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-900/50">
             <div className="flex items-start gap-3">
              <Checkbox 
                id="sendWelcome" 
                checked={preferences.sendWelcome} 
                onCheckedChange={(c) => handleCheck('sendWelcome', c)}
                className="mt-1 border-slate-600 data-[state=checked]:bg-[#BFFF00] data-[state=checked]:text-black"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <Label htmlFor="sendWelcome" className="text-slate-200 cursor-pointer font-medium">
                     Send welcome emails to new users
                   </Label>
                   <Button variant="ghost" size="sm" onClick={() => togglePreview('welcome')} className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0">
                      {openPreview === 'welcome' ? 'Hide Preview' : 'Preview Email'}
                   </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Users will receive a branded welcome email with a link to access the platform.</p>

                <Collapsible open={openPreview === 'welcome'}>
                  <CollapsibleContent className="mt-3 text-xs bg-white text-black p-3 rounded font-mono border border-slate-300 shadow-inner">
                    <p><strong>Subject:</strong> Welcome to Petrolord Suite</p>
                    <br/>
                    <p>Hi [First Name],</p>
                    <p>Welcome to Petrolord! Your account for [University Name] has been created.</p>
                    <p>You can now access the platform resources and modules.</p>
                    <p>[Login to Petrolord Button]</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Credentials / Password Reset */}
          <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-900/50">
             <div className="flex items-start gap-3">
              <Checkbox 
                id="sendCredentials" 
                checked={preferences.sendCredentials} 
                onCheckedChange={(c) => handleCheck('sendCredentials', c)}
                className="mt-1 border-slate-600 data-[state=checked]:bg-[#BFFF00] data-[state=checked]:text-black"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <Label htmlFor="sendCredentials" className="text-slate-200 cursor-pointer font-medium">
                     Include password setup instructions
                   </Label>
                   <Button variant="ghost" size="sm" onClick={() => togglePreview('creds')} className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0">
                      {openPreview === 'creds' ? 'Hide Preview' : 'Preview Email'}
                   </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    Adds a magic link to the welcome email allowing users to set their password immediately. 
                    <span className="text-amber-500 ml-1">Recommended</span>
                </p>

                <Collapsible open={openPreview === 'creds'}>
                  <CollapsibleContent className="mt-3 text-xs bg-white text-black p-3 rounded font-mono border border-slate-300 shadow-inner">
                    <p><strong>Additional Section:</strong></p>
                    <br/>
                    <p>To get started, please set your secure password:</p>
                    <p>[Set Password Button]</p>
                    <p>This link expires in 24 hours.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;