import { v4 as uuidv4 } from 'uuid';

const generateSampleProduction = (days, initialRate, declineRate, bFactor) => {
    const data = [];
    let currentDate = new Date('2020-01-01');
    let q = initialRate;
    let Np = 0;
    
    // Convert nominal annual decline to monthly effective
    const Di = 1 - Math.pow(1 - declineRate, 1/12); 
    
    // Hyperbolic decline: q = qi / (1 + b * Di * t)^(1/b)
    // t in months here for simplicity in this generator
    
    for (let i = 0; i < days; i++) {
        // Add some noise
        const noise = 1 + (Math.random() * 0.1 - 0.05);
        
        // Simplified calculation for daily steps
        const t_months = i / 30.4;
        let rate;
        
        if (bFactor === 0) {
            // Exponential
            rate = initialRate * Math.exp(-Di * t_months);
        } else {
            // Hyperbolic
            rate = initialRate / Math.pow(1 + bFactor * Di * t_months, 1/bFactor);
        }
        
        const finalRate = Math.max(0, rate * noise);
        
        // Occasionally add downtime (0 rate)
        const isDowntime = Math.random() > 0.98;
        const dailyRate = isDowntime ? 0 : finalRate;
        
        Np += dailyRate; // Daily volume
        
        data.push({
            date: currentDate.toISOString().split('T')[0],
            oilRate: dailyRate,
            gasRate: dailyRate * 1000 * (0.8 + Math.random()*0.4), // GOR ~ 1000
            waterRate: Np * 0.0005 * (0.9 + Math.random()*0.2), // Increasing water cut
            cumulativeOil: Np,
            days: i
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
};

export const sampleProjects = [
    {
        id: uuidv4(),
        name: "Permian Basin Analysis",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wells: [
            {
                id: uuidv4(),
                name: "Wolfcamp A-101",
                data: generateSampleProduction(730, 800, 0.45, 0.6),
                metadata: {
                    basin: "Permian",
                    formation: "Wolfcamp",
                    operator: "Apex Energy",
                    spudDate: "2019-11-15"
                }
            },
            {
                id: uuidv4(),
                name: "Bone Spring B-205",
                data: generateSampleProduction(500, 650, 0.35, 0.4),
                metadata: {
                    basin: "Permian",
                    formation: "Bone Spring",
                    operator: "Apex Energy",
                    spudDate: "2020-03-22"
                }
            }
        ],
        scenarios: []
    }
];