# Production Data Documentation

This document outlines the characteristics and generation methodology for the production history included in the sample dataset.

## Data Characteristics
- **Frequency**: Monthly
- **Streams**: 
  - Oil Rate (bbl/day)
  - Gas Rate (mcf/day)
  - Water Rate (bbl/day)
- **Calculated Columns**:
  - Cumulative Oil (bbl)
  - Cumulative Gas (mcf)
  - Cumulative Water (bbl)
  - Days On Production

## Generation Methodology
The production data is synthetically generated to mimic real-world Permian unconventional behavior while remaining clean enough for clear demonstration.

1.  **Base Decline**: A modified Hyperbolic decline equation is used as the backbone.
    - $q(t) = \frac{q_i}{(1 + b D_i t)^{1/b}}$
2.  **Noise Injection**: Random Gaussian noise ($\pm 5\%$) is added to simulate gauge error and minor operational fluctuations.
3.  **Event Simulation**:
    - **Shut-ins**: Random months where production drops to 0 or near-zero to simulate maintenance or offset frac hits.
    - **Flush Production**: Temporary rate spikes following shut-ins.
    - **Artificial Lift**: Step-changes in decline profile simulating gas lift or ESP installation.

## Typical Ranges (Sample Data)
- **Peak Oil Rate**: 800 - 1,500 bbl/d
- **Peak Gas Rate**: 1,000 - 5,000 mcf/d
- **Water Cut**: Variable, typically increasing over time.
- **GOR**: Increasing over time as reservoir pressure depletes below bubble point.

## Data Quality
- **Completeness**: 100% (No missing months for active periods).
- **Consistency**: Cumulatives strictly increasing.
- **Anomalies**: Intentionally included for "Anomaly Detection" feature demonstration.