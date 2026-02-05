# Fitted Models Documentation

Each well in the sample dataset comes with a pre-calculated decline curve analysis model.

## Model Types
1.  **Hyperbolic**: The primary model for unconventional wells.
    - Used for the transient flow and early boundary-dominated flow periods.
    - Characterized by $b > 0$.
2.  **Exponential**: Used for late-life vertical wells or terminal decline segments.
    - Characterized by $b = 0$.

## Model Parameters
- **$q_i$ (Initial Rate)**: The theoretical rate at $t=0$ for the fitted segment.
- **$D_i$ (Nominal Decline)**: The initial annualized decline rate.
- **$b$ (Hyperbolic Exponent)**: Controls the curvature of the decline.
  - *Sample Range*: 0.8 to 1.4 for horizontal shale wells.

## Fit Quality Metrics
- **$R^2$**: Coefficient of determination.
  - *Target*: $>0.90$ for valid fits.
- **RMSE**: Root Mean Square Error.
  - Used to quantify the deviation of the model from actual history.

## Confidence Levels
- **High**: Robust fit with extensive history (>24 months) and stable trend.
- **Medium**: Good fit but potential ambiguity in $b$-factor due to noise.
- **Low**: Short history (<12 months) or highly volatile production.

## Assumptions
- Models assume constant operating conditions (choke size, lift type).
- Terminal decline switches to Exponential ($D_{min} = 6-8\%$) when the hyperbolic tangent decline rate drops below this threshold (Arps Modified Hyperbolic).