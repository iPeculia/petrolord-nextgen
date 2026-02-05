import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

const AdminNotificationSettingsPage = () => {
    return (
        <>
            <Helmet><title>Notification Settings - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><Settings className="mr-3" /> Notification Settings</h1>
                </div>
                
                <div className="bg-[#1E293B] rounded-lg border border-gray-800 p-6">
                    <NotificationPreferences />
                </div>
            </motion.div>
        </>
    );
};

export default AdminNotificationSettingsPage;