# Analysis Results Documentation

Pre-calculated advanced analytics results included in the sample dataset.

## 1. Sensitivity Analysis
- **Objective**: Determine which variable impacts NPV the most.
- **Variables**: Oil Price, Gas Price, CAPEX, OPEX.
- **Result**: Oil Price is the dominant driver ($\pm 30\%$ impact), followed by IP Rate ($\pm 25\%$).

## 2. Anomaly Detection
- **Method**: Moving Average Deviation.
- **Findings**:
  - **PB-006**: Detected "Extended Shut-in" (3 months of zero rate).
  - **PB-001**: Detected "Flush Production" spike in Month 12.
  - **PB-004**: Detected "Data Drop" (single month outlier).

## 3. Clustering Analysis
- **Method**: K-Means Clustering on decline parameters ($q_i, b$).
- **Clusters Identified**:
  1.  **High Rate / Steep Decline**: Bone Spring wells.
  2.  **Moderate Rate / Shallow Decline**: Wolfcamp A wells.
  3.  **Low Rate / Exponential**: Legacy Vertical wells.

## 4. Monte Carlo Simulation
- **Objective**: Probabilistic EUR range.
- **Inputs**: $P_{10}/P_{50}/P_{90}$ distributions for $q_i, b, D_i$.
- **Results**:
  - **P90**: 450 Mbo
  - **P50**: 680 Mbo
  - **P10**: 920 Mbo