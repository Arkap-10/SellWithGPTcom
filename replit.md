# SellWithGPT - Magento ChatGPT Integration Platform

## Overview

SellWithGPT is a full-stack web application that enables Magento e-commerce stores to integrate their product catalogs with ChatGPT, allowing customers to browse and purchase products directly through conversational AI interfaces. The platform provides a landing page with trial signup functionality, positioning itself as a SaaS solution for modern AI-driven commerce.

The application is built as a monorepo with a React frontend, Express backend, and PostgreSQL database, designed to run on the Replit platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing (instead of React Router)
- **TanStack Query** (React Query) for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library (new-york style variant) built on Radix UI primitives
- **Tailwind CSS** with custom theme configuration and CSS variables for styling
- Custom fonts: Inter (body) and Plus Jakarta Sans (headings)
- Responsive design with mobile-first approach

**Page Structure**
- Single-page application with home page as primary route
- Modular component architecture: Navbar, Hero, Features, Pricing, Contact, Footer
- Trial signup modal component with multi-step form handling
- 404 page for unmatched routes

**Key Design Decisions**
- Removed Framer Motion dependency (noted in package.json) to reduce bundle size
- Uses Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)
- Path aliases configured for cleaner imports (@/, @shared/, @assets/)

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- ESM modules throughout the codebase
- Custom middleware for request logging and JSON body parsing
- Raw body access enabled for webhook/payment processing scenarios

**API Design**
- RESTful API endpoints under `/api` prefix
- `/api/trial-signup` - POST endpoint for trial registrations
- `/api/trial-signups` - GET endpoint for retrieving all signups
- Validation using Zod schemas from shared directory
- Structured error responses with appropriate HTTP status codes

**Development vs Production**
- Development: Vite dev server with HMR integrated as Express middleware
- Production: Pre-built static assets served from dist/public
- Environment-based configuration through NODE_ENV

**Key Architectural Choices**
- Separation of storage logic into dedicated storage layer (DatabaseStorage class)
- Interface-based storage design (IStorage) enabling future storage backend swaps
- Request/response logging middleware for API monitoring
- Vite middleware mode for seamless frontend-backend integration during development

### Data Storage

**Database Technology**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for type-safe database operations
- WebSocket-based connection pooling for serverless environment

**Schema Design**
- `trial_signups` table with fields:
  - id (UUID primary key, auto-generated)
  - email (unique, required)
  - fullName, companyName, phone
  - planName (selected pricing tier)
  - cardProvided (boolean flag)
  - cardMasked (last 4 digits for display)
  - createdAt (timestamp)

**Data Validation**
- Zod schemas shared between client and server
- Email validation includes:
  - RFC-compliant format checking
  - Disposable email domain filtering
  - Professional email enforcement
- Schema co-location with database definitions using drizzle-zod

**Migration Strategy**
- Drizzle Kit for schema migrations
- Migration files output to /migrations directory
- Push-based deployment with `db:push` script

### External Dependencies

**Database Service**
- **Neon Serverless Postgres** - Serverless PostgreSQL database
- WebSocket connection requirement (ws package) for Neon compatibility

**Replit Platform Services**
- **@replit/object-storage** - File/object storage client (configured with specific bucket ID)
- **@replit/vite-plugin-cartographer** - Development navigation plugin
- **@replit/vite-plugin-dev-banner** - Development environment indicator
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting

**UI Component Libraries**
- **Radix UI** - Complete suite of headless UI primitives for accessibility
- **Lucide React** - Icon library
- **cmdk** - Command palette component
- **class-variance-authority** - Type-safe variant API for components
- **tailwindcss** - Utility-first CSS framework

**Form & Validation**
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Validation resolver bridge
- **Zod** - TypeScript-first schema validation

**Development Dependencies**
- **tsx** - TypeScript execution for development server
- **esbuild** - Backend bundler for production builds
- **drizzle-kit** - Database migration tooling

**Key Integration Points**
- Database connection via DATABASE_URL environment variable
- Replit Object Storage via bucket ID
- Session management via connect-pg-simple (PostgreSQL session store)
- Future payment processing capability (cardMasked field suggests Stripe or similar)

**Notable Architectural Decisions**
- Serverless-first database choice optimized for Replit deployment
- Shared schema definitions between frontend and backend prevent type drift
- Object storage integration prepared but not actively used in current signup flow
- Built-in support for future multi-tenancy (companyName field)