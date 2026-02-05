import { useState, useEffect } from 'react';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { supabase } from '@/lib/customSupabaseClient';

// Simple in-memory cache to avoid fetching on every component mount
let settingsCache = null;
let featuresCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useSystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async (force = false) => {
    const now = Date.now();
    if (!force && settingsCache && featuresCache && (now - lastFetchTime < CACHE_TTL)) {
      setSettings(settingsCache);
      setFeatures(featuresCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [settingsData, featuresData] = await Promise.all([
        SystemSettingsService.getAllSettings(),
        SystemSettingsService.getAllFeatures()
      ]);

      // Transform array to key-value map for easier access
      const settingsMap = settingsData.reduce((acc, curr) => {
        // Convert types
        let val = curr.setting_value;
        if (curr.setting_type === 'number') val = Number(val);
        if (curr.setting_type === 'boolean') val = val === 'true';
        if (curr.setting_type === 'json') {
             try { val = JSON.parse(val); } catch(e) { val = null; }
        }
        
        acc[curr.setting_key] = val;
        return acc;
      }, {});

      const featuresMap = featuresData.reduce((acc, curr) => {
        acc[curr.feature_key] = curr.is_enabled;
        return acc;
      }, {});

      settingsCache = settingsMap;
      featuresCache = featuresMap;
      lastFetchTime = now;

      setSettings(settingsMap);
      setFeatures(featuresMap);
    } catch (err) {
      console.error("Failed to load system settings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Real-time subscription for updates
    const settingsSub = supabase
      .channel('system-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_settings' }, () => {
        fetchSettings(true);
      })
      .subscribe();
      
    const featuresSub = supabase
        .channel('feature-toggles-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_toggles' }, () => {
          fetchSettings(true);
        })
        .subscribe();

    return () => {
      supabase.removeChannel(settingsSub);
      supabase.removeChannel(featuresSub);
    };
  }, []);

  return { 
    settings, 
    features, 
    loading, 
    error, 
    getSetting: (key) => settings[key],
    isFeatureEnabled: (key) => !!features[key],
    refresh: () => fetchSettings(true)
  };
};

// Helper hook for specific feature check
export const useFeatureToggle = (featureKey) => {
  const { features, loading } = useSystemSettings();
  return { 
    enabled: !!features[featureKey], 
    loading 
  };
};