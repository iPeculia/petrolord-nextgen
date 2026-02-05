# Department Module Mapping Constraint Fix

## Issue
Previous migrations attempting to insert into `department_module_mapping` using `ON CONFLICT (department_id, module_id)` failed because the table lacked a unique constraint on those columns.

## Fix
Migration `20260128a_add_unique_dept_module_mapping.sql` has been added to:
1. Clean up any existing duplicate mappings.
2. Add a unique constraint `department_module_mapping_unique` on `(department_id, module_id)`.

## Usage
Future inserts into this table can now safely use: