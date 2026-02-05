# Permian Basin Analysis Sample Data Overview

## Project Description
The **Permian Basin Analysis** project is a comprehensive sample dataset designed to demonstrate the full capabilities of the Petrolord NextGen Decline Curve Analysis (DCA) module. It simulates a realistic portfolio of unconventional assets located in the prolific Midland and Delaware basins of West Texas and New Mexico.

This dataset provides a robust foundation for testing, training, and demonstrating advanced workflows, including multi-well forecasting, economic scenario analysis, type curve generation, and machine learning-driven insights.

## Sample Data Contents

### Asset Portfolio
- **Total Wells**: 10
- **Basins**: Midland Basin (5 wells), Delaware Basin (5 wells)
- **Formations**: Wolfcamp A, Wolfcamp B, Bone Spring, Spraberry, Dean, Avalon Shale
- **Well Types**: Horizontal (Long Lateral) and Vertical (Legacy)

### Production History
- **Data Points**: Monthly production volumes (Oil, Gas, Water)
- **History Length**: 36 to 60 months per well
- **Characteristics**: 
  - Realistic initial rates (IP) typical for the region (e.g., 800-1500 bbl/d for oil)
  - Natural decline patterns (Hyperbolic behavior)
  - Operational noise and anomalies (e.g., shut-ins, workovers, seasonal variance)

### Analysis Models
- **Decline Models**: Hyperbolic (primary), Exponential (late-life), Harmonic (theoretical limit)
- **Parameters**: 
  - Initial Rate ($q_i$)
  - Initial Decline ($D_i$)
  - Hyperbolic Exponent ($b$-factor)
  - Fit Quality Metrics ($R^2$, RMSE)

### Forecasts
- **Duration**: 10 to 30 year projections
- **Products**: Oil, Gas, Water, and Barrel of Oil Equivalent (BOE)
- **Limiters**: Economic Limit (minimum rate) and Maximum Duration

### Scenarios
1.  **Base Case**: Standard economic assumptions ($75/bbl Oil)
2.  **High Price**: Optimistic outlook ($90/bbl Oil)
3.  **Low Price**: Stress test ($50/bbl Oil)
4.  **Uplift**: Artificial lift optimization impact (+15% production)

### Well Groups
- **Geographic**: Midland Basin vs. Delaware Basin
- **Geologic**: Wolfcamp vs. Bone Spring vs. Spraberry
- **Performance**: High Tier vs. Mid Tier producers

### Type Curves
- **Midland Wolfcamp A**: Representative regional decline profile
- **Delaware Bone Spring**: Representative regional decline profile

### Economic Parameters
- **Pricing**: Realistic NYMEX strip pricing scenarios
- **Costs**: 
  - LOE: $6-10/boe
  - Water Disposal: $0.50-$1.50/bbl
  - Taxes: Severance and Ad Valorem taxes included

### Advanced Analytics
- **Sensitivity**: NPV sensitivity to price and capital variables
- **Anomalies**: Automatically flagged downtime events
- **Clustering**: Wells grouped by decline characteristics