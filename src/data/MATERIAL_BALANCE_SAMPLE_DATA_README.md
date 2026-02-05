# Material Balance Sample Data

This package provides a comprehensive set of synthetic reservoir data for the Material Balance Analysis module.

## Dataset Contents

### Reservoirs
Five realistic reservoir models representing typical Permian Basin plays:
1.  **Midland Wolfcamp A**: Tight oil reservoir, solution gas drive.
2.  **Delaware Bone Spring**: Mixed drive mechanism (depletion + weak aquifer).
3.  **Central Basin Platform San Andres**: Mature asset, water drive.
4.  **Delaware Wolfcamp B**: Gas condensate reservoir.
5.  **Midland Spraberry**: Legacy vertical production.

### Data Types Generated
-   **Production History**: Monthly oil, gas, and water rates, cumulative production, and days online. Generated using Arps decline logic combined with material balance pressure depletion physics.
-   **PVT Properties**: Pressure-dependent fluid properties (Bo, Rs, Bg, Viscosity) generated using simplified Standing/Vasquez-Beggs correlations.
-   **Reservoir Parameters**: Rock properties (porosity, compressibility, saturation) typical for the respective formations.

## Usage

### Loading Data
1.  Navigate to the **Data & Tank Setup** tab in the Material Balance module.
2.  Locate the **Sample Data Manager** card on the left side.
3.  Click **Load Sample Data**.
4.  The application will populate the Project, Tanks list, and load data for the first tank automatically.

### Switching Reservoirs
Once loaded, you can switch between the 5 reservoirs using the tank selector in the top "Tank Setup" form (if implemented) or by selecting from the list in the sidebar.

## Technical Details
-   **Generator**: `src/utils/materialBalanceDataLoader.js` orchestrates the generation.
-   **Source Files**: 
    -   `src/data/materialBalance/reservoirs.js`
    -   `src/data/materialBalance/production.js`
    -   `src/data/materialBalance/pvt.js`

## Limitations
-   Data is synthetic and simplified.
-   PVT correlations assume constant temperature.
-   Production noise is random and does not reflect specific operational events.