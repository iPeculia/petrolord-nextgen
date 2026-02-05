import React from 'react';

const terms = [
    { term: "Permeability (k)", def: "A measure of the ability of a porous material (reservoir rock) to allow fluids to pass through it. Standard unit: millidarcy (md)." },
    { term: "Skin Factor (s)", def: "A dimensionless factor representing the extra pressure drop near the wellbore due to damage (positive s) or stimulation (negative s)." },
    { term: "Wellbore Storage (C)", def: "A phenomenon where fluid flow from the reservoir is delayed from reaching the surface due to compression/expansion of fluid in the wellbore. Unit: bbl/psi." },
    { term: "Bourdet Derivative", def: "The logarithmic derivative of pressure with respect to time, used to identify flow regimes. Plotted as 'dp/dln(t)' on log-log plots." },
    { term: "Productivity Index (PI)", def: "A measure of the well's potential to produce, defined as the flow rate per unit pressure drop (STB/D/psi)." },
    { term: "Horner Time", def: "A superposition time function used for analyzing pressure buildup tests, defined as (tp + dt) / dt." },
    { term: "Flow Efficiency", def: "The ratio of the actual productivity index to the ideal productivity index (zero skin)." },
    { term: "Radius of Investigation", def: "The approximate distance from the wellbore that the pressure transient has traveled at a given time." },
    { term: "Dual Porosity", def: "A reservoir model characterizing naturally fractured reservoirs with two distinct porosity systems: matrix (high storage, low flow) and fractures (low storage, high flow)." }
];

const Glossary = ({ filter }) => {
    const filteredTerms = terms.filter(item => 
        item.term.toLowerCase().includes(filter.toLowerCase()) || 
        item.def.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Technical Glossary</h3>
            <div className="grid gap-4">
                {filteredTerms.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                        <h4 className="text-blue-400 font-medium mb-1">{item.term}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.def}</p>
                    </div>
                ))}
                {filteredTerms.length === 0 && (
                    <div className="text-slate-500 text-center py-8">No terms match your search.</div>
                )}
            </div>
        </div>
    );
};

export default Glossary;