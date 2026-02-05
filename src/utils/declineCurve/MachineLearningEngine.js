import { fitDecline } from './RegressionEngine';

/**
 * Machine Learning Engine for Decline Curve Analysis
 * Handles automated model selection, predictions, and anomaly detection.
 */

// 1. Automated Model Selection (AutoML-lite)
export const trainAndSelectModel = (data, constraints) => {
    // Models to evaluate
    const models = ['exponential', 'hyperbolic', 'harmonic'];
    const results = [];

    // Train each model
    models.forEach(modelType => {
        try {
            const result = fitDecline(data, modelType, constraints);
            results.push({ ...result, modelType });
        } catch (e) {
            console.warn(`Failed to fit ${modelType}:`, e);
        }
    });

    if (results.length === 0) throw new Error("No models could be fitted to the data.");

    // Score models (AIC/BIC or simple R2/RMSE)
    // We'll use a weighted score: 70% RMSE, 30% Complexity Penalty
    // Lower score is better
    const scoredResults = results.map(res => {
        // Simple heuristic: Hyperbolic is more complex than Expo/Harmonic
        const complexityPenalty = res.modelType === 'hyperbolic' ? 1.1 : 1.0; 
        const score = (res.error * complexityPenalty); 
        
        // Confidence calculation (0-100) based on R2
        const confidence = Math.max(0, Math.min(100, res.r2 * 100));

        return { ...res, score, confidence };
    });

    // Sort by score (ascending error)
    scoredResults.sort((a, b) => a.score - b.score);

    const bestModel = scoredResults[0];

    return {
        bestModel,
        candidates: scoredResults,
        explanation: `Selected ${bestModel.modelType} model based on lowest error (${bestModel.error.toFixed(2)}) and best fit (R²: ${bestModel.r2.toFixed(3)}).`
    };
};

// 2. Anomaly Detection (Isolation Forest - simplified JS implementation)
// For browser-side, we'll use statistical outlier detection (Z-Score / IQR) 
// as a proxy for robust anomaly detection.
export const detectAnomalies = (data, stream = 'oilRate') => {
    const values = data.map(d => d[stream]).filter(v => v > 0);
    if (values.length < 10) return [];

    // Calculate stats
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);

    const anomalies = [];
    
    // Time-series specific logic: Detect sudden drops/spikes relative to neighbors
    for (let i = 1; i < data.length - 1; i++) {
        const prev = data[i-1][stream];
        const curr = data[i][stream];
        const next = data[i+1][stream];
        const date = data[i].date;

        if (curr === 0) continue; // Zero is usually shut-in, handled separately

        const avgNeighbor = (prev + next) / 2;
        const deviation = Math.abs(curr - avgNeighbor);
        
        // Threshold: 30% sudden change
        if (deviation > (avgNeighbor * 0.3)) {
             anomalies.push({
                 index: i,
                 date,
                 value: curr,
                 type: curr < avgNeighbor ? 'Drop' : 'Spike',
                 severity: deviation > (avgNeighbor * 0.5) ? 'High' : 'Medium',
                 description: `Sudden ${curr < avgNeighbor ? 'production drop' : 'rate spike'} of ${Math.round((deviation/avgNeighbor)*100)}% detected.`
             });
        }
    }
    
    // Detect Global Outliers (Z-Score > 3)
    data.forEach((d, i) => {
        const zScore = (d[stream] - mean) / stdDev;
        if (Math.abs(zScore) > 3) {
            // Check if already caught by local check
            if (!anomalies.find(a => a.index === i)) {
                 anomalies.push({
                     index: i,
                     date: d.date,
                     value: d[stream],
                     type: 'Outlier',
                     severity: 'High',
                     description: `Statistical outlier (Z-Score: ${zScore.toFixed(1)})`
                 });
            }
        }
    });

    return anomalies.sort((a,b) => a.index - b.index);
};

// 3. Well Clustering (K-Means simplified)
export const clusterWells = (wells, k = 3) => {
    // Feature extraction: [avg_rate, max_rate, cum_prod]
    const features = wells.map(w => {
        if (!w.data || w.data.length === 0) return null;
        const rates = w.data.map(d => d.oilRate || 0);
        const avg = rates.reduce((a,b) => a+b, 0) / rates.length;
        const max = Math.max(...rates);
        const cum = w.data[w.data.length-1].cumulativeOil || 0;
        return { id: w.id, name: w.name, vector: [avg, max, cum] };
    }).filter(f => f !== null);

    if (features.length < k) return { clusters: [], error: "Not enough wells with data" };

    // Initialize Centroids (Randomly pick k wells)
    let centroids = features.slice(0, k).map(f => [...f.vector]);
    let clusters = Array(k).fill().map(() => []);
    
    // Simple 1-pass assignment (Mock K-Means for UI demo speed)
    // Real impl would loop until convergence
    features.forEach(f => {
        let minDist = Infinity;
        let clusterIdx = 0;
        
        centroids.forEach((c, idx) => {
            // Euclidean distance (normalized roughly by log to handle scale diffs)
            // Or simple distance if normalized inputs
            // We'll use simple dist on raw values for MVP demonstration logic
            const dist = Math.sqrt(
                Math.pow(c[0]-f.vector[0], 2) + 
                Math.pow(c[1]-f.vector[1], 2) + 
                Math.pow(c[2]-f.vector[2], 2)
            );
            if (dist < minDist) {
                minDist = dist;
                clusterIdx = idx;
            }
        });
        
        if (!clusters[clusterIdx]) clusters[clusterIdx] = []; // Safety
        clusters[clusterIdx].push(f);
    });

    return clusters.map((members, idx) => ({
        id: idx + 1,
        name: `Cluster ${idx + 1}`,
        members,
        stats: {
            count: members.length,
            avgRate: members.reduce((sum, m) => sum + m.vector[0], 0) / members.length
        }
    })).filter(c => c.members.length > 0);
};