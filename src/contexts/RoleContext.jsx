import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Define system roles matching the 'profiles' table 'role' column
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', // Petrolord Admin
  UNIVERSITY_ADMIN: 'university_admin',
  LECTURER: 'lecturer',
  STUDENT: 'student'
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Petrolord Admin',
  [ROLES.UNIVERSITY_ADMIN]: 'University Admin',
  [ROLES.LECTURER]: 'Lecturer',
  [ROLES.STUDENT]: 'Student'
};

export const RoleProvider = ({ children }) => {
  const { profile, user, isSuperAdmin, isAdmin } = useAuth();
  
  // Helper to determine the "real" role from available data sources
  const getDerivedRole = () => {
    // 1. PRIORITY CHECK: User Metadata for University Admin
    // This handles the scenario where a user is upgraded to Admin via Edge Function,
    // which updates user_metadata but might not immediately update the profiles table
    // (or if triggers don't fire on update).
    if (user?.user_metadata?.role === ROLES.UNIVERSITY_ADMIN) {
        return ROLES.UNIVERSITY_ADMIN;
    }

    // 2. Database Profile (Standard source of truth)
    if (profile?.role) return profile.role;
    
    // 3. User Metadata (Fastest source on initial login)
    if (user?.user_metadata?.role) return user.user_metadata.role;
    
    // 4. Fallback
    return ROLES.STUDENT;
  };

  const [actualRole, setActualRole] = useState(getDerivedRole());
  const [viewRole, setViewRole] = useState(getDerivedRole());
  
  // Permission check: Only Super Admins and Petrolord Admins can impersonate
  const canImpersonate = isSuperAdmin || isAdmin;

  // Reactively update roles when auth state changes
  useEffect(() => {
    const role = getDerivedRole();
    setActualRole(role);
    
    // Reset view role to actual role when the underlying user/profile changes
    // This ensures correct dashboard routing on login/refresh
    setViewRole(role);
  }, [profile, user]);

  const changeViewRole = (role) => {
    if (canImpersonate) {
      setViewRole(role);
    }
  };

  const value = {
    viewRole,
    actualRole,
    canImpersonate,
    changeViewRole,
    // Boolean helpers for easy conditional rendering across the app
    isViewAsSuperAdmin: viewRole === ROLES.SUPER_ADMIN,
    isViewAsAdmin: viewRole === ROLES.ADMIN,
    isViewAsUniversityAdmin: viewRole === ROLES.UNIVERSITY_ADMIN,
    isViewAsLecturer: viewRole === ROLES.LECTURER,
    // Default to student view if role is student OR if no specific view role matches (safe fallback)
    isViewAsStudent: viewRole === ROLES.STUDENT || !Object.values(ROLES).includes(viewRole),
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};