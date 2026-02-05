export const sampleReservoirs = [
    {
        id: "MB-RES-001",
        name: "Midland Wolfcamp A - Tank 1",
        field: "Midland Basin",
        formation: "Wolfcamp A",
        basin: "Midland",
        type: "Oil",
        parameters: {
            initialPressure: 4500, // psia
            currentPressure: 3200, // psia
            temperature: 160, // F
            porosity: 0.08, // 8%
            permeability: 0.5, // md
            thickness: 150, // ft
            area: 640, // acres
            depth: 9200, // ft TVD
            swi: 0.25, // Initial water saturation
            cf: 3e-6, // Formation compressibility
            cw: 3e-6, // Water compressibility
            originalOilInPlace: 12500000, // STB
            originalGasInPlace: 18750000, // MSCF
            
            // New Pressure Data
            bubblePointPressure: 2800, // psia
            pressureGradient: 0.46, // psi/ft
            pressureDatumDepth: 9000, // ft
            pressureAtDatum: 4400, // psia
            pressureDeclineRate: 45, // psi/month (avg)
            pressureMaintenanceStatus: "None",
            pressureSupportMechanism: "Solution Gas Drive"
        },
        fluidProperties: {
            apiGravity: 42,
            gasGravity: 0.75,
            salinity: 35000,
            initialGor: 1500,
            bubblePoint: 2800
        },
        driveMechanism: "Solution Gas Drive",
        status: "Active"
    },
    {
        id: "MB-RES-002",
        name: "Delaware Bone Spring - Tank 2",
        field: "Delaware Basin",
        formation: "2nd Bone Spring",
        basin: "Delaware",
        type: "Oil",
        parameters: {
            initialPressure: 5200,
            currentPressure: 4800,
            temperature: 175,
            porosity: 0.12,
            permeability: 2.5,
            thickness: 80,
            area: 320,
            depth: 10500,
            swi: 0.30,
            cf: 4e-6,
            cw: 3e-6,
            originalOilInPlace: 8500000,
            originalGasInPlace: 8500000,
            
             // New Pressure Data
            bubblePointPressure: 2200,
            pressureGradient: 0.52, // Overpressured
            pressureDatumDepth: 10500,
            pressureAtDatum: 5200,
            pressureDeclineRate: 15,
            pressureMaintenanceStatus: "Active",
            pressureSupportMechanism: "Water Injection + Aquifer"
        },
        fluidProperties: {
            apiGravity: 38,
            gasGravity: 0.7,
            salinity: 45000,
            initialGor: 1000,
            bubblePoint: 2200
        },
        driveMechanism: "Combination Drive",
        status: "Active"
    },
    {
        id: "MB-RES-003",
        name: "CBP San Andres - Tank 3",
        field: "Central Basin Platform",
        formation: "San Andres",
        basin: "Midland",
        type: "Oil",
        parameters: {
            initialPressure: 1800,
            currentPressure: 1650,
            temperature: 110,
            porosity: 0.15,
            permeability: 15,
            thickness: 200,
            area: 1280,
            depth: 4500,
            swi: 0.35,
            cf: 5e-6,
            cw: 3e-6,
            originalOilInPlace: 25000000,
            originalGasInPlace: 5000000,
            
             // New Pressure Data
            bubblePointPressure: 800,
            pressureGradient: 0.433, // Hydrostatic
            pressureDatumDepth: 4500,
            pressureAtDatum: 1800,
            pressureDeclineRate: 2, // Strong water drive support
            pressureMaintenanceStatus: "Natural Aquifer",
            pressureSupportMechanism: "Strong Water Drive"
        },
        fluidProperties: {
            apiGravity: 32,
            gasGravity: 0.65,
            salinity: 60000,
            initialGor: 200,
            bubblePoint: 800
        },
        driveMechanism: "Water Drive",
        status: "Active"
    },
    {
        id: "MB-RES-004",
        name: "Delaware Wolfcamp B - Tank 4",
        field: "Delaware Basin",
        formation: "Wolfcamp B",
        basin: "Delaware",
        type: "Condensate",
        parameters: {
            initialPressure: 6500,
            currentPressure: 3500,
            temperature: 195,
            porosity: 0.09,
            permeability: 0.1,
            thickness: 300,
            area: 1280,
            depth: 11500,
            swi: 0.20,
            cf: 3e-6,
            cw: 3e-6,
            originalOilInPlace: 5000000,
            originalGasInPlace: 50000000,
            
             // New Pressure Data
            dewPointPressure: 6000, // For gas/condensate
            pressureGradient: 0.58, // Highly overpressured
            pressureDatumDepth: 11500,
            pressureAtDatum: 6500,
            pressureDeclineRate: 80, // Rapid decline
            pressureMaintenanceStatus: "None",
            pressureSupportMechanism: "Gas Expansion"
        },
        fluidProperties: {
            apiGravity: 55,
            gasGravity: 0.8,
            salinity: 40000,
            initialGor: 10000,
            bubblePoint: 6000 // Using as Dew Point proxy in data structure
        },
        driveMechanism: "Gas Expansion",
        status: "Active"
    },
    {
        id: "MB-RES-005",
        name: "Midland Spraberry - Tank 5",
        field: "Midland Basin",
        formation: "Spraberry",
        basin: "Midland",
        type: "Oil",
        parameters: {
            initialPressure: 3200,
            currentPressure: 1200,
            temperature: 140,
            porosity: 0.10,
            permeability: 0.05,
            thickness: 50,
            area: 640,
            depth: 7200,
            swi: 0.40,
            cf: 4e-6,
            cw: 3e-6,
            originalOilInPlace: 6000000,
            originalGasInPlace: 6000000,
            
             // New Pressure Data
            bubblePointPressure: 2500,
            pressureGradient: 0.44,
            pressureDatumDepth: 7200,
            pressureAtDatum: 3200,
            pressureDeclineRate: 35,
            pressureMaintenanceStatus: "None",
            pressureSupportMechanism: "Solution Gas Drive"
        },
        fluidProperties: {
            apiGravity: 40,
            gasGravity: 0.72,
            salinity: 30000,
            initialGor: 1000,
            bubblePoint: 2500
        },
        driveMechanism: "Solution Gas Drive",
        status: "Active"
    }
];