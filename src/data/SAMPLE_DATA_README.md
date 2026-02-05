# Permian Basin Analysis Sample Data

This dataset provides a comprehensive, realistic starting point for demonstrating the capabilities of the Decline Curve Analysis (DCA) module within the Petrolord suite.

## Overview
The dataset simulates a portfolio of **10 unconventional wells** located in the **Permian Basin** (West Texas/New Mexico), specifically split between the **Midland Basin** and **Delaware Basin**.

## Included Data

### 1. Wells (`src/data/permianBasinWells.js`)
- **10 Wells**: PB-001 to PB-010
- **Formations**: Wolfcamp A, Wolfcamp B, Bone Spring, Spraberry, Dean, Avalon Shale.
- **Types**: Horizontal (long lateral) and Vertical (legacy).
- **Attributes**: API numbers, operators (e.g., Pioneer, EOG), location coordinates, reservoir properties (pressure, temp), and operational dates.

### 2. Production History (`src/data/permianBasinProductionData.js`)
- generated synthetically using realistic hyperbolic decline parameters with added noise.
- Includes Monthly Oil, Gas, and Water rates.
- Features operational anomalies like shut-ins and workovers for realism.

### 3. Fitted Models (`src/data/permianBasinFittedModels.js`)
- Pre-calculated DCA parameters (qi, b, Di) for each well.
- Includes "goodness of fit" metrics (R², RMSE) and Estimated Ultimate Recovery (EUR).

### 4. Scenarios (`src/data/permianBasinScenarios.js`)
- **Base Case**: Standard economic assumptions ($75 Oil).
- **High Price**: $90 Oil environment.
- **Low Price**: $50 Oil environment (Stress Test).
- **Uplift**: Artificial lift optimization scenario.

### 5. Groups (`src/data/permianBasinGroups.js`)
- **Geographic**: Midland Basin vs. Delaware Basin.
- **Geologic**: Wolfcamp vs. Bone Spring formation groups.

### 6. Type Curves (`src/data/permianBasinTypeCurves.js`)
- Representative curves for Midland Wolfcamp A and Delaware Bone Spring.

## Usage
This data can be loaded directly into the DCA module via the **Project Manager > Samples** tab. The `SampleDataManager` component handles the ingestion of this data into the React Context state (`DeclineCurveContext`), making it immediately available for analysis, forecasting, and visualization testing.