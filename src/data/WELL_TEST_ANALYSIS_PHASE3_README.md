# Well Test Analysis (WTA) Module - Phase 3

**Version**: 1.2.0  
**Status**: Derivatives & Diagnostics Implemented

## Phase 3 Overview
Phase 3 introduces the core mathematical engine for Pressure Transient Analysis (PTA). This includes the Bourdet derivative calculation, logarithmic flow regime detection, and specialized diagnostic plots.

## New Features

### 1. Mathematical Engine
*   **Bourdet Derivative**: `bourdetDerivative.js` implements the L-spline algorithm to calculate pressure derivatives on a logarithmic scale. This is the industry standard for identifying flow regimes.
*   **Superposition**: `superpositionCalculator.js` adds Horner time and linear superposition functions to handle variable rate histories (foundation laid, basic Horner implemented).
*   **Flow Regime Detection**: `flowRegimeDetector.js` analyzes the slope of the derivative curve to automatically identify:
    *   Wellbore Storage (Slope ~1)
    *   Radial Flow (Slope ~0)
    *   Linear Flow (Slope ~0.5)
    *   Boundaries

### 2. Diagnostic Visualization
*   **Log-Log Plot**: A dual-axis scatter plot showing Delta Pressure and Derivative vs Time. Essential for model identification.
*   **Semi-Log Plot**: Standard Horner or MDH plot for straight-line analysis of permeability and skin.
*   **Pattern Assistant**: A UI component that interprets the detected regimes and offers hints to the engineer (e.g., "Radial flow detected -> K can be estimated").

### 3. Architecture Updates
*   **Context**: `WellTestAnalysisContext` now stores computed `diagnosticData` and `flowRegimes`.
*   **Trigger**: A `RUN_DIAGNOSTICS` action processes raw data into diagnostic curves automatically after setup.

## Usage Guide
1.  **Import Data**: Use the Data & Setup tab (from Phase 2).
2.  **Run Setup**: Configure test parameters (Porosity, h, etc.) and click "Finish Setup".
3.  **View Diagnostics**: The app automatically switches to the **Diagnostics** tab.
4.  **Analyze**:
    *   Use the **Log-Log** tab to identify the reservoir model.
    *   Look for the horizontal stabilization in the derivative (green curve) - this is your Infinite Acting Radial Flow.
    *   Use the **Semi-Log** tab to verify the straight line in the radial flow region.
    *   Check the **Pattern Assistant** on the right for automated insights.

## Next Steps (Phase 4)
*   **Model Matching**: Implement non-linear regression to fit the analytical models (defined in `modelLibrary.js`) to the observed data.
*   **Type Curves**: Overlay standard type curves for visual matching.
*   **Results**: Calculate final k, s, and p* values.