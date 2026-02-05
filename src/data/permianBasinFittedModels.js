export const permianBasinFittedModels = {
    "PB-001": {
        oil: {
            modelType: "Hyperbolic",
            qi: 1250,
            b: 1.1,
            Di: 0.68,
            r2: 0.96,
            rmse: 45.2,
            eur: 650000,
            economicLimitTime: 240, // months
            confidence: "High"
        },
        gas: {
            modelType: "Hyperbolic",
            qi: 2500,
            b: 1.2,
            Di: 0.60,
            r2: 0.94,
            eur: 1800000
        }
    },
    "PB-002": {
        oil: {
            modelType: "Hyperbolic",
            qi: 1050,
            b: 0.95,
            Di: 0.62,
            r2: 0.97,
            rmse: 32.1,
            eur: 580000,
            confidence: "High"
        }
    },
    "PB-003": {
        oil: {
            modelType: "Exponential",
            qi: 160,
            b: 0,
            Di: 0.15,
            r2: 0.98,
            rmse: 8.5,
            eur: 120000,
            confidence: "Medium"
        }
    },
    "PB-004": { // Gas well
        oil: {
             modelType: "Hyperbolic",
             qi: 200,
             b: 1.3,
             Di: 0.75,
             eur: 150000
        },
        gas: {
            modelType: "Hyperbolic",
            qi: 6500,
            b: 1.4,
            Di: 0.65,
            r2: 0.95,
            eur: 5500000,
            confidence: "High"
        }
    },
    // Default fallback for others
    "default": {
        oil: {
            modelType: "Hyperbolic",
            qi: 800,
            b: 1.0,
            Di: 0.65,
            r2: 0.90,
            eur: 450000,
            confidence: "Low"
        }
    }
};