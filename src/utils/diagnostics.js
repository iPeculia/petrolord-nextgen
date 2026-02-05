/**
 * System Diagnostics Utility
 * Performs runtime checks on the application environment, storage, and connectivity.
 */

import { supabase } from '@/lib/customSupabaseClient';

export const runSystemDiagnostics = async () => {
    const report = {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
        checks: {
            supabaseConnection: { status: 'pending' },
            localStorageUsage: { status: 'pending' },
            browserCapabilities: { status: 'pending' },
            networkStatus: { status: 'pending' }
        }
    };

    console.group('🔍 Running System Diagnostics...');

    // 1. Check Network
    report.checks.networkStatus = {
        status: navigator.onLine ? 'pass' : 'fail',
        details: navigator.onLine ? 'Online' : 'Offline'
    };

    // 2. Check Browser Capabilities
    const storageAvailable = typeof window.localStorage !== 'undefined';
    report.checks.browserCapabilities = {
        status: storageAvailable ? 'pass' : 'fail',
        details: {
            localStorage: storageAvailable,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        }
    };

    // 3. Estimate LocalStorage Usage
    if (storageAvailable) {
        let total = 0;
        let itemCount = 0;
        for (let x in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, x)) {
                total += ((localStorage[x].length + x.length) * 2);
                itemCount++;
            }
        }
        const usageKB = (total / 1024).toFixed(2);
        report.checks.localStorageUsage = {
            status: total < 5000000 ? 'pass' : 'warn', // Warn if > 5MB approx
            details: {
                usageKB: `${usageKB} KB`,
                itemCount: itemCount
            }
        };
    }

    // 4. Check Supabase Connection
    try {
        const start = performance.now();
        const { data, error } = await supabase.from('profiles').select('count').limit(1).single();
        const duration = performance.now() - start;
        
        if (error) throw error;

        report.checks.supabaseConnection = {
            status: 'pass',
            details: {
                latency: `${duration.toFixed(2)}ms`,
                message: 'Connected successfully'
            }
        };
    } catch (error) {
        report.checks.supabaseConnection = {
            status: 'fail',
            details: {
                message: error.message || 'Connection failed'
            }
        };
    }

    console.log('Diagnostics Report:', report);
    console.groupEnd();

    return report;
};

export const getStorageMetrics = () => {
    const metrics = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = ((value.length + key.length) * 2) / 1024; // KB
        metrics[key] = size.toFixed(2) + ' KB';
    }
    return metrics;
};