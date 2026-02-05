# Sample Data User Guide

## Getting Started

1.  **Navigate to Module**: Go to `Decline Curve Analysis` from the main dashboard.
2.  **Load Data**:
    - If the project is empty, you will see a "Load Permian Samples" button on the Dashboard tab.
    - Alternatively, go to the **Project Manager** (Folder icon in left sidebar) -> **Samples** tab -> Click **Load Dataset**.
3.  **Confirmation**: A toast notification will confirm "Permian Basin Analysis Project loaded successfully."

## Navigating the Data

### Well Selector
- Located on the left sidebar in "Decline Analysis" tab.
- Filter by name (e.g., "Wolfcamp") to find specific wells.
- Click a well to make it active.

### Tabs & Features

#### 1. Decline Analysis (Base Plots)
- View the monthly production history.
- **Tip**: Toggle between Log and Linear scales on the chart.
- Notice the gaps in data for well `PB-006` (Shut-in).

#### 2. Model Fitting
- See the pre-fitted Arps parameters.
- **Try**: Change the $b$-factor slider to see how the curve fit changes in real-time.

#### 3. Scenarios
- Go to the **Scenarios** tab on the right sidebar.
- Click "High Price Environment" to apply those economic parameters.
- Observe how the "Economic Limit" line on the forecast chart moves.

#### 4. Type Curves
- Switch the main tab to **Type Curves**.
- Select "Midland Wolfcamp A Type Curve".
- See how individual wells (gray lines) compare to the average type curve (bold blue line).

#### 5. Advanced Analytics
- Go to **Adv. Analytics** tab.
- View the **Scenario NPV Sensitivity** chart to compare the financial outcomes of the Base vs. High/Low price cases.

## Resetting Data
To reset the project to its original state:
1.  Go to **Dashboard**.
2.  Click **Clear Data**.
3.  Click **Load Permian Samples** again.