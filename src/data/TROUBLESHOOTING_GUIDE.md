# Troubleshooting Guide

Common issues and solutions for the Sample Data module.

## 1. "Load Sample Data" button is missing
*   **Cause**: You may already have a project loaded (even an empty one).
*   **Fix**: Go to the **Project Manager** (Folder icon in left sidebar) -> **Samples** tab -> Click **Load Dataset**. Alternatively, click **Clear Data** on the Dashboard.

## 2. Plots are empty after loading
*   **Cause**: No well is selected.
*   **Fix**: Select a well from the **Well Selector** list on the left sidebar. Ensure the "Wells" tab is active in the sidebar.

## 3. "Failed to load sample data" error
*   **Cause**: Potential memory issue or script timeout (rare).
*   **Fix**: Refresh the browser page. The data is generated client-side and does not rely on external servers, so network issues are unlikely to be the cause.

## 4. Changes to sample data aren't saving
*   **Cause**: Sample data is a template. Changes made in memory are temporary unless you explicitly save the project.
*   **Fix**: Go to **Project Manager** and click **Save**. This will persist your modifications to local storage.

## 5. Tutorial doesn't appear
*   **Cause**: You may have already viewed and dismissed it (preference saved).
*   **Fix**: Click the **Help / Tutorial** button in the top header to manually re-launch the guide.