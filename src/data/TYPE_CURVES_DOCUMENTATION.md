# Type Curves Documentation

Type curves represent the average performance of a group of wells, used for benchmarking and forecasting new drills (PUDs).

## 1. Midland Wolfcamp A Type Curve
- **Basin**: Midland
- **Target**: Wolfcamp A
- **Methodology**: Normalized Time (Peak Month = Month 1), P50 Probabilistic Average.
- **Parameters**:
  - $q_i$: 1,100 bbl/d
  - $D_i$: 65% (nominal)
  - $b$: 1.2
- **EUR**: 750 Mbo
- **Well Count**: 5 Analog Wells

## 2. Delaware Bone Spring Type Curve
- **Basin**: Delaware
- **Target**: 2nd Bone Spring Sand
- **Methodology**: Normalized Time, P50 Average.
- **Parameters**:
  - $q_i$: 950 bbl/d
  - $D_i$: 70% (nominal)
  - $b$: 1.0
- **EUR**: 620 Mbo
- **Well Count**: 3 Analog Wells

## Usage
- **Normalization**: Wells are time-shifted so their peak rates align at Month 1.
- **Matching**: Users can overlay individual well production on top of these curves to identify under/over-performers.
- **Scaling**: Type curves can be scaled (e.g., "Type Curve x 1.2") to create P10 or P90 outcome estimates.