/**
 * Centralized Logging Service
 * Handles log levels, console output, and potential remote logging integration
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

const CURRENT_LEVEL = import.meta.env.MODE === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

export const LoggingService = {
    debug: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    },

    info: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            console.info(`[INFO] ${message}`, data || '');
        }
    },

    success: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            // Console doesn't have 'success', use info with a prefix
            console.info(`[SUCCESS] ${message}`, data || '');
        }
    },

    warn: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            console.warn(`[WARN] ${message}`, data || '');
        }
    },

    error: (message, error) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            console.error(`[ERROR] ${message}`, error || '');
            // Future: Send to Sentry/LogRocket here
        }
    }
};