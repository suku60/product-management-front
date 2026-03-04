# Store Manager Pro

A professional frontend architecture demonstration built with Next.js, React, TypeScript, and Redux Toolkit. This project simulates an enterprise store and product management system, designed to showcase scalable frontend architecture, clean code principles, and senior-level engineering decisions.

---

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # run all tests
npm run storybook # http://localhost:6006
```

---

## Architecture Overview

The project uses a **feature-based architecture** — code is co-located by domain, not by technical role. This means each feature is a self-contained vertical slice: types, state, hooks, components, utilities, and tests all live together.

```
src/
├── app/                   # Next.js App Router pages (thin — just render views)
│   ├── dashboard/
│   ├── products/[id]/
│   └── stores/[id]/
│
├── features/              # Domain features — each is a vertical slice
│   ├── products/
│   │   ├── components/    # React components (pure UI, no business logic)
│   │   ├── hooks/         # Custom hooks (bridge between state and UI)
│   │   ├── store/         # Redux slice + memoized selectors
│   │   ├── types/         # Feature-specific types (re-exported via shared)
│   │   ├── utils/         # Pure functions — easily testable
│   │   └── tests/         # Co-located unit tests
│   ├── stores/
│   └── dashboard/
│
├── shared/
│   ├── components/        # Reusable UI components (Badge, Button, Table, etc.)
│   ├── hooks/             # Cross-feature hooks
│   ├── styles/            # Design tokens + global CSS reset
│   ├── types/             # Global domain types (Product, Store, API shapes)
│   └── utils/             # Cross-feature utilities
│
├── store/                 # Redux store setup + typed hooks
├── services/api/          # API client (pure async functions, no state)
└── tests/                 # Global test setup
```

---

## Key Technical Decisions

### 1. Redux Toolkit with Entity Adapter

Products use a standard slice with async thunks. Stores use `createEntityAdapter` — normalizing the store collection gives O(1) lookups by ID, avoids duplication, and mirrors production patterns for REST resource management.

The `RootState` and `AppDispatch` types are inferred directly from the store, never manually declared.

### 2. Memoized Selectors (Reselect via RTK)

All derived state — filtered products, sorted lists, enriched detail views — lives in `createSelector` selectors. Components never contain filter/sort logic. This guarantees:

- Derived data is only recomputed when its inputs change
- Selector logic is independently testable
- Components stay dumb and fast

### 3. Separation of Data and UI

**Services** (`src/services/api/`) are pure async functions. They know nothing about Redux, React, or UI state. They can be tested, mocked, or swapped independently.

**Hooks** are the only place state and UI connect. A component calls `useProducts()` and gets back data + handlers — it never calls `useDispatch` directly or knows which slice it's talking to.

**Reducers** contain only state transitions. No API calls, no side effects.

### 4. React Query for Dashboard KPIs

The dashboard uses React Query instead of Redux for its data. This was intentional: KPI data is read-only, cache-heavy, and doesn't need to be shared across features. React Query's `select` transform computes KPIs directly at the query level, keeping the hook lean.

Redux is used where mutable, shared, or cross-feature state is needed (products list, filters, stores CRUD). React Query is used where you just need fresh remote data.

### 5. TypeScript Strict Mode

`noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, and `noUncheckedIndexedAccess` are all enabled. `any` is banned via ESLint. Types flow from the API boundary inward — the `Product` type mirrors the dummyjson response exactly, and derived types (`ProductSummary`, `ProductKPIs`) are computed from it.

### 6. CSS Modules + Design Tokens

No utility-first CSS framework. Instead, a single `tokens.css` file defines all design primitives (colors, spacing, typography, shadows, borders) as CSS custom properties. Components consume tokens directly — this makes global theme changes a one-line edit.

---

## State Architecture

```
API (dummyjson.com)
      │
      ▼
services/api/products.api.ts   ← pure fetch functions
      │
      ▼
features/products/store/       ← Redux slice (async thunks)
      │
      ▼
features/products/store/       ← Memoized selectors
products.selectors.ts
      │
      ▼
features/products/hooks/       ← Custom hooks (UI ↔ state bridge)
useProducts.ts
      │
      ▼
features/products/components/  ← Pure UI
ProductsView.tsx
```

Stores follow the same pattern but are local (mocked data, no API).

---

## Testing Strategy

Tests live next to the code they test (`feature/tests/`). The testing pyramid:

| Layer | What's tested | Tools |
|---|---|---|
| Utils | Pure business logic | Jest |
| Reducers | State transitions | Jest |
| Selectors | Derived state correctness | Jest |
| Hooks | State + dispatch integration | RTL + mock store |
| Components | Render + interaction | RTL |

API calls are mocked with `msw` (Mock Service Worker) for integration tests.

Run coverage with `npm run test:coverage`. Minimum threshold: 70% on all metrics.

---

## Extending This Project

### Adding a new feature

1. Create `src/features/your-feature/` with the standard structure
2. Add types to `src/shared/types/` if they're shared
3. Add a slice to `src/store/index.ts`
4. Create a view component and wire up a route in `src/app/`

### Adding business rules (future)

The architecture is ready for:

- **Store-scoped product restrictions**: Add a `storeId` selector that cross-references `assignedCategories` with the product catalog. No component changes required.
- **Role-based access**: Add a `auth` slice. Extend `StorePermissions` in `store.types.ts`. Gates can be added at the hook level without touching UI components.
- **Discount rules per store**: Add a `discountRules` field to `Store`. Update `computeFinalPrice` in `product.utils.ts` to accept an optional rule set.
- **Real API for stores**: Replace `store.mocks.ts` with an API module in `services/api/`. Swap the initial state seed and add async thunks to the slice.

---

## Trade-offs

**Redux Toolkit over Zustand**: More boilerplate, but RTK's DevTools, `createEntityAdapter`, and `createSelector` justify the overhead at this scale. For a smaller project, Zustand would be the right choice.

**CSS Modules over Tailwind**: Requires more file surface area, but gives cleaner separation between structure and style, avoids class soup in JSX, and is more maintainable by non-JS-centric designers.

**No server components for data fetching**: Products are fetched client-side via Redux thunks. A production app would likely use Server Components + React Query for initial data, with Redux only for mutation-heavy shared state. The current approach prioritizes demonstrating Redux patterns.

**Local store data**: The stores feature uses mocked data seeded directly into Redux. This was an explicit decision to demonstrate `createEntityAdapter` and complex local state without requiring a backend.
