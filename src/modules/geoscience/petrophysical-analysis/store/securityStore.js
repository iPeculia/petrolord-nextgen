import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export const useSecurityStore = create(
  persist(
    (set, get) => ({
      users: [],
      roles: [],
      auditLogs: [],
      settings: {
        twoFactor: false,
        passwordMinLength: 12,
        passwordComplexity: true,
        sessionTimeout: 15,
        loginAttempts: 3,
        ipWhitelist: [],
        apiAccess: false
      },

      // Initialize with current user if store is empty
      initializeStore: (currentUser) => {
          const state = get();
          if (currentUser && state.users.length === 0) {
              const initialAdmin = {
                  id: currentUser.id,
                  name: currentUser.email?.split('@')[0] || 'System Admin',
                  email: currentUser.email,
                  role: 'Admin',
                  status: 'Active',
                  department: 'IT',
                  lastLogin: format(new Date(), 'yyyy-MM-dd HH:mm')
              };
              
              const initialRoles = [
                  { id: 'r1', name: 'Admin', description: 'Full system access', permissions: ['all'], usersCount: 1 },
                  { id: 'r2', name: 'User', description: 'Standard access', permissions: ['read', 'write'], usersCount: 0 },
                  { id: 'r3', name: 'Viewer', description: 'Read-only access', permissions: ['read'], usersCount: 0 }
              ];

              set({
                  users: [initialAdmin],
                  roles: initialRoles
              });
              
              get().addAuditLog('System', 'Initialization', 'Success', 'Security store initialized with current user as Admin');
          }
      },

      // User Actions
      addUser: (user) => set(state => {
        const newUser = { 
            ...user, 
            id: crypto.randomUUID(), 
            status: user.status || 'Active', 
            lastLogin: 'Never'
        };
        get().addAuditLog('Create', 'User', 'Success', `Created user ${user.email}`);
        return { users: [newUser, ...state.users] };
      }),
      
      updateUser: (id, updates) => set(state => {
        get().addAuditLog('Update', 'User', 'Success', `Updated user ${id}`);
        return { users: state.users.map(u => u.id === id ? { ...u, ...updates } : u) };
      }),
      
      deleteUser: (id) => set(state => {
        get().addAuditLog('Delete', 'User', 'Success', `Deleted user ${id}`);
        return { users: state.users.filter(u => u.id !== id) };
      }),

      // Role Actions
      addRole: (role) => set(state => {
        get().addAuditLog('Create', 'Role', 'Success', `Created role ${role.name}`);
        return { roles: [...state.roles, { ...role, id: crypto.randomUUID(), usersCount: 0 }] };
      }),
      
      updateRole: (id, updates) => set(state => {
        get().addAuditLog('Update', 'Role', 'Success', `Updated role ${id}`);
        return { roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r) };
      }),
      
      deleteRole: (id) => set(state => {
        get().addAuditLog('Delete', 'Role', 'Success', `Deleted role ${id}`);
        return { roles: state.roles.filter(r => r.id !== id) };
      }),

      // Settings Actions
      updateSettings: (newSettings) => set(state => {
        get().addAuditLog('Update', 'Settings', 'Success', 'Updated security configuration');
        return { settings: { ...state.settings, ...newSettings } };
      }),

      // Audit Helper
      addAuditLog: (action, resource, status, details) => set(state => ({
        auditLogs: [{
          id: crypto.randomUUID(),
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          user: 'Current User', // In a real app, get from auth context
          action,
          resource,
          status,
          details
        }, ...state.auditLogs]
      })),

      clearAuditLogs: () => set({ auditLogs: [] })
    }),
    {
      name: 'petrolord-security-storage-v2', // New key to ensure clean slate
    }
  )
);