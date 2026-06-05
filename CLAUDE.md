# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attender is a Progressive Web App (PWA) for teachers to take classroom attendance on mobile/iPad. Data is persisted server-side using Netlify Blobs, accessed via a Netlify Function API.

## Commands

```bash
npm run dev          # Start Vite + Express concurrently (full local dev)
npm run dev:client   # Start Vite dev server only
npm run dev:server   # Start Express API server only
npm run build        # Type-check + production build
npm start            # Run production server (serves built frontend + API)
npx tsc --noEmit    # Type-check only
```

## Architecture

- **Stack**: React 19 + TypeScript, Vite, vite-plugin-pwa (Workbox)
- **Storage**: SQLite via better-sqlite3, database file at `server/data/attender.db`
- **API**: Express server at `server/index.js` — handles all CRUD routes at `/api/*`
- **Frontend data layer**: `src/db/index.ts` — thin fetch wrapper over the API
- **Routing**: react-router-dom with flat page-based routes in `src/App.tsx`
- **CSV parsing**: papaparse (used for student roster import)
- **Dev proxy**: Vite proxies `/api` requests to Express on port 3001

### Data Model (`src/types/index.ts`)

- `Student` — first/last name, studentId, nickname, note
- `ClassRoom` — name + array of student IDs (roster assignment)
- `AttendanceRecord` — classId + date + array of present student IDs (absent = not in the array)

### API Routes (`server/index.js`)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/students | List all students |
| POST | /api/students | Create/update a student |
| POST | /api/students/batch | Bulk import students |
| DELETE | /api/students/:id | Delete a student |
| GET | /api/classes | List all classes |
| POST | /api/classes | Create/update a class |
| DELETE | /api/classes/:id | Delete a class |
| GET | /api/attendance?classId=&date= | Query attendance records |
| POST | /api/attendance | Create/update attendance |
| DELETE | /api/attendance/:id | Delete attendance record |
| GET | /api/preferences | Get app preferences |
| POST | /api/preferences | Update app preferences |

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
- SQLite with junction tables for array fields (`class_students`, `attendance_students`)
- Express serves built frontend in production (no separate static host needed)
