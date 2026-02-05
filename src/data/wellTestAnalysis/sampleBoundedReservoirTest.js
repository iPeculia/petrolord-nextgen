const generateBoundedData = () => {
    const data = [];
    const Pi = 2300;
    
    const times = [];
    for (let i = -3; i <= 2; i += 0.05) times.push(Math.pow(10, i));

    times.forEach(t => {
        if (t > 96) return;

        // Radial flow base
        let dp = 15 * (Math.log10(t) + 3);
        
        // Boundary effect (PSS - Pseudo Steady State)
        // Pressure drops linearly with time: dp_pss ~ t
        if (t > 10) {
            dp += 0.5 * (t - 10); 
        }

        // WBS early
        const wbs_factor = Math.exp(-t/0.05);
        const dp_final = (200*t) * wbs_factor + dp * (1 - wbs_factor);
        
        const pressure = Pi - dp_final;

        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number(pressure.toFixed(2)),
            rate: 120
        });
    });

    return data;
};

export const sampleBoundedReservoirTest = generateBoundedData();