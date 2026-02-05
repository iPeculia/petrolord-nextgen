import { History, Bookmark, TrendingUp, Search } from 'lucide-react';

// Mock Data / "Index" of the Application
export const SYSTEM_MODULES = [
  {
    id: 'geo-1',
    title: 'Petrophysical Analysis',
    type: 'Application',
    module: 'Geoscience',
    description: 'Advanced well log analysis, porosity modeling, and saturation estimation.',
    path: '/dashboard/geoscience/petrophysics',
    status: 'Active',
    tags: ['logs', 'porosity', 'saturation', 'well data']
  },
  {
    id: 'geo-2',
    title: 'Seismic Interpretation',
    type: 'Application',
    module: 'Geoscience',
    description: '2D/3D seismic visualization and horizon picking tools.',
    path: '/dashboard/geoscience/seismic',
    status: 'Coming Soon',
    tags: ['seismic', '3d', 'horizon', 'faults']
  },
  {
    id: 'res-1',
    title: 'Material Balance',
    type: 'Application',
    module: 'Reservoir',
    description: 'Reservoir drive mechanism analysis and volume estimation.',
    path: '/dashboard/reservoir/material-balance',
    status: 'Active',
    tags: ['pvt', 'pressure', 'production', 'drive mechanism']
  },
  {
    id: 'res-2',
    title: 'Reservoir Simulation',
    type: 'Application',
    module: 'Reservoir',
    description: 'Numerical simulation of reservoir performance and forecasting.',
    path: '/dashboard/reservoir/simulation',
    status: 'Active',
    tags: ['simulation', 'forecast', 'grid', 'flow']
  },
  {
    id: 'res-3',
    title: 'Decline Curve Analysis',
    type: 'Application',
    module: 'Reservoir',
    description: 'Production forecasting using Arps and advanced decline models.',
    path: '/dashboard/reservoir/dca',
    status: 'Active',
    tags: ['forecast', 'production', 'arps', 'economics']
  },
  {
    id: 'prod-1',
    title: 'Well Test Analysis',
    type: 'Application',
    module: 'Production',
    description: 'Pressure transient analysis for well characterization.',
    path: '/dashboard/production/well-test',
    status: 'Active',
    tags: ['pta', 'pressure', 'skin', 'permeability']
  },
  {
    id: 'prod-2',
    title: 'Volumetrics Pro',
    type: 'Application',
    module: 'Production',
    description: 'Monte Carlo simulation for reserves estimation.',
    path: '/dashboard/production/volumetrics',
    status: 'Active',
    tags: ['reserves', 'monte carlo', 'probabilistic', 'estimation']
  },
  {
    id: 'drill-1',
    title: 'Well Planning & Design',
    type: 'Application',
    module: 'Drilling',
    description: 'Trajectory planning and casing design module.',
    path: '/dashboard/drilling/planning',
    status: 'Active',
    tags: ['trajectory', 'casing', 'wellbore', 'geometry']
  },
  {
    id: 'eco-1',
    title: 'Economics Evaluation',
    type: 'Application',
    module: 'Economics',
    description: 'Cash flow analysis and investment metrics.',
    path: '/dashboard/economics',
    status: 'Coming Soon',
    tags: ['npv', 'irr', 'cash flow', 'investment']
  },
  {
    id: 'admin-1',
    title: 'User Management',
    type: 'Settings',
    module: 'Admin',
    description: 'Manage users, roles, and permissions.',
    path: '/dashboard/admin/users',
    status: 'Active',
    tags: ['users', 'roles', 'permissions', 'access']
  },
  {
    id: 'admin-2',
    title: 'System Settings',
    type: 'Settings',
    module: 'Admin',
    description: 'Configure global system parameters.',
    path: '/dashboard/admin/settings',
    status: 'Active',
    tags: ['configuration', 'global', 'system']
  }
];

export const SEARCH_CATEGORIES = ['All', 'Application', 'Module', 'Settings', 'Content'];

export const FILTER_MODULES = ['Geoscience', 'Reservoir', 'Production', 'Drilling', 'Economics', 'Admin'];

export const performSearch = (query, filters = {}) => {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  
  return SYSTEM_MODULES.filter(item => {
    // Text Match
    const matchesText = 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.module.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

    if (!matchesText) return false;

    // Filter Logic
    if (filters.module && filters.module !== 'All' && item.module !== filters.module) return false;
    if (filters.type && filters.type !== 'All' && item.type !== filters.type) return false;
    if (filters.status && filters.status !== 'All' && item.status !== filters.status) return false;

    return true;
  }).map(item => {
    // Simple Relevance Scoring
    let score = 0;
    if (item.title.toLowerCase().startsWith(lowerQuery)) score += 10;
    if (item.title.toLowerCase().includes(lowerQuery)) score += 5;
    if (item.tags.some(tag => tag.toLowerCase() === lowerQuery)) score += 8;
    if (item.module.toLowerCase() === lowerQuery) score += 3;
    
    return { ...item, relevance: score };
  }).sort((a, b) => b.relevance - a.relevance);
};

export const getPopularSearches = () => [
  'Material Balance', 'Decline Curve', 'Seismic', 'Porosity', 'Well Planning'
];