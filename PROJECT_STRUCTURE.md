# 📍 RuknApp - Project Structure Guide

## Overview

This document explains the organization of the RuknApp project files and folders. The structure reflects the current state of the project with recommendations for future organization to align with React Native best practices.

## Current Project Structure

```
RuknApp/
├── .env                # Environment variables
├── .expo/              # Expo configuration
├── .git/               # Git repository
├── .gitignore          # Git ignore rules
├── app/                # Expo Router app directory
│   ├── (auth)/         # Authentication routes
│   ├── (tabs)/         # Tab navigator routes
│   ├── +html.tsx       # HTML wrapper for web
│   ├── +not-found.tsx  # 404 page
│   ├── _layout.tsx     # Root layout component
│   ├── chatScreen.tsx  # Chat screen
│   ├── index.tsx       # Home/landing page
│   └── placeDetails.tsx # Place details screen
├── assets/             # Static assets
│   └── fonts/          # Custom fonts
├── backend/            # Backend server code
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API route definitions
│   ├── utils/          # Backend utilities
│   ├── server.js       # Server entry point
│   └── ...             # Configuration files
├── components/         # UI components (DUPLICATED)
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── FilterHeader.tsx
│   ├── FixedHeaderOverlay.tsx
│   ├── ImageSlider.tsx
│   ├── MarketCard.tsx
│   ├── SearchBar.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx
│   ├── ideaHeader.tsx
│   ├── types.tsx
│   ├── useColorScheme.ts
│   └── ...
├── constants/          # Application constants
│   ├── Colors.ts       # Color definitions
│   ├── icons.js        # Icon definitions
│   └── index.js        # Exports
├── lib/                # Libraries and utilities
│   ├── supabase.ts     # Supabase client
│   └── supabaseSetup.ts # Supabase configuration
├── src/                # Source code directory
│   ├── context/        # React context providers
│   │   ├── AuthContext.tsx
│   │   └── FavoritesContext.tsx
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation components
│   ├── screens/        # Application screens (some duplicated with app/)
│   │   ├── chatScreen.tsx
│   │   ├── index.tsx
│   │   └── placeDetails.tsx
│   ├── utils/          # Utility functions
│   └── README.md       # Source code documentation
├── types/              # TypeScript type definitions
├── app.json            # Expo app configuration
├── babel.config.js     # Babel configuration
├── package.json        # NPM package configuration
└── tsconfig.json       # TypeScript configuration
```

## Identified Issues

1. **Component Duplication**: Components are currently in the root-level `/components` directory while the project structure mentions them in `/src/components/ui` and `/src/components/layout`.

2. **Screen Duplication**: Some screens appear to be duplicated in both `/app` (Expo Router) and `/src/screens` directories.

3. **Inconsistent Organization**: The codebase is split between root-level directories and the `/src` directory, which can lead to confusion.

## Recommended Structure

To align with modern React Native best practices and resolve current issues, we recommend the following reorganization:

```
RuknApp/
├── app/                # Expo Router (entry points only)
├── assets/             # Static assets (images, icons, fonts)
├── backend/            # Backend server code
├── src/                # Main source code directory
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Basic UI elements
│   │   └── layout/     # Layout components
│   ├── constants/      # Application constants
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Libraries and utilities
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Application screens
│   └── utils/          # Utility functions
├── types/              # TypeScript type definitions
└── ...                 # Configuration files
```

## Implementation Plan

1. **Consolidate Components**:
   - Move all components from root `/components` to `/src/components`
   - Organize into `/ui` and `/layout` subdirectories based on purpose

2. **Resolve Screen Duplication**:
   - Keep screen implementations in `/src/screens`
   - Use `/app` directory for routing only, importing components from `/src/screens`

3. **Consolidate Constants and Utilities**:
   - Move root `/constants` to `/src/constants`
   - Move `/lib` to `/src/lib`

## Guidelines for Development

### Adding New Features

1. **New Screens**: Add in `src/screens/` directory
2. **New Components**: 
   - UI components in `src/components/ui/`
   - Layout components in `src/components/layout/`
3. **New API Services**: Add in `src/services/`

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

This structure is designed to make navigation and understanding of the codebase straightforward. If you have questions or suggestions for improvements, please discuss with the team.
