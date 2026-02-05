# Video Management System - Database Migration Guide

**Date**: 2026-01-26
**Module**: Video Analytics & Management
**Status**: Pending Execution

## Overview
This migration establishes the database infrastructure for the video learning component of the LMS. It handles video asset storage metadata, granular user engagement analytics, and raw event tracking.

## 1. Schema Changes

### A. Lesson Videos (`lesson_videos`)
Stores metadata for video content associated with course lessons.
- **`hosting_provider`**: Identifies source (e.g., 'youtube', 'vimeo', 's3').
- **`duration`**: Duration in seconds.
- **Security**: Public read access for authenticated users; write access restricted to admins.

### B. Video Analytics (`video_analytics`)
Aggregated performance metrics for student video consumption.
- **`completion_percentage`**: Derived metric to track progress (0-100).
- **`last_watched_position_seconds`**: Essential for "Resume Watching" functionality.
- **`pause_count`, `seek_count`**: Engagement indicators.
- **Security**: Users see their own data; Admins see all.

### C. Video Events (`video_events`)
Immutable log of raw player interactions.
- **`event_type`**: 'play', 'pause', 'seek', 'complete', 'ratechange'.
- **`event_data`**: JSONB field for flexible payload storage (e.g., old_time vs new_time).
- **Security**: Insert-only for users (via application logic); Admin read-only.

## 2. Row Level Security (RLS) Policies

| Table | Policy Name | Description |
| :--- | :--- | :--- |
| `lesson_videos` | `Users view videos` | Authenticated users can select. |
| `lesson_videos` | `Admins manage videos` | Admins/Super Admins have full CRUD access. |
| `video_analytics` | `Students view own analytics` | Users can SELECT where `user_id = auth.uid()`. |
| `video_analytics` | `Admins view all analytics` | Admins can SELECT all records. |
| `video_events` | `Users log own events` | Users can INSERT where `user_id = auth.uid()`. |

## 3. Execution Instructions

1.  Log in to your **Supabase Dashboard**.
2.  Navigate to the **SQL Editor** tab.
3.  Open/Paste content from `migrations/20260126_video_management_schema.sql`.
4.  Click **Run**.

## 4. Verification

After execution, run these queries to verify: