# Well Test Analysis (WTA) Module - Phase 1

**Version**: 1.0.0  
**Status**: Initial Framework Implementation

## Overview
This module implements the foundational structure for the Well Test Analysis application within the PetroLord suite. Phase 1 focuses on layout, state management, and core UI components.

## Architecture

### 1. State Management (`WellTestAnalysisContext.jsx`)
*   Uses React Context + Reducer pattern.
*   Centralizes state for Projects, Wells, Tests, and Analysis Parameters.
*   Provides a `log` utility for system-wide event tracking.

### 2. Layout Structure
*   **Top Banner**: Navigation context and breadcrumbs.
*   **Left Sidebar**: Project explorer and file operations.
*   **Center Area**: Dynamic plot visualization controlled by tabs.
*   **Right Sidebar**: Properties inspector for parameters and metadata.
*   **Bottom Panel**: System console/calculation log.

### 3. Key Components
*   `WTATabNavigation`: Switches main views (Data, Diagnostics, Model Match).
*   `CenterPlotArea`: Renders charts using Recharts (currently configured for Time vs Pressure).
*   `CalculationLog`: Real-time feedback console.

## Usage
The module is self-contained. It initializes with mock data for demonstration purposes in Phase 1. 

## Next Steps (Phase 2)
*   Implement Bourdet Derivative calculations.
*   Enable Log-Log plotting with superposition time.
*   Connect to Supabase for project persistence.