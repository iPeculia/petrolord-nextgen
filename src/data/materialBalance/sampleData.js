export const sampleProductionData = [
    { date: '2020-01-01', Np: 1000, Gp: 500, Wp: 0, pressure: 3500 },
    { date: '2020-02-01', Np: 5000, Gp: 2500, Wp: 10, pressure: 3450 },
    { date: '2020-03-01', Np: 12000, Gp: 6000, Wp: 50, pressure: 3400 },
    { date: '2020-04-01', Np: 20000, Gp: 10000, Wp: 120, pressure: 3320 },
    { date: '2020-05-01', Np: 30000, Gp: 16000, Wp: 300, pressure: 3250 },
    { date: '2020-06-01', Np: 42000, Gp: 22000, Wp: 500, pressure: 3180 },
    { date: '2020-07-01', Np: 55000, Gp: 30000, Wp: 800, pressure: 3100 },
];

export const samplePVTData = {
    oil: [
        { pressure: 4000, Bo: 1.25, Rs: 600, visc: 0.8 },
        { pressure: 3500, Bo: 1.28, Rs: 650, visc: 0.75 },
        { pressure: 3000, Bo: 1.32, Rs: 700, visc: 0.7 },
        { pressure: 2500, Bo: 1.35, Rs: 750, visc: 0.65 },
        { pressure: 2000, Bo: 1.28, Rs: 600, visc: 0.85 },
    ],
    gas: [
        { pressure: 4000, Bg: 0.0007, z: 0.9 },
        { pressure: 3500, Bg: 0.0008, z: 0.88 },
        { pressure: 3000, Bg: 0.00095, z: 0.87 },
        { pressure: 2500, Bg: 0.0012, z: 0.88 },
    ],
    water: [
        { pressure: 4000, Bw: 1.02, cw: 3e-6 },
        { pressure: 2000, Bw: 1.03, cw: 3e-6 },
    ]
};

export const sampleRegressionResults = {
    slope: 1.2e6,
    intercept: 5000,
    r2: 0.985
};

export const sampleDriveAssessment = {
    primary: "Solution Gas Drive",
    confidence: "High",
    details: "Strong linearity in F vs Eo plot."
};