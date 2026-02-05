# Facility Collaboration Tables Migration - Phase 4

**Date:** 2026-01-11
**Migration Script:** `phase4_facility_collaboration.sql`

## 1. Migration Overview
This migration establishes the data structure for the Facility Layout Designer's collaborative features (Phase 4). It addresses the "Table not found" errors by creating four essential tables with proper relationships and security policies.

## 2. Table Creation Order (Critical Dependency)
The tables are created in a specific order to satisfy Foreign Key constraints:
1.  **`facility_layout_versions`**: Depends on `facility_layouts` and `profiles`.
2.  **`facility_layout_comments`**: Depends on `facility_layouts` and `profiles`.
3.  **`facility_layout_collaborators`**: Depends on `facility_layouts` and `profiles`.
4.  **`facility_layout_audit_log`**: Depends on `facility_layouts` and `profiles`.

*Note: The parent table `facility_layouts` MUST exist before running this migration.*

## 3. RLS Policy Breakdown
Row Level Security is enabled on all tables to ensure data privacy and access control.

### A. Versions
- **SELECT**: Allowed if user is Project Owner OR Project is Public/Demo.
- **INSERT/UPDATE/DELETE**: Strictly limited to Project Owner.

### B. Comments
- **SELECT**: Visible to anyone with access to the layout.
- **INSERT**: Allowed for any authenticated user (on accessible layouts).
- **UPDATE**: Users can only edit *their own* comments.

### C. Collaborators
- **SELECT**: Visible to anyone with access to the layout.
- **ALL (Manage)**: Only the Project Owner can add or remove collaborators.

### D. Audit Log
- **SELECT**: Visible to anyone with access to the layout.
- **INSERT**: Open to allow the system to log actions from any user.

## 4. Verification Steps
After migration, verify in Supabase Dashboard:
1.  **Tables Exist**: Confirm all 4 tables appear in the Table Editor.
2.  **RLS Enabled**: Check for the "RLS" badge next to each table name.
3.  **Policies Active**: Open the Authentication > Policies tab and verify the policies listed above are present.
4.  **Data Integrity**: Try creating a version via the app; it should succeed without 404 errors.