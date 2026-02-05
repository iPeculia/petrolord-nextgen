import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { settingsService } from '@/services/settingsService';
import { useToast } from '@/components/ui/use-toast';

export const useUserSettings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await settingsService.getUserPreferences(user.id);
      setPreferences(data);
    } catch (error) {
      toast({
        title: "Error loading settings",
        description: "Could not fetch user preferences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = async (updates) => {
    if (!user) return;
    try {
      setSaving(true);
      const updated = await settingsService.updateUserPreferences(user.id, updates);
      setPreferences(updated);
      toast({
        title: "Preferences saved",
        description: "Your settings have been updated successfully.",
        className: "bg-emerald-600 text-white border-none"
      });
      return updated;
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to save changes.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async (data) => {
    if (!user) return;
    try {
      setSaving(true);
      
      // Update Auth (Email/Password)
      if (data.email && data.email !== user.email) {
        await settingsService.updateAuthUser({ email: data.email });
        toast({
           title: "Email confirmation sent",
           description: "Please check your new email to confirm the change.",
        });
      }
      
      if (data.password) {
        await settingsService.updateAuthUser({ password: data.password });
        toast({
           title: "Password updated",
           description: "Your password has been changed successfully.",
        });
      }

      // Update Profile Table (Display Name, etc)
      if (data.display_name) {
          await settingsService.updateUserProfile(user.id, {
             display_name: data.display_name
          });
          await refreshProfile(); // Refresh context profile
      }
      
      return true;

    } catch (error) {
      toast({
        title: "Profile update failed",
        description: error.message || "Could not update profile.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    updateProfile,
    refreshSettings: fetchPreferences
  };
};