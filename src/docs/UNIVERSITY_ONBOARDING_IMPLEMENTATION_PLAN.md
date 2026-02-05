# University Onboarding System - Implementation Roadmap

This document outlines the detailed phased implementation plan for the University Onboarding System within the Petrolord NextGen Suite.

## Overview
The goal is to create a seamless process for universities to apply for access, be vetted by administrators, and subsequently manage their own students and lecturers. This system integrates licensing, course prerequisites, and automated access control.

---

## PHASE 1: University Application & Onboarding Form

**Objective:** Enable university representatives to submit applications for institutional access.

### 1.1 Registration Interface (`/university-onboarding`)
- **Public-facing Form:** Create a multi-step registration wizard.
- **Representative Details:**
  - Full Name
  - Job Title/Position (e.g., HOD, Dean, Faculty Admin)
  - Official University Email Address
  - **Validation:** Strict regex validation to block public email domains (gmail, yahoo, hotmail, etc.). Only `.edu`, `.ac`, or known university domains allowed.
- **University Information:**
  - University Name
  - Official Address/Location
  - Website URL
  - Contact Phone Number
- **Department Setup:**
  - Custom input field allowing the representative to type their specific department name (e.g., "Petroleum Engineering", "Geosciences").
  - Capability to add multiple departments if applying for a school-wide license.

### 1.2 Backend & Database
- **Table: `university_applications`**
  - `id` (UUID)
  - `rep_name`, `rep_email`, `rep_position`
  - `university_name`, `address`, `website`
  - `departments` (JSONB array)
  - `status` (ENUM: 'pending', 'under_review', 'approved', 'rejected')
  - `submitted_at`, `updated_at`
- **Security:** Row Level Security (RLS) to ensure applicants can only view their own submission status.

### 1.3 Notification System (Initial)
- **Applicant Email:** "Application Received" auto-response confirming submission.
- **Admin Alert:** Notification to Super Admins that a new university application requires review.

---

## PHASE 2: Admin Approval Workflow

**Objective:** Empower Super Admins to vet and approve/reject university applications.

### 2.1 Admin Dashboard Interface (`/dashboard/admin/approvals`)
- **Application List:** Table view of all pending applications.
- **Review Detail View:** 
  - Read-only view of all submitted data.
  - "Approve" and "Reject" action buttons.
  - **Rejection:** Modal to input reason for rejection (sent via email).
  - **Approval:** Modal to configure initial limits (e.g., Max Students, Max Lecturers).

### 2.2 Approval Logic
- **Account Creation:**
  - Upon approval, automatically create a `User` account for the Representative in Supabase Auth.
  - Assign Role: `university_admin`.
  - Generate a temporary password or magic link.
- **University Profile:**
  - Create a `universities` tenant record linking the Admin User to the University entity.
  - Store approved limits (Student Licenses, Lecturer Licenses).

### 2.3 Email Triggers
- **Approval Email:** Welcome packet containing login credentials, dashboard link, and "Getting Started" guide.
- **Rejection Email:** Polite decline message with the reason provided by the admin.

---

## PHASE 3: University Admin Dashboard

**Objective:** Provide University Admins with tools to manage their institution's users.

### 3.1 Dashboard Overview
- **Stats Cards:** Total Licenses, Used Student Licenses, Used Lecturer Licenses, Active Courses.
- **Quick Actions:** "Invite Lecturer", "Add Student Bulk Import".

### 3.2 Lecturer Management
- **Role:** `lecturer`
- **Features:**
  - Add single lecturer (Email, Name, Department).
  - **License Type:** Continuous/Perpetual (until revoked manually).
  - Permissions: Can create cohorts, view student progress, but cannot manage licenses.

### 3.3 Student Management
- **Role:** `student`
- **Eligibility Check:**
  - Dropdown for "Academic Level" (100, 200, 300, 400, 500, MSc, PhD).
  - **Validation:** Alert/Warning if level is below 300 (System focus is 300+).
- **Bulk Import:** CSV upload feature for batch student onboarding.
- **License Allocation:** 
  - Assign specific license duration (see Phase 5).

---

## PHASE 4: Course & LMS System

**Objective:** Deliver educational content and enforce competency before module access.

### 4.1 Course Structure
- **Levels:**
  - **Beginner:** General Industry Knowledge.
  - **Intermediate:** Specific Module Theory (e.g., Reservoir Basics).
  - **Advanced:** Practical Tool Application.
- **Mapping:**
  - 300 Level Students -> Assigned Beginner Courses.
  - 400/500 Level -> Assigned Intermediate/Advanced.
  - Postgrad -> Full Access.

### 4.2 LMS Features
- **Video Player:** Embedded video content.
- **Quizzes:** Multiple-choice questions after each section.
- **Scoring Engine:**
  - Calculate score percentage.
  - **Threshold:** >80% required to pass.
  - **Retakes:** Allow specific number of retakes or cooldown period.

### 4.3 Module Access Integration
- **Gatekeeper Logic:** 
  - Engineering Modules (Reservoir, Drilling, etc.) are LOCKED by default for students.
  - **Unlock Condition:** `Course_Completion_Status == 'Passed'` AND `Score >= 80%`.

---

## PHASE 5: License & Access Management

**Objective:** Automate the lifecycle of user access based on academic tenure.

### 5.1 License Configuration
- **Student (Undergraduate):**
  - Duration: 10 Months (Academic Session).
  - Hard Expiry Date set upon creation.
- **Student (Postgraduate):**
  - Duration: 12 Months.
- **Alumni/Graduating:**
  - Grace Period: 60 Days after graduation date.

### 5.2 Automated Expiration Job
- **Scheduled Edge Function (Daily):**
  - Check all `student_licenses` where `expiry_date < NOW()`.
  - Update Status to `expired`.
  - Revoke access to Dashboard Modules.
  - Send "Access Expired" notification.

---

## PHASE 6: Email & Notification System

**Objective:** Keep all stakeholders informed throughout the lifecycle.

### 6.1 System Notifications
- **In-App:** Toast notifications and Notification Center alerts for all critical actions.
- **Email Service (Resend/Supabase):**
  - **University Applied:** To Super Admin.
  - **Application Status:** To University Rep.
  - **Welcome/Invite:** To Lecturers & Students when added.
  - **Course Passed:** "Certificate of Completion" email to Student.
  - **License Warning:** "Your access expires in 30 days" (Student).
  - **License Expired:** "Your access has ended" (Student).

### 6.2 Audit Logs
- Log every invitation, approval, rejection, and license expiry event for compliance and tracking.