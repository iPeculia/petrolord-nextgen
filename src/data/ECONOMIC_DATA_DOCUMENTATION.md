# Economic Data Documentation

Economic parameters used for NPV and IRR calculations within the sample project.

## Price Decks

### 1. Flat Pricing (Base Case)
- **Oil**: $75.00 / bbl
- **Gas**: $3.50 / mcf
- **Escalation**: 0% / year

### 2. Sensitivity Cases
- **High**: $90.00 Oil / $4.50 Gas
- **Low**: $50.00 Oil / $2.50 Gas

## Operating Costs (OPEX)
- **Fixed Cost**: $2,500 / month / well (Overhead, Insurance, Labor)
- **Variable Oil**: $4.00 / bbl (Chemicals, Treating)
- **Variable Gas**: $0.25 / mcf (Compression)
- **Water Disposal**: $1.00 / bbl (SWD Fees)
- **Severance Tax**: 4.6% (Texas Standard)
- **Ad Valorem**: 2.5%

## Capital Costs (CAPEX)
- **Drill & Complete (D&C)**: $7,500,000 (assumed sunk for existing PDP wells)
- **Workovers**: $150,000 (applied in "Workover" scenario only)
- **Facilities**: $500,000 (allocated per well)

## Financial Parameters
- **Discount Rate**: 10% (PV10 Standard)
- **Royalty Burden**: 20% (1/5th)
- **Working Interest**: 100% (for simplicity)
- **Net Revenue Interest (NRI)**: 80%

## Calculation Method
Cash Flow = (Revenue - Royalties - Taxes - OPEX - CAPEX)
Discounted CF = Cash Flow / $(1 + rate)^{year}$