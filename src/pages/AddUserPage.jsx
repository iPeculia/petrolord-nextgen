import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserPlus, Shield } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import SingleUserForm from '@/components/AddUserForm/SingleUserForm';
import CSVUploadForm from '@/components/AddUserForm/CSVUploadForm';
import CSVPreview from '@/components/AddUserForm/CSVPreview';
import ImportSummary from '@/components/AddUserForm/ImportSummary';
import UniversitySelect from '@/components/AddUserForm/UniversitySelect';
import NotificationPreferences from '@/components/AddUserForm/NotificationPreferences';
import { UserManagementService } from '@/services/userManagementService';
import { ImportHistoryService } from '@/services/importHistoryService';
import { useToast } from '@/components/ui/use-toast';

const AddUserPage = () => {
    const { isViewAsAdmin, isViewAsSuperAdmin } = useRole();
    const { toast } = useToast();
    
    // Bulk Import State
    const [bulkState, setBulkState] = useState('upload'); // upload, preview, summary
    const [bulkFile, setBulkFile] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [importResults, setImportResults] = useState(null);
    const [universityId, setUniversityId] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    
    // Notification Preferences
    const [notifyPrefs, setNotifyPrefs] = useState({
        notifyAdmin: true,
        sendWelcome: false,
        sendCredentials: false
    });

    // Security Check
    if (!isViewAsAdmin && !isViewAsSuperAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleValidationComplete = (result, fileName) => {
        setValidationResult(result);
        setBulkFile(fileName);
        setBulkState('preview');
    };

    const handleBulkImport = async () => {
        if (!universityId) {
            toast({ title: "University Required", description: "Please select a university before importing.", variant: "destructive" });
            return;
        }
        
        setIsImporting(true);
        try {
            // 1. Perform Import
            const result = await UserManagementService.processBulkImport({
                universityId,
                users: validationResult.valid
            });
            setImportResults(result);

            // 2. Trigger Notifications (Fire and forget from UI perspective to not block summary)
            const importId = result.importId || result.id; 
            
            if (importId) {
                // Send Admin Notification
                if (notifyPrefs.notifyAdmin) {
                    ImportHistoryService.sendImportNotification(importId).then(() => {
                        console.log("Admin notification sent");
                    });
                }

                // Send User Welcome/Credentials
                if (notifyPrefs.sendWelcome || notifyPrefs.sendCredentials) {
                    ImportHistoryService.sendUserCredentials(importId, notifyPrefs.sendCredentials).then(res => {
                         if (res && !res.error) {
                             toast({ 
                                title: "Emails Queued", 
                                description: `Welcome emails are being sent to new users.`,
                                className: "bg-blue-600 text-white border-none"
                             });
                         }
                    });
                }
            }

            setBulkState('summary');
        } catch (error) {
            toast({ 
                title: "Import Failed", 
                description: error.message || "An error occurred during bulk import.", 
                variant: "destructive" 
            });
        } finally {
            setIsImporting(false);
        }
    };

    const resetBulk = () => {
        setBulkState('upload');
        setValidationResult(null);
        setBulkFile(null);
        setImportResults(null);
    };

    return (
        <>
            <Helmet>
                <title>Add Users | Petrolord Admin</title>
            </Helmet>
            
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div className="flex flex-col space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <UserPlus className="w-8 h-8 text-[#BFFF00]" /> 
                        User Provisioning
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Create new student or lecturer accounts manually or via bulk import.
                    </p>
                </div>

                <div className="bg-[#1E293B]/50 p-4 rounded-lg border border-slate-800 flex items-start gap-3 mb-6">
                    <Shield className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-400">Admin Access Only</h4>
                        <p className="text-sm text-slate-400 mt-1">
                            You are adding users as a <strong>{isViewAsSuperAdmin ? 'Super Admin' : 'Petrolord Admin'}</strong>. 
                            These actions are logged for audit purposes.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="single" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-[#1E293B] border border-slate-800 p-1 rounded-xl">
                            <TabsTrigger 
                                value="single" 
                                className="px-8 py-2.5 text-sm font-medium data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black rounded-lg transition-all"
                            >
                                Single User Entry
                            </TabsTrigger>
                            <TabsTrigger 
                                value="bulk" 
                                className="px-8 py-2.5 text-sm font-medium data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black rounded-lg transition-all"
                            >
                                Bulk Import (CSV)
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="single" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SingleUserForm />
                    </TabsContent>

                    <TabsContent value="bulk" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         {/* Common University Select for Bulk Import */}
                        <div className="mb-6 max-w-2xl mx-auto">
                            <UniversitySelect 
                                value={universityId} 
                                onChange={setUniversityId} 
                                error={!universityId && bulkState !== 'upload' ? 'University is required for import' : null}
                            />
                        </div>

                        {bulkState === 'upload' && (
                            <CSVUploadForm onValidationComplete={handleValidationComplete} />
                        )}

                        {bulkState === 'preview' && (
                            <>
                                <NotificationPreferences 
                                    preferences={notifyPrefs}
                                    onUpdate={setNotifyPrefs}
                                />
                                <CSVPreview 
                                    validationResult={validationResult} 
                                    fileName={bulkFile} 
                                    onCancel={resetBulk}
                                    onImport={handleBulkImport}
                                    importing={isImporting}
                                />
                            </>
                        )}

                        {bulkState === 'summary' && (
                            <ImportSummary 
                                results={importResults} 
                                onReset={resetBulk} 
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </>
    );
};

export default AddUserPage;