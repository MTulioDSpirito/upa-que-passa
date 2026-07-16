# Tasks for Admin Portal Refactoring

- [x] Create hooks under `src/app/admin/_hooks/`
  - [x] `usePendingSugestoes.ts`
  - [x] `useAdminUsers.ts`
- [x] Create components under `src/app/admin/_components/`
  - [x] `Sidebar.tsx`
  - [x] `DashboardTab.tsx`
  - [x] `GamesTab.tsx`
  - [x] `ReviewsTab.tsx`
  - [x] `UsersTab.tsx`
  - [x] `MarketplaceTab.tsx`
  - [x] `NewsTab.tsx`
  - [x] `NotBuiltTab.tsx`
- [x] Simplify `AdminDashboardClient.tsx` using the new components and hooks
- [ ] Verify the refactoring (run `npm run build` or dev server check)
