import React, { createContext, useContext, useState, useCallback } from 'react';

const LogViewerContext = createContext();

export const LogViewerProvider = ({ children }) => {
  const [zoom, setZoom] = useState(1); // Pixels per depth unit (meter/ft)
  const [scrollPosition, setScrollPosition] = useState(0); // Current top depth
  const [visibleCurves, setVisibleCurves] = useState({}); // { curveId: boolean }
  const [curveColors, setCurveColors] = useState({}); // { curveId: hexColor }
  const [trackConfig, setTrackConfig] = useState([]); // Array of track definitions
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 50)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.1)), []);
  const handleResetView = useCallback(() => {
    setZoom(1);
    setScrollPosition(0);
  }, []);

  const toggleCurveVisibility = useCallback((curveId) => {
    setVisibleCurves(prev => ({
      ...prev,
      [curveId]: prev[curveId] === undefined ? false : !prev[curveId]
    }));
  }, []);

  const setCurveColor = useCallback((curveId, color) => {
    setCurveColors(prev => ({
      ...prev,
      [curveId]: color
    }));
  }, []);

  return (
    <LogViewerContext.Provider value={{
      zoom,
      setZoom,
      scrollPosition,
      setScrollPosition,
      visibleCurves,
      setVisibleCurves,
      curveColors,
      setCurveColors,
      trackConfig,
      setTrackConfig,
      selectedMarker,
      setSelectedMarker,
      handleZoomIn,
      handleZoomOut,
      handleResetView,
      toggleCurveVisibility,
      setCurveColor
    }}>
      {children}
    </LogViewerContext.Provider>
  );
};

export const useLogViewer = () => {
  const context = useContext(LogViewerContext);
  if (!context) {
    throw new Error('useLogViewer must be used within a LogViewerProvider');
  }
  return context;
};