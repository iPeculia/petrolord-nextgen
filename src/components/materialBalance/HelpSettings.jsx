import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHelp } from '@/contexts/HelpContext';
import { Settings, Bell, Eye, Monitor } from 'lucide-react';

const HelpSettings = () => {
  const { preferences, setPreferences } = useHelp();

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Settings className="w-6 h-6 mr-3 text-slate-400" />
        Help & Training Settings
      </h2>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-400" /> Interface Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Contextual Tooltips</Label>
              <p className="text-sm text-slate-400">Show detailed help popups when hovering over UI elements.</p>
            </div>
            <Switch 
              checked={preferences.tooltips} 
              onCheckedChange={() => handleToggle('tooltips')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Show Welcome Tour</Label>
              <p className="text-sm text-slate-400">Automatically start the tour for new modules.</p>
            </div>
            <Switch 
               checked={preferences.welcomeTour !== false}
               onCheckedChange={() => handleToggle('welcomeTour')}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-[#BFFF00]" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Training Recommendations</Label>
              <p className="text-sm text-slate-400">Suggest relevant tutorials based on your activity.</p>
            </div>
            <Switch 
               checked={preferences.notifications}
               onCheckedChange={() => handleToggle('notifications')}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-purple-400" /> Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
             <Label className="text-white">Font Size</Label>
             <Select defaultValue="medium">
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSettings;