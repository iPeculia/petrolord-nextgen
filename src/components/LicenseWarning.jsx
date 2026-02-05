import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import useLicenseStatus from '@/hooks/useLicenseStatus';
import { Link } from 'react-router-dom';

/**
 * Component that displays a warning if the user's license is expiring soon,
 * expired, or in grace period. Typically placed in Dashboard layout.
 * 
 * Usage:
 * <LicenseWarning userId={user.id} />
 */
const LicenseWarning = ({ userId }) => {
  const { status, isValid, isLoading } = useLicenseStatus(userId);

  if (isLoading || !status) return null;

  // Don't show if active and not expiring soon (more than 14 days)
  if (status.status === 'active' && status.daysRemaining > 14) return null;

  if (!isValid && status.status !== 'grace_period') {
    return (
      <Alert variant="destructive" className="mb-4 shadow-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>License Expired</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span>
            Your academic license has expired. You may have restricted access to course materials.
          </span>
          <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
            <Link to="/support">Contact Support</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (status.status === 'grace_period') {
    return (
      <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100">
        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Grace Period Active</AlertTitle>
        <AlertDescription>
          Your license has expired, but you are in a grace period. Access will be revoked in {status.daysRemaining} days.
          Please renew your license soon.
        </AlertDescription>
      </Alert>
    );
  }

  if (status.status === 'active' && status.daysRemaining <= 14) {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <Clock className="h-4 w-4 text-blue-500" />
        <AlertTitle>License Expiring Soon</AlertTitle>
        <AlertDescription>
          Your academic license will expire in {status.daysRemaining} days ({new Date(status.licenseEnd).toLocaleDateString()}).
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default LicenseWarning;