# 📍 RuknApp - Project Structure Guide

## Overview

This document explains the organization of the RuknApp project files and folders. The structure follows modern React Native best practices to make development, maintenance, and collaboration easier.

## Main Project Directories

```
src/                    # Main source code directory
├── assets/             # Static assets (images, icons, fonts)
├── components/         # Reusable UI components
│   ├── ui/             # Basic UI elements (buttons, cards, inputs)
│   └── layout/         # Layout components (headers, footers, containers)
├── constants/          # Application constants and configuration
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration and components
├── screens/            # Application screens/pages
├── services/           # API services, external integrations
└── utils/              # Utility functions and helpers

backend/                # Backend server code
├── controllers/        # Request handlers and business logic
├── middleware/         # Express middleware
├── models/             # Data models and schemas
├── routes/             # API route definitions
└── utils/              # Backend utility functions
```

## Detailed Structure Explanation

### Frontend (src/)

#### assets/
Contains all static assets used in the application:
- `images/`: For all application images
- `icons/`: For custom icons
- `fonts/`: For custom fonts

#### components/
Reusable UI components organized by purpose:
- `ui/`: Basic building blocks like buttons, inputs, cards
- `layout/`: Structural components like headers, navigation bars

#### constants/
Application-wide constants and configuration:
- Environment-specific settings
- Theme variables
- API endpoints

#### hooks/
Custom React hooks that encapsulate reusable logic.

#### navigation/
All navigation-related code using Expo Router:
- Navigation configurations
- Route definitions
- Navigation utilities

#### screens/
Each screen or page in the application, organized by feature or flow.

#### services/
Services for data fetching and external API integrations:
- API client configurations
- Service functions to interact with the backend

#### utils/
Utility functions and helper methods used throughout the app.

### Backend (backend/)

#### controllers/
Handlers for API requests containing business logic.

#### middleware/
Express middleware for request processing (authentication, validation, etc.).

#### models/
Data models and database schema definitions.

#### routes/
API route definitions and endpoint handlers.

#### utils/
Utility functions specific to the backend.

## Guidelines for Development

### Adding New Features

1. **New Screens**: Add in `src/screens/` directory
2. **New Components**: 
   - UI components in `src/components/ui/`
   - Layout components in `src/components/layout/`
3. **New API Services**: Add in `src/services/`

### Modifying Existing Features

1. Find the relevant directory based on what you're modifying
2. Make changes following the established patterns
3. Update tests if applicable

### Backend Development

1. Add new API endpoints in `backend/routes/`
2. Implement business logic in `backend/controllers/`
3. Define data models in `backend/models/`

## Best Practices

- Keep components small and focused on a single responsibility
- Use hooks for reusable logic
- Maintain consistent naming conventions
- Document complex functions and components
- Follow the established folder structure

---

This structure is designed to make navigation and understanding of the codebase straightforward. If you have any questions or suggestions for improvements, please discuss with the team.
