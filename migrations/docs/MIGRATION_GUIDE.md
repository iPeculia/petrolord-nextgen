# Course Management System - Database Migration Guide

**Date**: 2026-01-27
**Module**: Course Management (LMS)
**Status**: Pending Execution

## Overview
This migration updates the Supabase database schema to support the enhanced Course Management System. It introduces comprehensive tracking for course structures (modules, lessons), student progress, and detailed course metadata.

The migration is designed to be **idempotent**, meaning it can be run multiple times without causing errors or duplicating columns/tables.

## 1. Schema Changes

### A. Courses Table (`courses`)
We are enriching the existing `courses` table to support the new UI requirements.
- **`course_thumbnail_url`**: Stores the banner image URL for the course card.
- **`is_published`**: Explicit boolean flag for visibility (renaming/aliasing existing `published` if necessary for consistency).
- **`total_modules`, `total_lessons`, `total_duration_hours`**: Cached counters to avoid expensive queries on the frontend.

### B. Course Modules (`course_modules`)
Groups lessons into logical sections.
- **`is_published`**: Allows admins to draft modules before releasing them to students.
- **`module_order`**: Critical for the drag-and-drop curriculum builder.

### C. Course Lessons (`course_lessons`)
The core content units.
- **`lesson_type`**: Distinguishes between 'video', 'quiz', 'article', etc.
- **`is_preview`**: Allows non-enrolled users to watch specific lessons (teaser content).
- **`duration_minutes`**: Used for calculating total course duration.

### D. Student Progress (`student_lesson_progress`)
Granular tracking of user engagement.
- **`last_watched_position`**: Stores video timestamp (in seconds) to resume playback.
- **`status`**: 'not_started', 'in_progress', 'completed'.

## 2. Security (Row Level Security)

We implement a **Strict RLS Policy**:
- **Public/Students**: Can only `SELECT` content that is `is_published = true`.
- **Students**: Can `INSERT/UPDATE` only their *own* progress records (`auth.uid() = user_id`).
- **Admins/Super Admins**: Have full `ALL` access (CRUD) to all tables.

## 3. Execution Instructions

1.  Log in to your **Supabase Dashboard**.
2.  Navigate to the **SQL Editor** tab on the left sidebar.
3.  Open the file `migrations/20260127_course_management_schema.sql`.
4.  Copy the entire content of the file.
5.  Paste it into the SQL Editor.
6.  Click **Run**.

## 4. Verification Checklist

After running the script, verify the following:

- [ ] **Table Columns**: Go to Table Editor -> `courses`. Ensure `course_thumbnail_url` exists.
- [ ] **Policies**: Go to Authentication -> Policies. Check that `course_lessons` has policies for "Public View" and "Admin Manage".
- [ ] **Functionality**: Try dragging a module in the Course Builder. It should persist the new order.