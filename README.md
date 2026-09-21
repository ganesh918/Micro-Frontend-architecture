# Micro-Frontend Dashboard (MFD Platform)

A production-oriented Micro-Frontend dashboard built with **React**, **Vite Module Federation**, and a **monorepo** architecture. Each module is independently developed, built, and deployed while composing into a unified application at runtime.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Shell (Host) :5000                       │
│  Routing · Layout · Auth Guard · Module Orchestration        │
└──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │
    ┌──────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────────┐ ┌────────▼────┐
    │ Auth     │ │ Dash   │ │ Users  │ │ Analytics  │ │ Notifications│
    │ :5001    │ │ :5002  │ │ :5003  │ │ :5004      │ │ :5005        │
    └──────────┘ └────────┘ └────────┘ └────────────┘ └─────────────┘
           │          │          │          │                │
           └──────────┴──────────┴──────────┴────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Shared Packages   │
                    │  UI · Auth · Utils │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  API Server :4000  │
                    └───────────────────┘
```

## Features

- **Module Federation** — Independent modules loaded at runtime via Vite federation plugin
- **Lazy Loading** — Each remote module is code-split and loaded on demand
- **Shared Dependencies** — React, React Router, TanStack Query, Zustand deduplicated across modules
- **Authentication** — JWT-style session with protected routes and role-based access control
- **Event Bus** — Cross-module communication via typed pub/sub (mitt)
- **Design System** — Shared UI components (Button, Card, Table, Modal, etc.)
- **State Management** — Zustand (auth) + TanStack Query (server state)
- **API Integration** — REST client with auth headers, error handling, and mock API server
- **Loading / Error / Empty States** — Consistent UX across all modules
- **Responsive Design** — Mobile-friendly sidebar, adaptive grids, and layouts
- **Error Boundaries** — Per-module fallback UI with retry

## Project Structure

```
micro-frontend-dashboard/
├── apps/
│   ├── shell/              # Host application (orchestrator)
│   └── api-server/         # Mock REST API
├── modules/
│   ├── auth/               # Authentication module
│   ├── dashboard/          # Dashboard module
│   ├── user-management/    # User CRUD module
│   ├── analytics/          # Analytics & reports module
│   └── notifications/      # Notifications module
└── packages/
    ├── shared-types/       # TypeScript interfaces
    ├── shared-utils/       # API client, event bus, hooks
    ├── shared-auth/        # Auth store, guards, provider
    └── shared-ui/          # Design system components
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Development

Start all services (API + Shell + 5 remote modules):

```bash
npm run dev
```

> **Note:** Remote modules use `vite build --watch` + `vite preview` (required by Module Federation). On startup, all remotes are pre-built automatically. The shell waits until all 5 remotes are serving before starting. Wait until you see `[shell] VITE ready` before opening the browser.

Open **http://localhost:5000** in your browser.

| Service            | Port |
|--------------------|------|
| API Server         | 4000 |
| Shell (Host)       | 5000 |
| Auth Module        | 5001 |
| Dashboard Module   | 5002 |
| User Management    | 5003 |
| Analytics Module   | 5004 |
| Notifications      | 5005 |

### Authentication

Create an account at **http://localhost:5000/signup**, then sign in at **http://localhost:5000/login**.

New accounts are registered with the **viewer** role by default. Admin and manager roles are assigned via User Management.

### Production Build

```bash
npm run build
npm run preview
```

## Module Communication

Modules communicate through a typed event bus:

```typescript
import { publishEvent, subscribeEvent } from '@mfd/shared-utils';

// Publish from any module
publishEvent('user:updated', { userId: '123' }, 'user-management');

// Subscribe in shell or other modules
subscribeEvent('user:updated', (event) => {
  console.log(event.payload, event.source);
});
```

## Tech Stack

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 18 + TypeScript               |
| Build           | Vite 6 + Module Federation          |
| Routing         | React Router v6                     |
| Server State    | TanStack Query v5                   |
| Client State    | Zustand (persisted auth)            |
| Styling         | CSS Variables + Design System       |
| Icons           | Lucide React                        |
| API             | Express mock server                 |

## Requirements Compliance

Every requirement from the project specification is implemented. See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full compliance matrix with evidence.

## License

MIT
