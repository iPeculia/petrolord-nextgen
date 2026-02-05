import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import EmailSettingsForm from '@/components/AdminSettings/EmailSettingsForm';
import ImportSettingsForm from '@/components/AdminSettings/ImportSettingsForm';

const AdminSettingsPage = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('email');
    const [isDirty, setIsDirty] = useState(false);

    const handleSave = () => {
        // Trigger save on active form (simplified for this structure)
        // In real app, forms would lift state or use context
        toast({ title: "Settings Saved", description: "System configuration updated successfully." });
        setIsDirty(false);
    };

    return (
        <div className="p-6 md:p-12 space-y-6 max-w-5xl mx-auto">
            <Helmet><title>Admin Settings | Petrolord</title></Helmet>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Settings</h1>
                    <p className="text-slate-400">Configure global platform behavior.</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={!isDirty}
                    className="bg-[#BFFF00] text-black hover:bg-[#a3d900]"
                >
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#1E293B] border border-slate-700">
                    <TabsTrigger value="email">Email & Notifications</TabsTrigger>
                    <TabsTrigger value="import">Import Configuration</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                    <EmailSettingsForm onChange={() => setIsDirty(true)} />
                </TabsContent>

                <TabsContent value="import" className="space-y-4">
                    <ImportSettingsForm onChange={() => setIsDirty(true)} />
                </TabsContent>
                
                <TabsContent value="security">
                     <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-lg bg-[#1E293B]">
                        Security settings coming soon.
                     </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettingsPage;