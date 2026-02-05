const generateDamagedData = () => {
    const data = [];
    const Pi = 2900;
    const skin = 15; // High positive skin
    const m = 20;

    const times = [];
    for (let i = -3; i <= 2; i += 0.05) times.push(Math.pow(10, i));

    times.forEach(t => {
        if (t > 72) return;
        
        // P = Pi - m(log(t) + s)
        // Skin adds a large constant pressure drop
        const dp_skin = m * 0.87 * skin; 
        const dp_radial = m * (Math.log10(t) + 2);
        
        let dp = dp_radial + dp_skin;
        
        // WBS masks skin early on
        const wbs_time = 0.5; // longer WBS due to damage often restricting flow? No, damage is near wellbore.
        const wbs_factor = Math.exp(-t/wbs_time);
        
        // At t=0, dp should be 0.
        // During WBS, unit slope.
        const dp_wbs = 500 * t;
        
        const effective_dp = dp_wbs * wbs_factor + dp * (1 - wbs_factor);
        
        const pressure = Pi - effective_dp;
        
        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number(pressure.toFixed(2)),
            rate: 140
        });
    });

    return data;
};

export const sampleDamagedWellTest = generateDamagedData();