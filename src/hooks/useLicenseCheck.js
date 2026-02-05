import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLicenseStatus from './useLicenseStatus';

/**
 * Hook to enforce license validity on protected routes.
 * Redirects to a specified path (default: /dashboard) if license is invalid.
 * 
 * Usage:
 * useLicenseCheck(userId, '/login');
 * 
 * @param {string} userId - The user ID to check
 * @param {string} redirectPath - Path to redirect if license is invalid
 */
export const useLicenseCheck = (userId, redirectPath = '/dashboard') => {
  const { isValid, isLoading, status } = useLicenseStatus(userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isValid) {
      // Optional: Add toast or notification here about expired license
      console.warn('License invalid, redirecting...', status);
      navigate(redirectPath, { 
        state: { 
          reason: 'license_expired',
          message: status?.message || 'Your license is no longer valid.'
        }
      });
    }
  }, [isValid, isLoading, navigate, redirectPath, status]);

  return { isValid, isLoading };
};

export default useLicenseCheck;