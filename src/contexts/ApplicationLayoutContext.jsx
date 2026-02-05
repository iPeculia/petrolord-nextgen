import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ApplicationLayoutContext = createContext();

export const useApplicationLayout = () => useContext(ApplicationLayoutContext);

export const ApplicationLayoutProvider = ({ children }) => {
  const location = useLocation();
  const [isFullscreenApp, setIsFullscreenApp] = useState(false);
  const [showMainSidebar, setShowMainSidebar] = useState(true);
  const [showMainHeader, setShowMainHeader] = useState(true);

  // Define routes that should be fullscreen (hide main nav)
  const fullscreenRoutes = [
    '/dashboard/production/nodal-analysis',
    '/dashboard/modules/production/pressure-transient-analysis',
    '/dashboard/modules/drilling/well-planning',
    '/dashboard/modules/economics/risk-analysis' 
  ];

  useEffect(() => {
    // Check if current path starts with any of the fullscreen routes
    const isFullscreen = fullscreenRoutes.some(route => location.pathname.startsWith(route));
    
    setIsFullscreenApp(isFullscreen);
    setShowMainSidebar(!isFullscreen);
    setShowMainHeader(!isFullscreen);
    
  }, [location.pathname]);

  return (
    <ApplicationLayoutContext.Provider value={{ 
      isFullscreenApp, 
      showMainSidebar, 
      showMainHeader,
      setShowMainSidebar,
      setShowMainHeader,
      setIsFullscreenApp
    }}>
      {children}
    </ApplicationLayoutContext.Provider>
  );
};