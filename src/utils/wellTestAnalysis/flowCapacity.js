export const calculateFlowCapacity = (params, h, fluidViscosity, fluidFVF) => {
    const k = params.k || 0;
    
    // Kh (md-ft)
    const kh = k * h;
    
    // Transmissibility (md-ft/cp)
    const transmissibility = kh / (fluidViscosity || 1);
    
    // Skin Pressure Drop (Delta P_skin)
    // Depends on rate, usually calculated as: 141.2 * q * B * mu * s / (k * h)
    // We return a factor here as rate varies
    const skinFactor = 141.2 * (fluidFVF || 1.2) * (fluidViscosity || 1) * (params.s || 0) / (kh || 1);

    // Productivity Index (PI) estimate (STB/D/psi) assuming semi-steady state
    // PI = q / (Pe - Pwf) ~ k*h / (162.6 * B * mu * (log(re/rw) - 0.75 + s))
    // Assumptions: re=1000 ft, rw=0.25 ft
    const re = params.re || 1000;
    const rw = params.rw || 0.25;
    const denom = 162.6 * (fluidFVF || 1.2) * (fluidViscosity || 1) * (Math.log10(re/rw) - 0.75 + (params.s || 0));
    const pi = kh / (denom || 1);

    // Flow Efficiency (FE)
    // FE = J_actual / J_ideal
    // J_ideal uses s=0
    const denomIdeal = 162.6 * (fluidFVF || 1.2) * (fluidViscosity || 1) * (Math.log10(re/rw) - 0.75);
    const piIdeal = kh / (denomIdeal || 1);
    const fe = pi / piIdeal;

    return {
        kh,
        transmissibility,
        pi,
        piIdeal,
        flowEfficiency: fe,
        damageRatio: 1 / fe
    };
};