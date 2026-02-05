// Analytical generation for Buildup Test
// Sequence: Flow for 48 hours, then Shut-in for 48 hours

const generateBuildupData = () => {
    const data = [];
    const Pi = 3000;
    const q = 200; // STB/D
    const tp = 48; // Producing time (hrs)
    
    const m = 35; // Semi-log slope psi/cycle
    
    // Producing Period (0 to 48 hrs) - simplified just to show history
    for (let t = 0; t < tp; t += 1) {
        data.push({
            time: t,
            pressure: 2500 - (t * 0.5), // Arbitrary flowing pressure profile
            rate: q
        });
    }

    // Shut-in Period (dt from 0 to 48)
    const dt_steps = [];
    for (let i = -4; i <= 1.7; i += 0.1) dt_steps.push(Math.pow(10, i)); // 0.0001 to 50 hrs

    dt_steps.forEach(dt => {
        if (dt > 48) return;
        const totalTime = Number((tp + dt).toFixed(4));
        
        // Superposition: Pws = Pi - m * log((tp + dt)/dt)
        const hornerTime = (tp + dt) / dt;
        let pws = Pi - m * Math.log10(hornerTime);
        
        // Add WBS effect (afterflow) - reducing pressure buildup at early dt
        // P_real = P_wf_at_shutin + (Pws - P_wf_at_shutin) * (1 - exp(-dt/alpha))
        const P_wf_shutin = 2476; // End of flow pressure
        const wbs_factor = 1 - Math.exp(-dt / 0.15); // Storage constant 0.15 hrs
        
        let pressure = P_wf_shutin + (pws - P_wf_shutin) * wbs_factor;

        // Add noise
        pressure += (Math.random() - 0.5) * 0.2;

        data.push({
            time: totalTime,
            pressure: Number(pressure.toFixed(2)),
            rate: 0
        });
    });

    return data;
};

export const sampleBuildupTest = generateBuildupData();