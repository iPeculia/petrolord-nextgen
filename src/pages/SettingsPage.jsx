import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Lock, 
  LogOut, 
  Save, 
  Loader2,
  Trash2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { user, profile, signOut } = useAuth();
  const { preferences, loading, saving, updatePreferences, updateProfile } = useUserSettings();
  const { toast } = useToast();
  
  // Local state for forms
  const [profileForm, setProfileForm] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });

  // Load profile data into form when available
  React.useEffect(() => {
    if (profile && user) {
        setProfileForm({
            display_name: profile.display_name || '',
            email: user.email || ''
        });
    }
  }, [profile, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
        toast({
            title: "Passwords do not match",
            variant: "destructive"
        });
        return;
    }
    if (passwordForm.password.length < 6) {
        toast({
            title: "Password too weak",
            description: "Password must be at least 6 characters.",
            variant: "destructive"
        });
        return;
    }
    await updateProfile({ password: passwordForm.password });
    setPasswordForm({ password: '', confirmPassword: '' });
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-[#BFFF00]" />
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <Helmet>
        <title>Settings - Petrolord NextGen Suite</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-400 mt-1">Manage your profile preferences and security settings.</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-[#1E293B] border border-slate-800 p-1 w-full md:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="account" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2">
            <User className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2">
            <Shield className="w-4 h-4" /> Privacy
          </TabsTrigger>
        </TabsList>

        {/* --- ACCOUNT TAB --- */}
        <TabsContent value="account" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Profile Information */}
              <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input 
                        id="display_name" 
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({...profileForm, display_name: e.target.value})}
                        className="bg-slate-950 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="bg-slate-950 border-slate-700"
                      />
                      <p className="text-xs text-slate-500">Changing email will require re-verification.</p>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={saving}
                        className="bg-[#BFFF00] text-black hover:bg-[#a3d900] w-full mt-4 font-semibold"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security / Password */}
              <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Security</CardTitle>
                  <CardDescription>Update your password or account access.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                        className="bg-slate-950 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="bg-slate-950 border-slate-700"
                      />
                    </div>
                    <Button 
                        type="submit" 
                        variant="outline"
                        disabled={saving || !passwordForm.password}
                        className="w-full mt-4 border-slate-700 hover:bg-slate-800 text-white"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-red-950/10 border-red-900/30 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-red-500 flex items-center gap-2">
                     <Trash2 className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-200/60">Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-medium">Deactivate Account</h4>
                        <p className="text-sm text-slate-400">Permanently disable access to your account and data.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Deactivate Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1E293B] border-slate-700 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently deactivate your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">Continue Deactivation</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* --- PREFERENCES TAB --- */}
        <TabsContent value="preferences" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Interface Settings</CardTitle>
                        <CardDescription>Customize the look and feel of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Theme */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-base">Theme Preference</Label>
                                <p className="text-sm text-slate-500">Choose your preferred visual theme.</p>
                            </div>
                            <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'light')}
                                    className={preferences?.theme === 'light' ? 'bg-slate-800 text-white' : 'text-slate-400'}
                                >
                                    <Sun className="w-4 h-4 mr-2" /> Light
                                </Button>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'dark')}
                                    className={preferences?.theme === 'dark' || !preferences?.theme ? 'bg-slate-800 text-white' : 'text-slate-400'}
                                >
                                    <Moon className="w-4 h-4 mr-2" /> Dark
                                </Button>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'system')}
                                    className={preferences?.theme === 'system' ? 'bg-slate-800 text-white' : 'text-slate-400'}
                                >
                                    <Monitor className="w-4 h-4 mr-2" /> System
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Language */}
                        <div className="grid gap-4 sm:grid-cols-2">
                             <div className="space-y-2">
                                <Label>Language</Label>
                                <Select 
                                    value={preferences?.language || 'en'} 
                                    onValueChange={(val) => handlePreferenceChange('language', val)}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-slate-700 text-white">
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select 
                                    value={preferences?.timezone || 'UTC'} 
                                    onValueChange={(val) => handlePreferenceChange('timezone', val)}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-slate-700 text-white h-60">
                                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                                        <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                                        <SelectItem value="Europe/London">London</SelectItem>
                                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

        {/* --- NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications" className="space-y-6">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Notification Preferences</CardTitle>
                        <CardDescription>Control how and when you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">Email Notifications</Label>
                                <p className="text-sm text-slate-400">Receive important updates via email.</p>
                            </div>
                            <Switch 
                                checked={preferences?.email_notifications ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('email_notifications', val)}
                            />
                        </div>
                        <Separator className="bg-slate-800" />
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">In-App Notifications</Label>
                                <p className="text-sm text-slate-400">Show alerts within the dashboard interface.</p>
                            </div>
                            <Switch 
                                checked={preferences?.in_app_notifications ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('in_app_notifications', val)}
                            />
                        </div>
                        <Separator className="bg-slate-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">System Alerts</Label>
                                <p className="text-sm text-slate-400">Critical system health and maintenance notices.</p>
                            </div>
                            <Switch 
                                checked={preferences?.system_alerts ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('system_alerts', val)}
                            />
                        </div>
                        <Separator className="bg-slate-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">Weekly Digest</Label>
                                <p className="text-sm text-slate-400">A summary of your activity sent every Monday.</p>
                            </div>
                            <Switch 
                                checked={preferences?.weekly_digest ?? false}
                                onCheckedChange={(val) => handlePreferenceChange('weekly_digest', val)}
                            />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

        {/* --- PRIVACY TAB --- */}
        <TabsContent value="privacy" className="space-y-6">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Privacy Controls</CardTitle>
                        <CardDescription>Manage your data visibility and sharing options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         
                         <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Profile Visibility</Label>
                                <Select 
                                    value={preferences?.profile_visibility || 'private'} 
                                    onValueChange={(val) => handlePreferenceChange('profile_visibility', val)}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-slate-700 text-white">
                                        <SelectItem value="public">Public (Visible to everyone)</SelectItem>
                                        <SelectItem value="organization">Organization Only</SelectItem>
                                        <SelectItem value="private">Private (Only me)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>

                        <Separator className="bg-slate-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">Activity Logging</Label>
                                <p className="text-sm text-slate-400">Allow us to log detailed usage analytics to improve features.</p>
                            </div>
                            <Switch 
                                checked={preferences?.activity_logging ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('activity_logging', val)}
                            />
                        </div>

                        <Separator className="bg-slate-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">Data Sharing</Label>
                                <p className="text-sm text-slate-400">Share anonymized data with partners for research.</p>
                            </div>
                            <Switch 
                                checked={preferences?.data_sharing ?? false}
                                onCheckedChange={(val) => handlePreferenceChange('data_sharing', val)}
                            />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsPage;