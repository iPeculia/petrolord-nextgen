# RLS Policy Update (2026-01-27)

**Module**: Course & Video Management  
**Status**: Ready for Deployment  
**Target Tables**: `course_modules`, `course_lessons`, `lesson_videos`, `video_analytics`, `student_lesson_progress`

## Summary

This update refactors the Row Level Security (RLS) policies for the core learning management tables.

### Key Changes & Rationale
1.  **Performance & Recursion Fix (Use of `auth.jwt()`)**:
    *   *Previous Approach*: Checked user roles by querying the `public.profiles` table (e.g., `EXISTS (SELECT 1 FROM profiles ...)`). This causes additional database joins on every query and frequently leads to "infinite recursion" errors when policies reference tables that refer back to profiles.
    *   *New Approach*: We now inspect the JWT metadata directly using `auth.jwt() -> 'user_metadata' ->> 'role'`. This is zero-cost for the database (no extra lookups) and completely eliminates recursion risks.

2.  **Supabase Best Practices**:
    *   Policies are split distinctly into `SELECT` (Read) vs `ALL` (Write/Manage) to ensure clarity.
    *   "Permissive" logic is applied consistently: Admins have implicit access to everything without needing to be the "owner" of a record.

## Deployment Instructions

1.  Navigate to the **Supabase Dashboard** -> **SQL Editor**.
2.  Copy and paste the SQL blocks below into the editor.
3.  Run the script.
4.  Verify by logging in as a student (should see content) and an admin (should see edit controls).

---

## SQL Blocks

### Block 1: Course Structure (`course_modules`, `course_lessons`)
Updates permissions to allow public viewing of published content while restricting management to admins via JWT.