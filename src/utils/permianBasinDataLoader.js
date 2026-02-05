import { permianBasinWells } from '../data/permianBasinWells';
import { permianBasinProductionData } from '../data/permianBasinProductionData';
import { permianBasinFittedModels } from '../data/permianBasinFittedModels';
import { permianBasinScenarios } from '../data/permianBasinScenarios';
import { permianBasinGroups } from '../data/permianBasinGroups';
import { permianBasinTypeCurves } from '../data/permianBasinTypeCurves';

// This utility mimics loading data into the application state
export const loadPermianBasinSampleData = () => {
    console.log("Loading Permian Basin Sample Data...");
    
    // In a real app, this might dispatch actions to a Redux store or Context
    // For this demo, we return a structured object that the Context can ingest
    
    // Attach production data to wells for convenience
    const wellsWithData = permianBasinWells.map(well => ({
        ...well,
        data: permianBasinProductionData[well.id] || [],
        model: permianBasinFittedModels[well.id] || permianBasinFittedModels["default"]
    }));

    return {
        project: {
            id: "proj-permian-demo",
            name: "Permian Basin Analysis Project",
            description: "Comprehensive decline curve analysis of Midland and Delaware basin assets.",
            created: new Date().toISOString(),
            wells: wellsWithData,
            scenarios: permianBasinScenarios,
            groups: permianBasinGroups,
            typeCurves: permianBasinTypeCurves,
            settings: {
                economic: {
                    oilPrice: 75,
                    gasPrice: 3.50,
                    discountRate: 0.10
                }
            }
        }
    };
};