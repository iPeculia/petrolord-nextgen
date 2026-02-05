# Sample Data Reference Guide

Detailed specifications of the entities included in the Material Balance Sample Dataset.

## Reservoirs

| ID | Name | Basin | Formation | Type | Initial Pressure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MB-RES-001** | Midland Wolfcamp A - Tank 1 | Midland | Wolfcamp A | Oil | 4500 psi |
| **MB-RES-002** | Delaware Bone Spring - Tank 2 | Delaware | 2nd Bone Spring | Oil | 5200 psi |
| **MB-RES-003** | CBP San Andres - Tank 3 | Midland | San Andres | Oil | 1800 psi |
| **MB-RES-004** | Delaware Wolfcamp B - Tank 4 | Delaware | Wolfcamp B | Condensate | 6500 psi |
| **MB-RES-005** | Midland Spraberry - Tank 5 | Midland | Spraberry | Oil | 3200 psi |

## Production Data Characteristics
*   **Decline Model**: Modified Arps Hyperbolic.
*   **Noise**: Random Gaussian noise ($\pm 5\%$) added to rates to simulate operational reality.
*   **Duration**: 36 to 60 months, depending on the reservoir "vintage".

## Fluid Properties (PVT)
Generated using **Standing's Correlations**:
*   **Bubble Point ($P_b$)**: Varies by reservoir (800 - 6000 psi).
*   **Oil FVF ($B_o$)**: Increases with pressure up to $P_b$, then decreases slightly due to compressibility.
*   **Viscosity ($\mu_o$)**: Decreases with pressure up to $P_b$, then increases slightly.

## Rock Properties
*   **Model**: Corey-type Relative Permeability.
*   **Endpoints**:
    *   $S_{wi}$ (Irreducible Water Saturation): 0.20 - 0.40
    *   $S_{or}$ (Residual Oil Saturation): 0.25
*   **Exponents**: Water ($n_w=3$), Oil ($n_o=2$).

## Groups
1.  **Midland Basin Assets**: Contains Tanks 1, 3, 5.
2.  **Delaware Basin Assets**: Contains Tanks 2, 4.

## Limitations
*   Temperature is assumed constant (Isothermal).
*   No compositional tracking (Black Oil only).
*   Aquifer influx is currently set to zero (Volumetric depletion) for simplicity in the V1 dataset.