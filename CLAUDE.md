# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attender is a Progressive Web App (PWA) for teachers to take classroom attendance on mobile/iPad. All data is stored locally in IndexedDB — there is no backend server.

## Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Type-check + production build
npx tsc --noEmit # Type-check only
```

## Architecture

- **Stack**: React 19 + TypeScript, Vite, vite-plugin-pwa (Workbox)
- **Storage**: IndexedDB via `idb` library — see `src/db/index.ts` for all data access
- **Routing**: react-router-dom with flat page-based routes in `src/App.tsx`
- **CSV parsing**: papaparse (used for student roster import)
- **No backend** — the app is fully client-side and offline-capable

### Data Model (`src/types/index.ts`)

- `Student` — first/last name, studentId, nickname, note
- `ClassRoom` — name + array of student IDs (roster assignment)
- `AttendanceRecord` — classId + date + array of present student IDs (absent = not in the array)

### Page Structure (`src/pages/`)

| Page | Purpose |
|------|---------|
| Home | Navigation hub |
| Students | CRUD + CSV import for student roster |
| Classes | Create classes, assign students from roster |
| Attendance | Select class + date, tap students to mark present |
| Reports | Per-class attendance grid with CSV export |

### Key Design Decisions

- Attendance defaults all students to **absent**; teacher taps to mark present
- PWA configured with `registerType: 'autoUpdate'` — service worker updates silently
- CSS is a single `src/index.css` file with mobile-first, touch-friendly sizing
- No component library — plain CSS with CSS custom properties for theming
- Icons in `public/` need real 192px and 512px PNG files for full PWA install support
