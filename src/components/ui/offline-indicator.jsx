import React from 'react';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const OfflineIndicator = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-1 text-xs font-medium flex items-center justify-center gap-2 text-center animate-in slide-in-from-top-1">
      <WifiOff className="w-3 h-3" />
      <span>You are currently offline. Changes will be synced when connection is restored.</span>
    </div>
  );
};