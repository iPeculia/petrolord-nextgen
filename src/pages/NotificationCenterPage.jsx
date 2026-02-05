import React from 'react';
import { Helmet } from 'react-helmet-async';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const NotificationCenterPage = () => {
    return (
        <>
            <Helmet>
                <title>Notifications | Petrolord</title>
            </Helmet>
            <div className="p-6 md:p-10">
                <NotificationCenter />
            </div>
        </>
    );
};

export default NotificationCenterPage;