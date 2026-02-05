import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useLicenseStatus from '@/hooks/useLicenseStatus';
import { Loader2 } from 'lucide-react';

/**
 * Route wrapper that ensures a user has a valid license before rendering children.
 * Redirects to '/dashboard' or custom fallback if license is invalid.
 * 
 * Usage:
 * <ProtectedLicenseRoute userId={user.id}>
 *   <CourseContent />
 * </ProtectedLicenseRoute>
 */
const ProtectedLicenseRoute = ({ userId, children, fallbackPath = '/dashboard' }) => {
  const { isValid, isLoading, status } = useLicenseStatus(userId);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Verifying License Status...</h3>
      </div>
    );
  }

  if (!isValid) {
    // If invalid, we redirect. 
    // We pass state so the destination page can show a specific message if it wants.
    return <Navigate to={fallbackPath} state={{ from: location, licenseError: status?.message }} replace />;
  }

  return children;
};

export default ProtectedLicenseRoute;