// Procedural generator for a realistic PUNQ-S3 proxy model
// Dimensions: 19 x 28 x 5
// Features: Anticline structure, Gas Cap, Oil Zone, Aquifer
// 1,761 active cells (approximate via corner cutting)

export const generatePunqS3Model = () => {
    const NX = 19;
    const NY = 28;
    const NZ = 5;
    
    // Grid Generation Helpers
    // Create an anticline structure: depth increases away from center (9.5, 14)
    const getDepth = (i, j, k) => {
        const dx = (i - NX/2);
        const dy = (j - NY/2);
        const distSq = dx*dx + dy*dy * 0.5; // Elongated in Y
        const baseDepth = 2300; // meters
        const structureDip = 15 * Math.sqrt(distSq); // Dip
        const layerThickness = 10 + k * 12; // Variable thickness
        return baseDepth + structureDip + layerThickness;
    };

    // Active Cell Mask (Corner cutting to match irregular shape)
    const isActive = (i, j) => {
        // Cut off corners to make it look like the real PUNQ-S3 shape (roughly diamond/oval)
        const dx = Math.abs(i - NX/2);
        const dy = Math.abs(j - NY/2);
        return (dx/9 + dy/13) <= 1.2;
    };

    // Property Generation
    const generateStaticProperties = () => {
        const grid = [];
        for (let i = 0; i < NX; i++) {
            const row = [];
            for (let j = 0; j < NY; j++) {
                const col = [];
                for (let k = 0; k < NZ; k++) {
                    if (!isActive(i, j)) {
                        col.push(null); // Inactive
                        continue;
                    }

                    // Geological Facies
                    // Layers 1-3: Better quality Sand, 4-5: Lower quality / Shale streaks
                    let facies = 'Sand';
                    let poro = 0.2 + Math.random() * 0.1;
                    let perm = 100 * Math.exp(poro * 10);
                    
                    if (k >= 3 && Math.random() > 0.6) {
                        facies = 'Shaly Sand';
                        poro *= 0.7;
                        perm *= 0.1;
                    }

                    col.push({
                        i, j, k,
                        active: true,
                        tvd: getDepth(i, j, k), // Top depth
                        facies,
                        porosity: poro,
                        permeability: perm,
                        dx: 180, dy: 180, dz: 15 // Cell dimensions (m)
                    });
                }
                row.push(col);
            }
            grid.push(row);
        }
        return grid;
    };

    // Dynamic Simulation Data Generation (Time Steps)
    const timeSteps = [0, 1, 5, 10, 15]; // Years
    const GOC_DEPTH = 2360; // Gas-Oil Contact
    const OWC_DEPTH = 2420; // Oil-Water Contact

    const generateTimeStepData = (staticGrid, year) => {
        const gridData = []; // Store as 3D structure for section view access

        for (let i = 0; i < NX; i++) {
            const row = [];
            for (let j = 0; j < NY; j++) {
                const col = [];
                for (let k = 0; k < NZ; k++) {
                    const cell = staticGrid[i][j][k];
                    if (!cell) {
                        col.push(null);
                        continue;
                    }

                    // Initial Saturation based on Depth
                    let sg = 0, so = 0, sw = 0;
                    const depth = cell.tvd;

                    if (depth < GOC_DEPTH) {
                        sg = 0.8; sw = 0.2; so = 0; // Gas Cap
                    } else if (depth < OWC_DEPTH) {
                        sg = 0; sw = 0.2; so = 0.8; // Oil Zone
                    } else {
                        sg = 0; sw = 1.0; so = 0; // Aquifer
                    }

                    // Simulation: Dynamic Changes over time
                    // Scenario: Gas cap expansion + Aquifer drive + Production
                    // Water moves up (aquifer support), Gas expands down (pressure depletion)
                    
                    const waterRise = year * 1.5; // meters per year
                    const gasExpansion = year * 0.8; // meters per year

                    // Apply dynamic contacts
                    const dynamicGOC = GOC_DEPTH + gasExpansion;
                    const dynamicOWC = OWC_DEPTH - waterRise;

                    // Recalculate saturations with transition zones
                    if (depth < dynamicGOC) {
                         sg = Math.max(0.6, sg); // Gas stays or invades
                         so = 1 - sg - sw;
                    } else if (depth > dynamicOWC) {
                         sw = Math.max(0.8, sw); // Water sweeps
                         so = 1 - sw - sg;
                    }

                    // Random noise for realism
                    if (cell.facies === 'Shaly Sand') {
                        sw = Math.min(1, sw + 0.1); // Higher irreducible water
                        so = Math.max(0, 1 - sw - sg);
                    }

                    // Pressure Depletion
                    const initialPressure = 300 + (depth - 2300) * 0.1; // hydrostatic roughly
                    const pressure = Math.max(100, initialPressure - (year * 3)); // 3 bar/year depletion

                    const cellData = {
                        ...cell,
                        pressure,
                        sg, so, sw,
                        year
                    };

                    col.push(cellData);
                }
                row.push(col);
            }
            gridData.push(row);
        }
        return gridData;
    };

    const staticGrid = generateStaticProperties();
    const historyData = timeSteps.map(year => generateTimeStepData(staticGrid, year));

    return {
        id: 'model_punq_s3',
        name: 'PUNQ-S3 Realistic Model',
        description: 'Standard reservoir engineering dataset featuring a complex anticline structure with a gas cap, oil rim, and aquifer support. 19x28x5 Grid.',
        type: 'Real Field',
        pattern: 'Anticline',
        grid: { nx: NX, ny: NY, nz: NZ },
        timeSteps,
        wells: [
            { id: 'PRO-1', type: 'Producer', i: 11, j: 16, x: 11, y: 16, color: '#ef4444' }, // Center producer
            { id: 'PRO-4', type: 'Producer', i: 8, j: 14, x: 8, y: 14, color: '#ef4444' },
            { id: 'PRO-5', type: 'Producer', i: 13, j: 18, x: 13, y: 18, color: '#ef4444' },
            { id: 'PRO-11', type: 'Producer', i: 9, j: 12, x: 9, y: 12, color: '#ef4444' },
            { id: 'PRO-12', type: 'Producer', i: 6, j: 15, x: 6, y: 15, color: '#ef4444' },
            { id: 'INJ-6', type: 'Injector', i: 15, j: 22, x: 15, y: 22, color: '#3b82f6' } // Downdip injector
        ],
        data: {
            // Structure: [TimeStep][i][j][k]
            snapshots: historyData
        },
        metadata: {
            GOC: GOC_DEPTH,
            OWC: OWC_DEPTH,
            fieldSize: '3.5 x 5.0 km'
        }
    };
};