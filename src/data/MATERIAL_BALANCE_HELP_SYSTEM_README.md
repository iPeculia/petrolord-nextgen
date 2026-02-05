# Material Balance Help & Training System v2.0

## Overview
The Help System has been significantly enhanced to provide a comprehensive, context-aware support experience for users. This documentation outlines the new architecture and components.

## New Features
1.  **Contextual Tooltips**: A `ContextualHelpWrapper` component allows any UI element to display rich tooltips with shortcuts and "Learn more" links.
2.  **Help Assistant Sidebar**: A persistent, collapsible sidebar for quick access to search, history, and bookmarks without leaving the workspace.
3.  **Global Search**: Robust search utility with ranking and preview generation (`src/utils/helpSearch.js`).
4.  **Analytics**: Basic tracking of views and searches to inform future documentation improvements (`src/utils/helpAnalytics.js`).
5.  **Feedback Loop**: Integrated feedback forms allow users to report bugs or suggest improvements directly within the help interface.
6.  **Persistence**: Bookmarks, history, and preferences are saved to `localStorage`.

## Usage
### 1. Adding Contextual Help
Wrap any component with `ContextualHelpWrapper`: