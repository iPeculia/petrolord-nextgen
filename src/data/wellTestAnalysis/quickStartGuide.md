# Well Test Analysis - Quick Start Guide

## 1. Load Data
Start by navigating to the **Data & Setup** tab. You can either:
- Drag and drop a CSV file containing `Time` and `Pressure` columns.
- Or click **Load Sample Data** to practice with a pre-configured dataset (recommended for first-time users).

## 2. Verify Setup
Ensure the **Test Type** (Drawdown/Buildup) and **Fluid Type** are correct. The system will automatically validate your data quality. Look for the green checkmark in the Quality Summary.

## 3. Diagnose Flow Regimes
Switch to the **Diagnostics** tab. 
- **Early Time**: Look for a unit slope (45-degree line) indicating wellbore storage.
- **Middle Time**: Look for a flat derivative plateau indicating radial flow. This is crucial for permeability estimation.

## 4. Match Model
In the **Model Match** tab:
1. Adjust **Permeability (k)** to match the derivative plateau height.
2. Adjust **Storage (C)** to match the early time hump.
3. Adjust **Skin (s)** to match the pressure curve separation.
4. Click **Auto Match** for fine-tuning.

## 5. Export Results
Once satisfied, go to the **Export** tab to download a PDF report or JSON summary of your analysis, including calculated Flow Capacity (kh) and Skin.