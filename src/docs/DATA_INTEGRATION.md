# Cross-Module Data Integration Architecture

This document outlines the architecture for a unified data layer that allows all applications within the Petrolord NextGen Suite to share well data, analysis results, and metadata.

## 1. Architecture Overview

The core of the integration strategy is a centralized data model consisting of:

-   **Global Data Store (`/src/store/globalDataStore.js`)**: A Zustand store that acts as a client-side cache for shared data like wells and analyses. It provides a single, consistent state accessible by any module.
-   **Unified Supabase Schema**: A set of generic database tables (`wells`, `well_logs`, `analyses`) that serve as the single source of truth for all modules. This replaces module-specific tables.
-   **Global API Layer (`/src/api/globalDataApi.js`)**: A centralized API for all CRUD operations on the unified tables. Modules should use this API instead of direct database calls.
-   **Data Sync Service (`/src/services/dataSyncService.js`)**: Uses Supabase real-time subscriptions to listen for database changes and broadcast them to all connected clients, ensuring data consistency across modules.

## 2. How to Access Well Data from Any Module

To access well data, components should use the `useGlobalDataStore` hook.

**Example: Loading all wells and selecting one**