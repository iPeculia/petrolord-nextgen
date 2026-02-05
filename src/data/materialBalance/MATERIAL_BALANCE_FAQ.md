# Frequently Asked Questions (FAQ)

## General

**Q: Is this real field data?**  
A: No. The data is synthetically generated based on realistic parameters for Permian Basin unconventional reservoirs (Wolfcamp, Bone Spring, Spraberry). It mimics real trends but does not represent specific proprietary assets.

**Q: Can I use this for actual reserves booking?**  
A: No. This data is for demonstration, training, and testing purposes only.

**Q: Is the data saved to the database?**  
A: By default, the sample data loads into your browser's local memory (`localStorage`). If you have a live Supabase connection and "Save" features are active, it may sync to your user account.

## Technical

**Q: How are the PVT properties calculated?**  
A: We use standard black oil correlations (Standing, Vasquez-Beggs) to generate $B_o$, $R_s$, and viscosity curves based on the API gravity and gas specific gravity of the sample fluid.

**Q: Why do some wells have 0 rate?**  
A: Some wells are generated with a "Shut-in" status to demonstrate how the application handles non-producing assets in the well list.

**Q: Can I export this data?**  
A: Yes. You can use the **Export** tab to download the production history or parameter tables for the active reservoir.

**Q: What units are used?**  
A: 
*   **Oil**: STB (Stock Tank Barrels)
*   **Gas**: MSCF (Thousand Standard Cubic Feet)
*   **Pressure**: psia
*   **Depth**: ft TVD