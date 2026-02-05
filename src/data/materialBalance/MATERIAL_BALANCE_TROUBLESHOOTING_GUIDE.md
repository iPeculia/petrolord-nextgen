# Troubleshooting Guide: Material Balance Sample Data

Common issues and solutions for the Material Balance module.

## 1. "Load Sample Data" button is missing
*   **Cause**: You may already have a project loaded (even a partial one).
*   **Fix**: The button only appears when the module is in a completely empty state. If you see sidebar items or tabs, you are already inside a project.

## 2. Charts are empty
*   **Cause**: No reservoir is currently selected, or the selected reservoir has no data for that specific metric.
*   **Fix**: 
    1. Check the Left Sidebar and ensure a reservoir is highlighted.
    2. Click on a reservoir name to force a selection update.
    3. Verify you are on the correct tab (e.g., "Production & Pressure History" for rates).

## 3. "No Data" displayed in Rock Properties
*   **Cause**: Capillary Pressure data is not currently included in the V1 sample dataset.
*   **Fix**: This is expected behavior. Only Relative Permeability curves are available at this time.

## 4. Cannot Edit Sample Data
*   **Cause**: Sample data logic is often read-only in demonstration mode to prevent accidental corruption during demos.
*   **Fix**: The current sample implementation generates data on-the-fly. Edits may not persist permanently if you reload the page, depending on your browser's local storage settings. For permanent work, please create a **New Project**.

## 5. Performance Issues / Slow Loading
*   **Cause**: Browser memory limits (rare).
*   **Fix**: The sample data is lightweight (<2MB). If you experience slowness, try refreshing the page to clear the application state cache.

## 6. Contact Support
If issues persist, please contact the development team with the following info:
*   Browser Version
*   Steps to Reproduce
*   Screenshot of the error (if any)