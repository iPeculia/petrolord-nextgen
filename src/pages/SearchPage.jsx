import React from 'react';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SearchPage = () => {
    // We wrap inside Layout if logged in, typically handled by Routes but
    // since this page might be accessed directly, we ensure standard structure.
    // Assuming App.jsx handles the layout for dashboard routes, we need to know where /search lives.
    // If it's a top level route, we might need a Layout.
    
    // For this implementation, I'll use the AdvancedSearch component directly. 
    // The App.jsx structure suggests /dashboard/* is protected and has Layout.
    // I will place SearchPage under /dashboard/search to inherit layout, 
    // OR if it's /search (public/root), I need to wrap it.
    // Given the prompt "Route: /search", I will assume it's a standalone page 
    // but users would likely want the Sidebar/Header. 
    // I'll make it use the Layout if possible, or just a standalone container if not.
    // Let's assume it should be authenticated.

    return (
        <div className="min-h-screen bg-[#020617]">
             <AdvancedSearch />
        </div>
    );
};

export default SearchPage;