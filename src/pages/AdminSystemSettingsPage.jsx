import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Settings, Shield, Mail, ToggleLeft, Database, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const SettingInput = ({ setting, value, onChange }) => {
    if (setting.setting_type === 'boolean') {
        return (
            <div className="flex items-center justify-between py-2">
                <Label htmlFor={setting.setting_key} className="flex flex-col gap-1">
                    <span className="font-medium text-slate-200">{setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="font-normal text-xs text-slate-400">{setting.description}</span>
                </Label>
                <Switch 
                    id={setting.setting_key}
                    checked={value === 'true' || value === true}
                    onCheckedChange={(checked) => onChange(String(checked))}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2 py-2">
            <Label htmlFor={setting.setting_key} className="text-slate-200">
                {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Label>
            {setting.setting_type === 'number' ? (
                <Input 
                    type="number" 
                    id={setting.setting_key} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-slate-900 border-slate-700"
                />
            ) : (
                <Input 
                    type="text" 
                    id={setting.setting_key} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-slate-900 border-slate-700"
                />
            )}
            <p className="text-xs text-slate-500">{setting.description}</p>
        </div>
    );
};

const FeatureToggleRow = ({ feature, onToggle }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-[#0F172A]">
        <div className="space-y-1">
            <h4 className="font-medium text-slate-200">{feature.feature_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
            <p className="text-sm text-slate-500">{feature.description}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${feature.is_enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {feature.is_enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch 
                checked={feature.is_enabled}
                onCheckedChange={(checked) => onToggle(feature.feature_key, checked)}
            />
        </div>
    </div>
);

const AdminSystemSettingsPage = () => {
    const { user } = useAuth();
    const { refresh } = useSystemSettings();
    const { toast } = useToast();
    
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [rawSettings, setRawSettings] = useState([]);
    const [rawFeatures, setRawFeatures] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState({});
    
    // Maintenance states
    const [backupLoading, setBackupLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [settings, features] = await Promise.all([
                SystemSettingsService.getAllSettings(),
                SystemSettingsService.getAllFeatures()
            ]);
            setRawSettings(settings || []);
            setRawFeatures(features || []);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, newValue) => {
        setUnsavedChanges(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    const saveSettings = async (groupName) => {
        const settingsToSave = rawSettings.filter(s => s.group_name === groupName && unsavedChanges[s.setting_key] !== undefined);
        
        if (settingsToSave.length === 0) {
            toast({ title: "No changes", description: "No settings were modified." });
            return;
        }

        try {
            const promises = settingsToSave.map(s => 
                SystemSettingsService.updateSetting(s.setting_key, unsavedChanges[s.setting_key], s.setting_type, user.id)
            );
            
            await Promise.all(promises);
            
            toast({ title: "Settings Saved", description: `${settingsToSave.length} settings updated successfully.` });
            setUnsavedChanges(prev => {
                const newChanges = { ...prev };
                settingsToSave.forEach(s => delete newChanges[s.setting_key]);
                return newChanges;
            });
            loadData(); // Reload to confirm
            refresh(); // Update global context
        } catch (error) {
            toast({ title: "Save Failed", description: error.message, variant: "destructive" });
        }
    };

    const handleFeatureToggle = async (key, enabled) => {
        try {
            await SystemSettingsService.toggleFeature(key, enabled, user.id);
            toast({ title: "Feature Updated", description: `${key} is now ${enabled ? 'enabled' : 'disabled'}.` });
            loadData();
            refresh();
        } catch (error) {
            toast({ title: "Update Failed", variant: "destructive" });
        }
    };

    const handleMaintenanceAction = async (action) => {
        if (action === 'backup') {
            setBackupLoading(true);
            try {
                await SystemSettingsService.triggerBackup();
                toast({ title: "Backup Complete", description: "Database backup created successfully." });
            } finally {
                setBackupLoading(false);
            }
        } else if (action === 'cache') {
            await SystemSettingsService.clearCache();
            toast({ title: "Cache Cleared", description: "System cache has been flushed." });
        }
    };

    // Filter settings by group
    const generalSettings = rawSettings.filter(s => s.group_name === 'general');
    const emailSettings = rawSettings.filter(s => s.group_name === 'email');
    const securitySettings = rawSettings.filter(s => s.group_name === 'security');
    const licenseSettings = rawSettings.filter(s => s.group_name === 'license');

    // Helper to get current value (unsaved or saved)
    const getValue = (key, savedValue) => {
        return unsavedChanges[key] !== undefined ? unsavedChanges[key] : savedValue;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Helmet><title>System Settings - Petrolord Admin</title></Helmet>

            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Settings className="w-8 h-8 text-[#BFFF00]" /> System Configuration
                </h1>
                <p className="text-slate-400">Manage global settings, feature flags, and system maintenance.</p>
            </div>

            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-[#1E293B] border-slate-800 p-1 flex-wrap h-auto">
                    <TabsTrigger value="general" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">General</TabsTrigger>
                    <TabsTrigger value="license" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">License</TabsTrigger>
                    <TabsTrigger value="email" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black flex gap-2"><Mail className="w-4 h-4"/> Email</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black flex gap-2"><Shield className="w-4 h-4"/> Security</TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black flex gap-2"><ToggleLeft className="w-4 h-4"/> Features</TabsTrigger>
                    <TabsTrigger value="maintenance" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black flex gap-2"><Database className="w-4 h-4"/> Maintenance</TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general">
                    <Card className="bg-[#1E293B] border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">General Configuration</CardTitle>
                            <CardDescription>Basic system identity and localization settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {generalSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-slate-800 pt-6">
                            <Button onClick={() => saveSettings('general')} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* LICENSE SETTINGS */}
                <TabsContent value="license">
                    <Card className="bg-[#1E293B] border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Licensing & Grace Periods</CardTitle>
                            <CardDescription>Configure default durations for student access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {licenseSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-slate-800 pt-6">
                            <Button onClick={() => saveSettings('license')} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* EMAIL SETTINGS */}
                <TabsContent value="email">
                    <Card className="bg-[#1E293B] border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Email Service</CardTitle>
                            <CardDescription>SMTP configuration for system notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400 mb-4">
                                <AlertTriangle className="w-4 h-4" />
                                <AlertTitle>Sensitive Information</AlertTitle>
                                <AlertDescription>SMTP credentials are stored securely but displayed here for verification.</AlertDescription>
                            </Alert>
                            {emailSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-slate-800 pt-6 flex justify-between">
                            <Button variant="outline" className="border-slate-700 text-slate-300">
                                Send Test Email
                            </Button>
                            <Button onClick={() => saveSettings('email')} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                <Save className="w-4 h-4 mr-2" /> Save Configuration
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* SECURITY SETTINGS */}
                <TabsContent value="security">
                    <Card className="bg-[#1E293B] border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Security Policies</CardTitle>
                            <CardDescription>Password rules, timeouts, and access controls.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {securitySettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-slate-800 pt-6">
                            <Button onClick={() => saveSettings('security')} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                <Save className="w-4 h-4 mr-2" /> Save Policies
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* FEATURE TOGGLES */}
                <TabsContent value="features">
                    <Card className="bg-[#1E293B] border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Feature Flags</CardTitle>
                            <CardDescription>Enable or disable system features in real-time without deployment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rawFeatures.map(feature => (
                                <FeatureToggleRow 
                                    key={feature.id}
                                    feature={feature}
                                    onToggle={handleFeatureToggle}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM MAINTENANCE */}
                <TabsContent value="maintenance">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-[#1E293B] border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Database Operations</CardTitle>
                                <CardDescription>Manage data integrity and backups.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded bg-slate-900 border border-slate-800">
                                    <div>
                                        <h5 className="text-sm font-medium text-slate-200">System Backup</h5>
                                        <p className="text-xs text-slate-500">Create a full snapshot of the database.</p>
                                    </div>
                                    <Button 
                                        onClick={() => handleMaintenanceAction('backup')} 
                                        disabled={backupLoading}
                                        variant="outline"
                                        className="border-slate-700 hover:bg-slate-800"
                                    >
                                        {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                                        Backup Now
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded bg-slate-900 border border-slate-800">
                                    <div>
                                        <h5 className="text-sm font-medium text-slate-200">Optimize Tables</h5>
                                        <p className="text-xs text-slate-500">Run vacuum and re-index operations.</p>
                                    </div>
                                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800">Optimize</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#1E293B] border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">System Health</CardTitle>
                                <CardDescription>Diagnostic checks and cache management.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Database Connection</span>
                                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Healthy</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Storage Service</span>
                                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Operational</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Email Gateway</span>
                                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Connected</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800">
                                    <Button 
                                        onClick={() => handleMaintenanceAction('cache')} 
                                        variant="destructive" 
                                        className="w-full bg-red-900/50 hover:bg-red-900/70 border border-red-900"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" /> Clear System Cache
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSystemSettingsPage;