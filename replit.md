# Fintrack Mobile Dashboard

## Overview
Fintrack is a mobile-first financial management application designed for tracking personal finances, investments (including carat-specific gold tracking), savings goals, and splitting bills. Its core purpose is to provide a comprehensive, intuitive, and glanceable view of a user's financial health, drawing inspiration from premium fintech apps. Key capabilities include real-time transaction tracking, investment portfolio management with real-time P/L, visual savings goal progress, and financial insights. The project aims to deliver a premium mobile experience that simplifies complex financial data.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React with TypeScript, Wouter for routing, and Vite for building. Server state is managed with TanStack Query, and animations are handled by Framer Motion. The UI is built with shadcn/ui components on Radix UI primitives, styled using Tailwind CSS, and follows a mobile-first responsive design. A key decision is using shadcn/ui for consistent, accessible components and TanStack Query for efficient data fetching and caching.

### Backend Architecture
The backend is built with Express.js and Node.js, fully leveraging TypeScript for type safety. Drizzle ORM manages database interactions, with schema definitions shared between frontend and backend in a `shared/` directory to ensure type consistency. An abstract `IStorage` interface allows for flexible data storage, currently implemented with in-memory storage for development and planned PostgreSQL integration. Session management uses `express-session` with a PostgreSQL store.

### API Structure
RESTful API endpoints are organized by resource (e.g., `/api/transactions`, `/api/investments`, `/api/goals`). Request bodies are validated using Zod schemas derived from Drizzle schemas, ensuring consistent validation and type inference. Standard HTTP status codes and detailed error messages are used.

### Database Schema
Core entities include Users, Transactions, Investments, Goals, Goal Transactions, Split Bills, Split Bill Participants, Communities, Community Members, Community Wallets, Community Positions, Community Orders, Vote Records, and Community Contributions. All entities use UUID primary keys and decimal types for monetary values to prevent rounding errors. Foreign key relationships and `createdAt` timestamps are standard.

### Core Features and Implementations
- **Authentication**: Passwordless phone-based OTP authentication with session management.
- **Investment Tracking**: Detailed gold tracking (22K/24K) with purity, real-time prices, and P/L calculation. Features a compact home page display and a 3-dot menu for edit/delete actions with smart pricing logic.
- **Goals Management**: Comprehensive search, filter (by category, progress, amount, date), and sorting capabilities for savings goals, with a dedicated page for goal creation.
- **Community Investment (NEW)**: Multi-user communities for collective gold/silver investment. Features include:
  - Community creation with configurable approval modes (majority vote, unanimous, admin-only)
  - Member management with role-based access (admin, treasurer, member)
  - Order proposal system for buy/sell decisions
  - Democratic voting on investment proposals
  - Shared wallet and positions tracking
  - Activity feed for transparency
  - Demo data for offline mode testing
  - **Note**: Real-time Socket.IO sync deferred as optional enhancement; current implementation uses TanStack Query cache invalidation.
- **Mobile Deployment**: Capacitor-based Android app wrapper with GitHub Actions CI/CD for automated APK builds.

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL via `@neondatabase/serverless`
- **Drizzle ORM**: `drizzle-orm` (PostgreSQL dialect) for type-safe queries.
- **Drizzle Kit**: For schema migrations.

### UI & Styling
- **Radix UI**: Headless UI primitives.
- **shadcn/ui**: Component system configuration.
- **Lucide React**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library.
- **Google Fonts CDN**: For the Inter font family.

### State & Data Management
- **TanStack Query**: `react-query` for server state management.
- **React Hook Form**: Form state management with `@hookform/resolvers`.
- **Zod**: Runtime schema validation.
- **drizzle-zod**: Bridge for Drizzle and Zod schemas.

### Session & Security
- **express-session**: Session management.
- **connect-pg-simple**: PostgreSQL session store.

### Utilities
- **date-fns**: Date manipulation.
- **wouter**: Lightweight routing.
- **nanoid**: Unique ID generation.