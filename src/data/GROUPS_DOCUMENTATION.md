# Well Groups Documentation

Grouping logic used in the sample dataset to demonstrate aggregation and portfolio analysis.

## Geographic Groups
1.  **Midland Basin Assets**
    - **Wells**: PB-001, PB-003, PB-005, PB-007, PB-009
    - **Characteristics**: Higher oil cut, lower GOR.
2.  **Delaware Basin Assets**
    - **Wells**: PB-002, PB-004, PB-006, PB-008, PB-010
    - **Characteristics**: Deeper targets, higher pressure, higher GOR.

## Geological Groups
1.  **Wolfcamp Formation**
    - **Wells**: PB-001, PB-004, PB-007, PB-010
    - **Stats**: Largest group by count and reserve volume.
2.  **Bone Spring Formation**
    - **Wells**: PB-002, PB-008
    - **Stats**: High initial rates, steep decline.
3.  **Spraberry/Dean**
    - **Wells**: PB-003, PB-005, PB-009
    - **Stats**: Legacy production, lower decline rates.

## Vintage Groups
- **Vintage 2019-2020**: PB-001, PB-002, PB-006
- **Vintage 2021-2022**: PB-004, PB-007, PB-008
- **Vintage 2023+**: PB-010
- **Legacy**: PB-003, PB-005, PB-009

## Usage
Groups allow for:
- Aggregate Production Plots (Field Level)
- Multi-well Forecasting
- Type Curve Generation (Normalizing by group)