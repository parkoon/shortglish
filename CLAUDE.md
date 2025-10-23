# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
yarn dev          # Start development server (Vite)
yarn build        # Type check and build for production
yarn preview      # Preview production build locally
yarn lint         # Run ESLint on .js,.jsx,.ts,.tsx files
yarn format       # Format code with Prettier
```

### Testing
No test commands configured yet. When implementing tests, add the test runner configuration and update this section.

## Architecture

This is a React SPA built with Vite, using TypeScript and TailwindCSS with a mobile-first approach.

### Key Architectural Decisions

1. **Feature-Based Organization**: Use the `src/features/` directory for feature modules. Each feature should be self-contained with its own components, hooks, and logic.

2. **Component Library**: Uses shadcn/ui components (in `src/components/ui/`) built on Radix UI primitives. Components use CVA for variant management. When adding new base components, follow the shadcn/ui pattern.

3. **Routing**: React Router with lazy loading. Routes are defined in `src/config/paths.ts` and loaded in `src/app/router.tsx`. All routes use code splitting via dynamic imports.

4. **State Management**:
   - Server state: TanStack React Query with 1-minute stale time, no retries, no window focus refetch
   - Local state: React hooks

5. **Provider Structure**: Global providers are composed in `src/app/provider.tsx`:
   - QueryClientProvider (React Query)
   - ErrorBoundary (error handling)
   - HelmetProvider (SEO)
   - Toaster (notifications via Sonner)

6. **Mobile-First Design**: All content is wrapped in `MobileOnlyLayout`. This is a mobile-only application by design.

### Code Style

- ESLint with React hooks rules and import sorting
- Prettier with: single quotes, no semicolons, 100-char line width, trailing commas
- Path alias: `@/*` maps to `src/*`
- Import sorting is automatic via ESLint

### Important Patterns

- Use `cn()` utility from `src/lib/utils.ts` for combining Tailwind classes
- Error boundaries catch and display errors with custom fallback UI
- All page components should be lazy loaded in the router
- TailwindCSS with CSS variables for theming (defined in `src/index.css`)
- Component file names use kebab-case (e.g., `video-card.tsx`, `category-tabs.tsx`)
- Prefer `type` over `interface` for type definitions
- YouTube clone components are organized in `src/components/youtube/`