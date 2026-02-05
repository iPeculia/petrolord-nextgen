import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fmp_app_settings';

const DEFAULT_SETTINGS = {
  general: {
    theme: 'dark',
    density: 'comfortable',
    autoSave: true,
    autoSaveInterval: 5, // minutes
  },
  facility: {
    defaultCurrency: 'USD',
    defaultUnits: 'Imperial', // Imperial vs Metric
    safetyMargin: 10, // %
  },
  analysis: {
    defaultDiscountRate: 10,
    inflationRate: 2,
    taxRate: 30,
    analysisHorizon: 20, // years
  },
  export: {
    includeCharts: true,
    includeTables: true,
    paperSize: 'A4',
    orientation: 'landscape',
  },
  notifications: {
    emailAlerts: true,
    inAppAlerts: true,
    soundEnabled: false,
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to local storage whenever settings change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, loading]);

  const updateSetting = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fmp_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [settings]);

  const importSettings = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setSettings(imported); // Basic validation could be added here
      } catch (e) {
        console.error("Invalid settings file", e);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings
  };
};

export default useSettings;