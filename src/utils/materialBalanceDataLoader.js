import { sampleReservoirs } from '@/data/materialBalance/reservoirs';
import { generatePVTData } from '@/data/materialBalance/pvt';
import { generateProductionHistory } from '@/data/materialBalance/production';
import { samplePressureHistory } from '@/data/materialBalance/pressureHistory';
import { samplePressureDependentProperties } from '@/data/materialBalance/pressureDependentProperties';
import { generatePressureSaturation } from '@/data/materialBalance/pressureSaturationData';
import { v4 as uuidv4 } from 'uuid';

const generateRockProperties = (reservoir) => {
    // Generate RelPerm curves (Corey)
    const swi = reservoir.parameters.swi || 0.2;
    const sor = 0.25;
    const steps = 20;
    const relPerm = [];
    
    for(let i=0; i<=steps; i++) {
        const sw = swi + (1 - swi - sor) * (i/steps);
        const se = (sw - swi) / (1 - swi - sor); // Effective saturation
        
        // Water curve
        const krw = 0.3 * Math.pow(se, 3);
        // Oil curve
        const kro = 0.8 * Math.pow(1 - se, 2);
        
        relPerm.push({ sw: parseFloat(sw.toFixed(2)), krw: parseFloat(krw.toFixed(4)), kro: parseFloat(kro.toFixed(4)) });
    }
    
    return { relPerm, capillaryPressure: [] }; // Placeholder for Pc
};

const generateWells = (reservoir, tankId) => {
    const count = Math.floor(Math.random() * 5) + 3; // 3-8 wells per tank
    const wells = [];
    for(let i=0; i<count; i++) {
        wells.push({
            id: uuidv4(),
            tankId: tankId,
            name: `${reservoir.name.split(' ')[0]}-${100 + i}`,
            type: 'Producer',
            status: Math.random() > 0.8 ? 'Shut-in' : 'Active',
            completionDate: '2020-06-15',
            cumOil: Math.floor(Math.random() * 500000),
            lastRate: Math.floor(Math.random() * 500),
            // Add well-specific pressure data
            lastBHP: Math.round(reservoir.parameters.currentPressure * 0.8), // Flowing pressure lower than res pressure
            lastWHP: Math.round(reservoir.parameters.currentPressure * 0.3)
        });
    }
    return wells;
};

export const loadMaterialBalanceSampleData = () => {
    const projectId = "proj-mb-sample-001";
    const project = {
        id: projectId,
        name: "Permian Basin Material Balance Study",
        description: "Comprehensive analysis of 5 key reservoirs across Midland and Delaware basins.",
        createdAt: new Date().toISOString(),
    };

    const tanks = sampleReservoirs.map(res => ({
        id: uuidv4(),
        projectId: projectId,
        name: res.name,
        type: res.type,
        basin: res.basin,
        formation: res.formation,
        status: res.status,
        parameters: { ...res.parameters },
        fluidProperties: res.fluidProperties,
        driveMechanism: res.driveMechanism
    }));

    const productionData = {};
    const pvtData = {};
    const rockData = {};
    const wellData = {};
    
    // New Pressure Data Containers
    const pressureHistory = {};
    const pressureProps = {};
    const pressureSaturation = {};
    
    const groups = [
        { id: 'grp-midland', name: 'Midland Basin Assets', tankIds: [] },
        { id: 'grp-delaware', name: 'Delaware Basin Assets', tankIds: [] }
    ];

    tanks.forEach((tank, index) => {
        const originalRes = sampleReservoirs[index];
        
        productionData[tank.id] = generateProductionHistory(originalRes);
        pvtData[tank.id] = generatePVTData(originalRes);
        rockData[tank.id] = generateRockProperties(originalRes);
        wellData[tank.id] = generateWells(originalRes, tank.id);
        
        // Load new pressure datasets
        pressureHistory[tank.id] = samplePressureHistory[originalRes.id] || [];
        pressureProps[tank.id] = samplePressureDependentProperties[originalRes.id] || [];
        pressureSaturation[tank.id] = generatePressureSaturation(originalRes);

        // Assign to groups
        if (tank.basin === 'Midland') groups[0].tankIds.push(tank.id);
        else if (tank.basin === 'Delaware') groups[1].tankIds.push(tank.id);
    });

    return {
        project,
        tanks,
        productionData,
        pvtData,
        rockData,
        wellData,
        groups,
        // Include new datasets in return object
        pressureHistory,
        pressureProps,
        pressureSaturation,
        scenarios: [
            { id: 'scn-base', name: 'Base Case', description: 'Most likely geologic realization.' },
            { id: 'scn-high', name: 'High Transmissibility', description: 'Assumes higher aquifer support.' },
            { id: 'scn-low', name: 'Sealed Boundary', description: 'Compartmentalized reservoir assumption.' }
        ]
    };
};