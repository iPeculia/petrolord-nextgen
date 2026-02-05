-- Migration: Add unique constraint to department_module_mapping
-- Date: 2026-01-28
-- Description: Adds a unique constraint on (department_id, module_id) to allow ON CONFLICT clauses to work correctly.

-- First, remove any duplicate mappings that might violate the constraint
DELETE FROM public.department_module_mapping a USING (
    SELECT MIN(ctid) as ctid, department_id, module_id
    FROM public.department_module_mapping 
    GROUP BY department_id, module_id HAVING COUNT(*) > 1
) b
WHERE a.department_id = b.department_id 
AND a.module_id = b.module_id 
AND a.ctid <> b.ctid;

-- Then add the constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'department_module_mapping_unique'
    ) THEN
        ALTER TABLE public.department_module_mapping 
        ADD CONSTRAINT department_module_mapping_unique UNIQUE (department_id, module_id);
    END IF;
END $$;