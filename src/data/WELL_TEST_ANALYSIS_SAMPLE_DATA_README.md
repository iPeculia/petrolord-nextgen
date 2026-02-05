# Well Test Analysis Sample Data

This package contains 9 comprehensive sample datasets for testing and training in the Petrolord Well Test Analysis module.

## Available Datasets

| Dataset ID | Type | Description |
| :--- | :--- | :--- |
| `drawdown_basic` | Drawdown | Standard constant rate drawdown in a homogeneous oil reservoir. Ideal for beginners. |
| `buildup_standard` | Buildup | Classic Pressure Buildup (PBU) test following a 48-hour flow period. |
| `multi_rate` | Multi-Rate | Variable rate test demonstrating superposition effects. |
| `injection` | Injection | Water injection falloff test with thermal/mobility effects. |
| `interference` | Interference | Observation well data responding to an active offset producer (500m spacing). |
| `fractured` | Drawdown | Naturally fractured reservoir showing Dual Porosity behavior (Warren-Root model). |
| `bounded` | Drawdown | Small compartment reservoir showing late-time Pseudo-Steady State behavior. |
| `damaged` | Drawdown | Well with high positive skin (+15) demonstrating significant pressure drop. |
| `stimulated` | Drawdown | Acidized/Fractured well with negative skin (-3.5) demonstrating improved PI. |

## How to Use

1. Open the Well Test Analysis module.
2. If the **Welcome Modal** appears, click "Load Sample Data".
3. Alternatively, go to the **Data & Setup** tab and click "Load Sample Data".
4. Select a dataset card and click "Load Data".
5. The system will automatically:
   - Import the pressure/time data.
   - Configure the test parameters (fluid type, porosity, etc.).
   - Navigate you to the analysis workflow.

## Expected Results

Each dataset is generated using analytical solutions with added noise for realism. 
- **Drawdown Basic**: Expect permeability ~15 md and skin ~2.5.
- **Fractured**: Look for the characteristic "dip" in the Bourdet derivative.
- **Interference**: Look for delayed response and calculate inter-well properties.

## Troubleshooting

- **Derivative Noise**: If the derivative curve looks too jagged, go to Settings and increase the **Derivative Smoothing (L)** value to 0.3 or 0.4.
- **Match Quality**: Ensure you identify the correct flow regime (Middle Time Radial Flow) before attempting to match the model.