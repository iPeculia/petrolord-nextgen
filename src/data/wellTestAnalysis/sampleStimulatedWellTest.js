const generateStimulatedData = () => {
    const data = [];
    const Pi = 3100;
    const skin = -3.5; // Negative skin
    const m = 18;

    const times = [];
    for (let i = -4; i <= 2; i += 0.05) times.push(Math.pow(10, i));

    times.forEach(t => {
        if (t > 60) return;
        
        // Negative skin reduces pressure drop
        const dp_skin = m * 0.87 * skin; // This is negative
        const dp_radial = m * (Math.log10(t) + 2.5);
        
        let dp = dp_radial + dp_skin;
        if (dp < 0) dp = 1 * t; // Physical check, cannot gain pressure in drawdown
        
        // Very fast cleanup/WBS for stimulated wells often
        const wbs_factor = Math.exp(-t/0.01); 
        
        const effective_dp = (100*t) * wbs_factor + dp * (1 - wbs_factor);
        
        const pressure = Pi - effective_dp;

        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number(pressure.toFixed(2)),
            rate: 280
        });
    });

    return data;
};

export const sampleStimulatedWellTest = generateStimulatedData();