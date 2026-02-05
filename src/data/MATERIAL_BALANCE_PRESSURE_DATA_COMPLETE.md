# Material Balance Pressure Analysis Features

**Module**: Material Balance  
**Status**: Integrated & Functional  
**Version**: 2.1.0

## Overview
The Pressure Analysis suite provides a dedicated environment for evaluating reservoir pressure health, validating drive mechanisms, and forecasting pressure depletion. It integrates historical gauge data with PVT correlations and production data.

## New Components
### 1. Pressure Analysis Tab (`PressureAnalysisTab.jsx`)
The central hub for pressure workflows. 
*   **Key Features**:
    *   Unified view of Pressure vs Time, Saturation evolution, and PVT properties.
    *   Contextual help integration for new users.
    *   Responsive layout adapting to screen size.

### 2. Pressure Statistics (`PressureStatistics.jsx`)
A KPI dashboard widget displaying:
*   Current Average Reservoir Pressure
*   Total Pressure Drawdown (%)
*   Proximity to Bubble Point (critical for gas breakout management)
*   Decline Rate trends (psi/month)

### 3. Anomaly Detection (`PressureAnomalies.jsx`)
Automated scanning of pressure history to identify:
*   Rapid drawdown events (>100 psi drops).
*   Unexpected build-ups (indicating shut-ins or injection response).
*   Data quality issues.

### 4. Maintenance & Support (`PressureMaintenanceInfo.jsx`)
Tracks secondary recovery efforts:
*   Voidage Replacement Ratio (VRR) calculation.
*   Target pressure vs current status.
*   Active drive mechanism indicators (Water Drive, Gas Cap, etc.).

## Data Sources
*   **History**: Loaded from `src/data/materialBalance/pressureHistory.js`.
*   **PVT**: Correlated in real-time via `src/data/materialBalance/pressureDependentProperties.js`.
*   **Saturation**: Material balance iterated results from `src/data/materialBalance/pressureSaturationData.js`.

## Usage Guide
1.  **Navigate**: Select the "Pressure" tab in the main Material Balance navigation bar.
2.  **Analyze**: Review the top KPI cards for immediate health checks.
3.  **Visualize**: Use the main combo-chart to correlate pressure drops with cumulative production (the "P vs Cum" relationship).
4.  **Diagnose**: Switch between "Saturation" and "PVT" sub-tabs to understand fluid behavior changes at current pressure levels.