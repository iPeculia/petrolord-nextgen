import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const { activeWell, wellLogs, markers } = useGlobalDataStore();
  
  // State
  const [selectedCurves, setSelectedCurves] = useState([]);
  const [depthRange, setDepthRange] = useState({ min: 0, max: 10000 });
  const [activeWidgets, setActiveWidgets] = useState({
    stats: true,
    histogram: true,
    correlation: true,
    crossplot: true,
    petrophysics: false,
    anomalies: false
  });
  const [settings, setSettings] = useState({
    histogramBuckets: 20,
    anomalyThreshold: 2.5,
    matrix: 2.65, // density matrix
    fluid: 1.0 // density fluid
  });

  // Helper to get current well's data
  const activeLogs = useMemo(() => {
    if (!activeWell || !wellLogs[activeWell]) return {};
    return wellLogs[activeWell];
  }, [activeWell, wellLogs]);

  // Initialize available curves when well changes
  useEffect(() => {
    if (activeLogs) {
      const curveNames = Object.keys(activeLogs);
      // Select first 2 curves by default if none selected
      if (selectedCurves.length === 0 && curveNames.length > 0) {
        setSelectedCurves(curveNames.slice(0, 2));
      }
      
      // Set depth range from first curve
      if (curveNames.length > 0) {
        const firstCurve = activeLogs[curveNames[0]];
        if (firstCurve?.depth_array?.length) {
          const depths = firstCurve.depth_array;
          setDepthRange({
            min: depths[0],
            max: depths[depths.length - 1]
          });
        }
      }
    }
  }, [activeLogs, activeWell]);

  const toggleWidget = (widgetId) => {
    setActiveWidgets(prev => ({ ...prev, [widgetId]: !prev[widgetId] }));
  };

  const value = {
    activeWell,
    activeLogs,
    markers: activeWell ? markers[activeWell] : [],
    selectedCurves,
    setSelectedCurves,
    depthRange,
    setDepthRange,
    activeWidgets,
    toggleWidget,
    settings,
    setSettings
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};