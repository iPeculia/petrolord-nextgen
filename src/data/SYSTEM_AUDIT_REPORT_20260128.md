# System Audit Report - Petrolord NextGen Suite
**Date:** January 28, 2026
**Version:** 1.0.0

## 1. Executive Summary
The Petrolord NextGen Suite is a comprehensive educational and enterprise operating system for the energy sector. The application is built on a modern **React (Vite)** frontend with a **Supabase** backend (PostgreSQL), utilizing **Tailwind CSS** for styling and **shadcn/ui** for component primitives.

The architecture is highly modular, separating core platform features (LMS, Admin, User Management) from specialized technical domains (Geoscience, Reservoir, Production, Drilling, Facilities, Economics).

## 2. Database Schema Analysis

### 2.1 Core Domains
The database schema is robust, featuring over 70 tables organized into logical domains.

*   **Identity & Access**:
    *   `profiles`: Central user table extending Supabase Auth. Includes roles (`student`, `lecturer`, `admin`, `super_admin`) and academic phases.
    *   `university_applications`, `universities`, `university_members`: Hierarchical structure for institutional management.
    *   `licenses`: Manages access rights and expiration logic.

*   **Learning Management System (LMS)**:
    *   `courses`, `course_modules`, `course_lessons`: Structured content delivery.
    *   `course_enrollments`, `student_course_progress`, `student_course_attempts`: Tracking student engagement and performance.
    *   `quizzes`, `quiz_questions`, `quiz_attempts`: Assessment engine.
    *   `certificates`: Credentialing system.

*   **Technical Modules**:
    *   **Geoscience**: `wells`, `well_logs`, `markers` (Formation tops), `analyses`.
    *   **Reservoir**: `material_balance_*`, `reservoir_simulation_*`, `dca_*` (Decline Curve Analysis).
    *   **Production**: `nodal_analysis_*`, `pta_*` (Pressure Transient), `artificial_lift` (implied context).
    *   **Facilities**: `facility_layouts`, `facility_equipment`, `pipeline_sizer_cases`.
    *   **Drilling**: `casing_tubing_designs`, `design_sections`.
    *   **Economics**: `irr_projects`, `irr_cashflows`, `irr_analysis_results`.

*   **System & Compliance**:
    *   `audit_logs`: Comprehensive tracking of user actions (UPDATE, DELETE, etc.).
    *   `system_settings`, `feature_toggles`: Runtime configuration without deployment.
    *   `notifications`: Real-time user alerts.

### 2.2 Row Level Security (RLS)
The application implements a "Security by Default" approach. RLS policies are extensively used:
*   **User Isolation**: `auth.uid() = user_id` patterns strictly enforce data privacy for students.
*   **Admin Access**: `get_user_role() = 'admin'` or `super_admin` policies grant broad oversight.
*   **Institutional Access**: Policies using `EXISTS` clauses on `university_members` allow university admins to manage only their own students/staff.
*   **Project Collaboration**: Complex policies on `projects` and `project_members` enable team-based workflows in technical modules.

## 3. Codebase Architecture

### 3.1 Directory Structure
The `src/` directory follows a domain-driven design:
*   `components/`: Reusable UI elements (shadcn), charts, and shared widgets.
*   `contexts/`: Global state management (`AuthContext`, `RoleContext`, `NotificationContext`).
*   `hooks/`: Custom logic encapsulation (e.g., `useLicenseStatus`, `useCourseProgress`).
*   `modules/`: Self-contained technical applications (Drilling, Facilities, etc.) with their own components, utils, and layouts.
*   `pages/`: Route-level components mapping to URL paths.
*   `services/`: API abstraction layers interacting with Supabase.

### 3.2 Key Technical Features
*   **Authentication**: Custom `SupabaseAuthContext` handling session persistence, profile hydration, and role derivation.
*   **Role-Based Access Control (RBAC)**: Implemented via `RoleContext` and `ProtectedLicenseRoute` to secure routes based on user type and license validity.
*   **Data Visualization**: Heavy use of `Recharts` for analytics and technical plots (logs, production history).
*   **Real-time**: Supabase Realtime subscriptions used in `NotificationContext` for instant alerts.

## 4. Recent Modifications & State
*   **Sample Data**: A robust migration script (`migrations/20260128_fixed_sample_data.sql`) was recently generated to populate the `courses` table with realistic content across 6 major modules, ensuring column compatibility with the latest schema.
*   **Course Structure**: The schema now supports `learning_outcomes` (JSONB) and detailed metadata (`phase_requirement`, `difficulty_level`) to support the adaptive learning features.

## 5. Health & Optimization
*   **Status**: The system appears stable with a finalized schema and compatible frontend logic.
*   **Performance**: Large tables like `audit_logs` and `well_logs` are properly indexed (implied by standard Supabase setup).
*   **Scalability**: The separation of `university_members` allows for multi-tenant scalability for university onboarding.

## 6. Conclusion
Petrolord NextGen Suite is in a mature development state. The database schema correctly mirrors the application's complex requirements, balancing strict academic data governance with flexible technical engineering data structures.