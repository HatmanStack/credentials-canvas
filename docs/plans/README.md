# Monorepo Refactor & Automation Plan

## Overview

This plan restructures the credentials-canvas project from a Create React App (CRA) structure into a clean monorepo architecture with Vite as the build tool. The refactor enforces a standardized directory layout, migrates the test infrastructure to Vitest, centralizes all tests, implements full code sanitization, and establishes a robust CI/CD pipeline.

The project is a **frontend-only** React/Three.js 3D portfolio application. There is no backend component. The refactor preserves all existing functionality while modernizing the build toolchain and project organization.

**Current State:** CRA-based React app with `src/` structure, Jest tests colocated in `src/__tests__/`, Tailwind CSS, and no CI pipeline.

**Target State:** Vite-based monorepo with `frontend/`, `docs/`, `tests/` structure, Vitest for testing, centralized test directory, fully sanitized codebase, and GitHub Actions CI.

## Prerequisites

### Required Tools
- **Node.js** v24 LTS (via nvm)
- **npm** v10+
- **Git** v2.40+

### Environment Setup
```bash
nvm use 24
node --version  # Should output v24.x.x
```

### Dependencies to Install
- Vite + React plugin
- Vitest + Testing Library integrations
- ESLint (flat config format)
- Tailwind CSS (Vite-compatible setup)

## Phase Summary

| Phase | Goal | Estimated Tokens |
|-------|------|------------------|
| Phase-0 | Foundation: ADRs, conventions, testing strategy, CI specs | N/A (Reference doc) |
| Phase-1 | CRA → Vite migration, directory restructure, import remediation | ~45,000 |
| Phase-2 | Code sanitization, test migration to Vitest, CI/CD setup, documentation consolidation | ~40,000 |

## Navigation

- [Phase-0: Foundation](./Phase-0.md) - Architecture decisions, conventions, testing strategy
- [Phase-1: Migration & Restructure](./Phase-1.md) - CRA → Vite, directory layout, import updates
- [Phase-2: Sanitization & CI](./Phase-2.md) - Code cleanup, Vitest, GitHub Actions, docs

## Target Directory Structure

```text
credentials-canvas/
├── frontend/                    # All client-side code
│   ├── src/
│   │   ├── assets/             # Static assets (images, audio, video)
│   │   ├── components/         # React components
│   │   ├── constants/          # Configuration constants
│   │   ├── css/                # Custom CSS (animations)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── shaders/            # GLSL shaders
│   │   ├── stores/             # Zustand state stores
│   │   ├── styles/             # Tailwind entry point
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx            # Vite entry point
│   ├── public/                 # Static public assets
│   ├── index.html              # Vite HTML entry
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── tsconfig.json           # TypeScript configuration
├── docs/                        # Consolidated documentation
│   ├── plans/                  # Implementation plans
│   └── README.md               # Full project documentation
├── tests/                       # Centralized test suites
│   ├── frontend/
│   │   ├── hooks/              # Hook tests
│   │   ├── stores/             # Store tests
│   │   └── utils/              # Utility tests
│   ├── helpers/                # Shared test utilities
│   │   ├── storeMocks.ts
│   │   ├── testUtils.tsx
│   │   └── threeMocks.ts
│   └── setup.ts                # Vitest setup file
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── package.json                 # Root orchestration scripts
├── README.md                    # Brief project overview
└── .gitignore
```

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build Tool | Vite | Faster builds, simpler config, better DX |
| Test Runner | Vitest | Native Vite integration, Jest-compatible API |
| Test Location | Centralized `tests/` | Separation of concerns, cleaner source |
| Backend | None | Frontend-only project |
| CI Jobs | Frontend only | No backend to test |
| Sanitization | Full | Strip all comments, no console.* |
| Secrets | None needed | All URLs are public |
