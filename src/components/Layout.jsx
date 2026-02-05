import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showMainSidebar, showMainHeader, isFullscreenApp } = useApplicationLayout();

  // If it's a fullscreen app, we render just the children without the standard wrapper elements
  if (isFullscreenApp) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      {/* Sidebar */}
      {showMainSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        {showMainHeader && (
           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Main Content */}
        <main className="w-full grow">
          <div className="mx-auto w-full max-w-9xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;