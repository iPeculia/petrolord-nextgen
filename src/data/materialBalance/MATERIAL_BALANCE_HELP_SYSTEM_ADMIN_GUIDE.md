# Help System Administration Guide

## Overview
The Help System includes an internal Admin Panel for monitoring usage and system health.

## Accessing Admin Panel
1.  Open the Help Guide.
2.  (Internal Only) Navigate to the `admin` category path or use a super-admin account.
3.  View the **Help System Administration** dashboard.

## Analytics Dashboard
*   **Most Viewed Topics**: Bar chart showing the top 5 most accessed help articles. Use this to identify where users struggle or spend the most time.
*   **System Health**: Status indicators for the Search Index and Analytics Engine.

## Content Management
*   **Updating Content**: Currently, content is managed via the code repository in `src/data/materialBalanceHelpContent.js`.
*   **Adding FAQs**: Append new items to the `faqItems` array in the content file.
*   **New Tutorials**: Register new tutorial IDs in `TrainingDashboard.jsx` and update the content file.

## User Feedback
*   Feedback submissions are currently logged to `localStorage` (simulated backend).
*   **Review Process**: Check the `mb_help_analytics` storage key to retrieve user comments and ratings.

## Configuration
*   **Search Weights**: Adjust search relevance scoring in `src/utils/helpSearch.js`.
*   **Defaults**: Modify default user preferences (e.g., tooltips enabled) in `src/contexts/HelpContext.jsx`.