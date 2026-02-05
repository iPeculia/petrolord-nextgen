# Well Test Analysis - User Guide

## Introduction
The Petrolord Well Test Analysis module is a professional-grade tool for interpreting pressure transient data. It supports Buildup, Drawdown, and Interference testing workflows.

## Quick Start

1.  **Launch**: Navigate to the **Reservoir Engineering Hub** and click "Launch Tool" on the Well Test Analysis card.
2.  **Import**: Go to the **Data Setup** tab. Upload your CSV/LAS file containing `Time`, `Pressure`, and `Rate` columns.
3.  **Map Columns**: Select the appropriate columns from your file.
4.  **Diagnostics**: Switch to the **Diagnostics** tab. Observe the Log-Log plot.
    *   Adjust the `Smoothing Window` (L) if the derivative is noisy.
    *   Identify the **Radial Flow** regime (horizontal derivative).
5.  **Match**: Go to the **Model Match** tab.
    *   Use the sliders to fit the Type Curve to your data.
    *   Click **Auto Match** to refine the parameters (`k`, `s`, `C`).
6.  **Forecast**: (Optional) Use the **Forecast** tab to predict future performance based on your matched parameters.
7.  **Export**: Click the Export icon in the top right to download a PDF summary.

## Key Features

*   **Bourdet Derivative**: Automatic calculation with adjustable smoothing.
*   **Type Curve Matching**: Interactive manual matching + Levenberg-Marquardt automated optimization.
*   **Flow Regimes**: Automatic detection of Wellbore Storage and Radial Flow.
*   **Unit Support**: Switch between Field (psi, bbl) and SI (kPa, m³) units in Settings.

## Troubleshooting

**Problem**: The derivative curve is going crazy/noisy.  
**Solution**: Your data likely has gauge noise. Increase the smoothing parameter `L` in the plot settings (try 0.2 or 0.3).

**Problem**: I can't match the early time data.  
**Solution**: Check your wellbore storage coefficient (C). If the unit slope is not aligning, your `C` value is incorrect.

For more details, press `?` inside the application to open the Help Center.