# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attender is a Progressive Web App (PWA) for teachers to take classroom attendance on mobile/iPad. Data is persisted server-side using Netlify Blobs, accessed via a Netlify Function API.

## Commands

```bash
npm run dev          # Start Vite dev server only (no API)
npm run dev:netlify  # Start with Netlify Dev (frontend + functions)
npm run build        # Type-check + production build
npx tsc --noEmit    # Type-check only
```

Use `npm run dev:netlify` for full local development (requires `netlify-cli` installed globally or via npx).

## Architecture

- **Stack**: React 19 + TypeScript, Vite, vite-plugin-pwa (Workbox)
- **Storage**: Netlify Blobs (key-value) accessed via a single Netlify Function
- **API**: `netlify/functions/api.ts` — single function handling all CRUD routes
- **Frontend data layer**: `src/db/index.ts` — thin fetch wrapper over the API
- **Routing**: react-router-dom with flat page-based routes in `src/App.tsx`
- **CSV parsing**: papaparse (used for student roster import)

### Data Model (`src/types/index.ts`)

- `Student` — first/last name, studentId, nickname, note
- `ClassRoom` — name + array of student IDs (roster assignment)
- `AttendanceRecord` — classId + date + array of present student IDs (absent = not in the array)

### API Routes (`netlify/functions/api.ts`)

| Method | Path | Description |
|--------|------|-------------|
| GET | /students | List all students |
| POST | /students | Create/update a student |
| POST | /students/batch | Bulk import students |
| DELETE | /students/:id | Delete a student |
| GET | /classes | List all classes |
| POST | /classes | Create/update a class |
| DELETE | /classes/:id | Delete a class |
| GET | /attendance?classId=&date= | Query attendance records |
| POST | /attendance | Create/update attendance |
| DELETE | /attendance/:id | Delete attendance record |

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
- Netlify Blobs store each record as a JSON blob keyed by its UUID
