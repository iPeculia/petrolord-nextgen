# PUNQ-S3 Reservoir Model Documentation

**Model Name:** PUNQ-S3 (Proxy)
**Grid Dimensions:** 19 x 28 x 5 (2,660 cells total, ~1,761 active)
**Type:** Synthetic Reservoir Engineering Standard

## Overview
The PUNQ-S3 model is a standard test case used in reservoir engineering for history matching and uncertainty quantification. This implementation is a high-fidelity proxy generated procedurally to match the key geological characteristics of the original dataset.

## Geological Features
1.  **Anticline Structure:** The reservoir is defined by a dome-shaped anticline structure with depth increasing away from the center (Inline 9, Crossline 14).
2.  **Irregular Boundary:** The grid features non-rectangular boundaries (corner point geometry simulation), creating active and inactive cells.
3.  **Facies Distribution:**
    *   **Sand (Layers 1-3):** High quality reservoir rock with good porosity (20-30%) and permeability (100-2000 mD).
    *   **Shaly Sand (Layers 4-5):** Lower quality rock with reduced properties and higher irreducible water saturation.

## Fluid Contacts & Initialization
*   **Gas-Oil Contact (GOC):** 2360 m TVD
*   **Oil-Water Contact (OWC):** 2420 m TVD
*   **Fluid Zones:**
    *   **Gas Cap:** Top structure (Layers 1-2 in crest)
    *   **Oil Rim:** Middle structure (Layers 2-4)
    *   **Aquifer:** Bottom/Flanks (Layer 5)

## Simulation Scenario
The model simulates a 15-year production history:
*   **Depletion:** Reservoir pressure declines from initial ~300 bar down to ~150-200 bar.
*   **Aquifer Drive:** Strong bottom water drive pushes the OWC upwards over time.
*   **Gas Cap Expansion:** As pressure drops, the gas cap expands downwards, displacing oil.

## Visualization Features
*   **Geological Section View:** Toggle between Inline (I-direction) and Crossline (J-direction) slicing.
*   **Property Mapping:** Visualize Water Saturation (Sw), Oil Saturation (So), Gas Saturation (Sg), Pressure, and Lithology (Facies).
*   **Well Integration:** 6 wells (5 Producers, 1 Injector) projected onto sections.