import { calculateF, calculateEo, calculateEg, calculateEfw, calculatePoverZ } from './MaterialBalanceEngine';
import { linearRegression } from './RegressionAnalysis';

export const generateDiagnosticData = (productionData, pressureData, pvtData, tankParams) => {
    const results = {
        plots: {},
        stats: {}
    };

    if (!productionData || !pressureData || productionData.length === 0 || pressureData.length === 0) {
        return results;
    }

    const { reservoirType, initialPressure } = tankParams;

    // Merge Data: Interpolate production to pressure dates
    // Assuming pressure dates are the key survey points
    const diagnosticPoints = pressureData.map(pPoint => {
        // Find matching or closest production record
        // In a real app, we might interpolate Np/Gp between dates
        // Here we take the closest record on or before
        const pDate = new Date(pPoint.date);
        
        // Sort production by date just in case
        const sortedProd = [...productionData].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        let prodPoint = sortedProd[0];
        for (let i = 0; i < sortedProd.length; i++) {
            if (new Date(sortedProd[i].date) <= pDate) {
                prodPoint = sortedProd[i];
            } else {
                break;
            }
        }

        if (!prodPoint) return null;

        return {
            date: pPoint.date,
            pressure: parseFloat(pPoint.pressure),
            Np: parseFloat(prodPoint.Np || prodPoint.oilProd || 0),
            Gp: parseFloat(prodPoint.Gp || prodPoint.gasProd || 0),
            Wp: parseFloat(prodPoint.Wp || prodPoint.waterProd || 0)
        };
    }).filter(p => p !== null);

    if (reservoirType === 'gas') {
        // P/Z Plot Data
        const pzData = [];
        diagnosticPoints.forEach(pt => {
            const pz = calculatePoverZ(pt.pressure, pvtData.gas || []);
            if (pz !== null) {
                pzData.push({ x: pt.Gp, y: pz, date: pt.date, pressure: pt.pressure });
            }
        });
        
        results.plots['P_over_Z'] = pzData;
        
        // Regression
        const xVal = pzData.map(d => d.x);
        const yVal = pzData.map(d => d.y);
        results.stats['P_over_Z'] = linearRegression(xVal, yVal);
        
    } else {
        // Oil Diagnostics
        const f_vs_eo_data = [];
        const f_vs_eo_eg_data = [];
        const havlena_data = [];
        const f_vs_efw_data = [];
        
        // We need Boi for some terms
        // In a real scenario, we'd fetch Boi from PVT at Pi
        const Boi = 1.2; // Fallback or fetched
        
        // Default Params for Efw if missing
        const efwParams = { 
            ...tankParams, 
            Boi: Boi, 
            m: tankParams.m || 0, 
            cw: tankParams.cw || 3e-6, 
            cf: tankParams.cf || 4e-6,
            swi: tankParams.swi || 0.2
        };

        diagnosticPoints.forEach(pt => {
            const F = calculateF(pt, pvtData.oil, pvtData.gas, pvtData.water);
            const Eo = calculateEo(pt.pressure, initialPressure, pvtData.oil, pvtData.gas);
            const Eg = calculateEg(pt.pressure, initialPressure, pvtData.gas);
            const Efw = calculateEfw(pt.pressure, initialPressure, efwParams);
            
            if (F !== null && Eo !== null) {
                // 1. Solution Gas: F vs Eo
                f_vs_eo_data.push({ x: Eo, y: F, date: pt.date });
                
                // 2. Gas Cap: F vs (Eo + Eg) -- simplified assumption for plotting
                // Ideally F vs (Eo + m*Eg*Factor)
                if (Eg !== null) {
                    f_vs_eo_eg_data.push({ x: Eo + Eg, y: F, date: pt.date });
                    
                    // 3. Havlena-Odeh: F/Eo vs Eg/Eo
                    if (Math.abs(Eo) > 0.0001) {
                        havlena_data.push({ x: Eg/Eo, y: F/Eo, date: pt.date });
                    }
                }
                
                // 4. Water Drive: F vs Efw
                f_vs_efw_data.push({ x: Efw, y: F, date: pt.date });
            }
        });

        results.plots['F_vs_Eo'] = f_vs_eo_data;
        results.plots['F_vs_Total_Expansion'] = f_vs_eo_eg_data;
        results.plots['Havlena_Odeh'] = havlena_data;
        results.plots['F_vs_Efw'] = f_vs_efw_data;
        
        // Stats
        results.stats['F_vs_Eo'] = linearRegression(f_vs_eo_data.map(d=>d.x), f_vs_eo_data.map(d=>d.y));
        results.stats['F_vs_Total_Expansion'] = linearRegression(f_vs_eo_eg_data.map(d=>d.x), f_vs_eo_eg_data.map(d=>d.y));
        results.stats['Havlena_Odeh'] = linearRegression(havlena_data.map(d=>d.x), havlena_data.map(d=>d.y));
        results.stats['F_vs_Efw'] = linearRegression(f_vs_efw_data.map(d=>d.x), f_vs_efw_data.map(d=>d.y));
    }

    return results;
};