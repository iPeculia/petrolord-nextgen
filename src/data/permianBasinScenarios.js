export const permianBasinScenarios = [
    {
        id: "scn-base",
        name: "Base Case",
        description: "Standard forecast using best-fit hyperbolic decline parameters.",
        parameters: {
            oilPrice: 75,
            gasPrice: 3.50,
            discountRate: 10,
            capex: 0, // Sunk costs for existing wells
        },
        isBaseCase: true
    },
    {
        id: "scn-high-price",
        name: "High Price Environment",
        description: "Optimistic economic scenario with sustained $90 oil.",
        parameters: {
            oilPrice: 90,
            gasPrice: 4.50,
            discountRate: 10,
        },
        isBaseCase: false
    },
    {
        id: "scn-low-price",
        name: "Low Price Environment",
        description: "Stress test scenario with $50 oil prices.",
        parameters: {
            oilPrice: 50,
            gasPrice: 2.50,
            discountRate: 10,
        },
        isBaseCase: false
    },
    {
        id: "scn-uplift",
        name: "Artificial Lift Optimization",
        description: "Assuming 15% production uplift from gas lift optimization across Midland wells.",
        parameters: {
            oilPrice: 75,
            productionModifier: 1.15, // 15% boost
            opexModifier: 1.10 // 10% cost increase
        },
        isBaseCase: false
    }
];