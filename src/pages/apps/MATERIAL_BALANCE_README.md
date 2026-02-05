# Material Balance Analysis (PetroLord NextGen Suite)

## Project Overview

The Material Balance Analysis module is a core application within the PetroLord NextGen Suite, designed for advanced reservoir engineering studies. It provides tools for probabilistic reserves estimation, production forecasting, and reservoir characterization using the material balance equation. This module integrates data loading, diagnostic plotting, model fitting, and scenario analysis within a modern, user-friendly interface.

## Architecture Description

The Material Balance Analysis module is built with a clear separation of concerns, following React best practices for state management, component reusability, and data handling.

*   **Technology Stack**:
    *   **Frontend**: React 18.2.0 (Vite for build), TailwindCSS 3.3.2, Shadcn/ui, Framer Motion 10.16.4, Lucide React 0.292.0.
    *   **State Management**: React Context API with `useReducer` for complex state logic (`MaterialBalanceContext`).
    *   **Routing**: React Router 6.16.0.

*   **Key Architectural Components**:
    1.  **`src/contexts/MaterialBalanceContext.jsx`**: Centralized state management for the entire Material Balance application. It holds all data related to projects, tanks, production, pressure, PVT, diagnostic results, models, and scenarios. It uses a `useReducer` hook to manage state transitions through defined actions.
    2.  **`src/hooks/useMaterialBalance.js`**: A custom React hook that provides a clean API to interact with the `MaterialBalanceContext`. It abstracts away dispatching actions and includes helper functions for common operations like creating projects/tanks and loading data, enforcing validation and adding log messages.
    3.  **`src/pages/apps/MaterialBalancePro.jsx`**: The main entry point for the Material Balance application. It orchestrates the layout, manages tab navigation, and integrates all sub-components, wrapping them with the `MaterialBalanceProvider`.
    4.  **Layout Components (`src/components/materialBalance/`)**:
        *   `MBHeader.jsx`: Handles application title, breadcrumbs, and global project actions (New, Open, Save, Export).
        *   `MBTabNavigation.jsx`: Manages the five primary navigation tabs for different analysis phases.
        *   `MBLeftSidebar.jsx`: Provides project and tank selection/creation, and a quick view of loaded data.
        *   `MBRightSidebar.jsx`: Displays detailed parameters for the currently selected reservoir tank.
        *   `MBBottomPanel.jsx`: Shows a real-time log of calculations and messages.
    5.  **Tab Components (`src/components/materialBalance/tabs/`)**: Placeholder components (`DataTankSetupTab.jsx`, `DiagnosticsTab.jsx`, `ModelFittingTab.jsx`, `ForecastScenariosTab.jsx`, `ExportLinksTab.jsx`) that represent the content for each navigation tab. These will be expanded in future development phases.
    6.  **Utility Modules (`src/utils/materialBalance/`)**: Stubbed functions for common tasks like `CSVParser.js`, `UnitConverter.js`, `MBHelpers.js` (for MB equation calculations), and `DataValidator.js`.
    7.  **Data Module (`src/data/materialBalance/`)**: `sampleData.js` provides mock data for initial development and testing.

## Routes Documentation

The Material Balance Analysis module utilizes the following routes:

*   `/material-balance`: The main entry point for the Material Balance Pro application. Displays the default "Data & Tank Setup" tab.
*   `/material-balance/:projectId`: (Future) A route to directly load a specific project by its ID, allowing for deep linking or resuming previous work.
*   `/material-balance/new`: (Future) A route that could potentially open the application with a pre-filled "new project" state or a wizard for new project creation.

These routes are configured in `src/App.jsx` with lazy loading for optimal performance.

## Phase Descriptions

### Phase 1: Project Setup, Architecture & Layout (Current Phase)

*   **Goal**: Establish the foundational structure, state management, routing, and UI layout for the Material Balance Analysis application.
*   **Key Deliverables**:
    *   Material Balance Context (`MaterialBalanceContext.jsx`) and custom hook (`useMaterialBalance.js`).
    *   Main application page (`MaterialBalancePro.jsx`) with a responsive, 4-section layout.
    *   All core UI components (Header, Tab Navigation, Left/Right Sidebars, Bottom Panel).
    *   Placeholder/stub components for all main tabs and utility functions.
    *   Initial styling with PetroLord theme (Slate 950, Lime Green #CCFF00).
    *   Integration into the main application's routing.
    *   Sample data for initial population.
    *   Basic tests for context and main page rendering.

### Future Phases (Outline)

*   **Phase 2: Data Import & Pre-processing**: Implement CSV import for production, pressure, and PVT data. Introduce data cleaning, validation, and unit conversion.
*   **Phase 3: Diagnostic Analysis**: Develop interactive diagnostic plots (F vs. Eo, Eg, Efw, p/z) and tools for identifying reservoir drive mechanisms.
*   **Phase 4: Model Fitting & History Matching**: Implement various material balance models (volumetric, aquifer, gas cap) and algorithms for fitting historical data, including regression analysis and error metrics.
*   **Phase 5: Forecast & Scenario Planning**: Enable production forecasting based on fitted models, create and compare multiple scenarios (e.g., P10, P50, P90).
*   **Phase 6: Reporting & Export**: Develop comprehensive reporting features, including customizable PDF reports, data export, and integration with other PetroLord modules.

## Usage Guide

1.  **Navigate to Reservoir Engineering Hub**: From the Dashboard, click on "Reservoir Engineering".
2.  **Launch Material Balance Analysis**: Click on the "Material Balance Analysis" card.
3.  **Create/Load Project**: In the left sidebar, use the "New Project" button to start a new analysis or select an existing project from the dropdown.
4.  **Add/Select Tank**: Within an active project, create new reservoir tanks or select existing ones.
5.  **Navigate Tabs**: Use the tab navigation bar to switch between different stages of the analysis (Data & Tank Setup, Diagnostics, etc.).
6.  **Monitor Log**: The bottom panel displays a real-time log of all calculations and messages.

## Development Notes

*   **Stubs**: Many functions and components in this phase are stubs. Their full implementation will occur in subsequent phases.
*   **Error Handling**: Basic error handling is in place within the context and hook, logging messages to the `calculationLog` and `toast` notifications. This will be expanded.
*   **Styling**: Adheres to PetroLord theme using Tailwind CSS. Components are designed to be responsive.
*   **Testing**: Initial tests cover context creation, reducer actions, and basic UI rendering and interaction. More comprehensive tests will be added as functionality matures.
*   **Collaboration**: The project is set up for collaborative development, with clear module separation.