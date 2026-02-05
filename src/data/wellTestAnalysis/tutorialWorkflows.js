export const TUTORIAL_STEPS = [
    {
        id: 'import',
        title: '1. Importing Data',
        steps: [
            "Click 'Data & Setup' tab.",
            "Click 'Upload Test Data' or select a sample dataset.",
            "Map your CSV columns (Time, Pressure, Rate) to the system fields.",
            "Review the Data Quality Summary for missing values or outliers.",
            "Click 'Finish Setup' to standardize the data."
        ]
    },
    {
        id: 'diagnostics',
        title: '2. Diagnostic Analysis',
        steps: [
            "Navigate to the 'Diagnostics' tab.",
            "Observe the Log-Log plot. The green triangles represent the Bourdet Derivative.",
            "Identify the 'Unit Slope' line at early time (indicates Wellbore Storage).",
            "Identify the 'Horizontal Stabilization' at middle time (indicates Radial Flow).",
            "Use the L-smoothing slider in settings if the derivative is too noisy."
        ]
    },
    {
        id: 'matching',
        title: '3. Model Matching',
        steps: [
            "Switch to the 'Model Match' tab.",
            "Select 'Infinite Acting Radial Flow' as your initial model.",
            "Use the sliders to adjust Permeability (k) until the horizontal line matches the derivative plateau.",
            "Adjust Wellbore Storage (C) to match the early time unit slope.",
            "Adjust Skin (s) to match the separation between pressure and derivative curves.",
            "Click 'Auto Match' to refine the parameters."
        ]
    },
    {
        id: 'forecasting',
        title: '4. Forecasting',
        steps: [
            "Go to the 'Forecast' tab.",
            "View the generated production profile based on your matched parameters.",
            "Compare the 'Current' vs 'Stimulated' (zero skin) scenarios to evaluate stimulation potential.",
            "Check the IPR plot to determine Absolute Open Flow (AOF)."
        ]
    }
];