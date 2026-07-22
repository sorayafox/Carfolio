# Architecture

## System overview

Carfolio is a server-rendered Next.js application with a client-side application shell and SQLite persistence through Prisma.

```text
Browser
  ├─ Server-rendered route: /[section]
  ├─ Client UI and forms: components/AppShell.tsx
  ├─ Browser geolocation (optional)
  ├─ Open-Meteo forecast request
  ├─ NHTSA model-level recall request
  └─ Client-side PDF generation
          │
          ▼
Next.js route handlers
  ├─ /api/vehicle
  ├─ /api/mileage
  ├─ /api/records
  └─ /api/maintenance/complete
          │
          ▼
Prisma Client → SQLite (prisma/dev.db)
```

## Application layers

### Routing and server rendering

- `app/page.tsx` redirects to `/dashboard`.
- `app/[section]/page.tsx` validates the requested section, loads the active vehicle and relations, calculates maintenance statuses, and serializes the result into the client shell.
- The route is dynamic so persisted changes appear after refresh.

### Client application

- `components/AppShell.tsx` contains navigation, section presentation, modal forms, weather loading, education content, and client interactions.
- `router.refresh()` reloads server-derived data after a successful mutation.
- Device geolocation is requested only after the user selects **Use my location**.
- The dashboard date refreshes every minute so an open session rolls over correctly.
- Trip and seasonal checklist state is intentionally session-only; saved symptom observations use the records API.

### API routes

- `PUT /api/vehicle`: validates and updates the active vehicle, then creates a timeline event.
- `POST /api/mileage`: prevents odometer rollback, updates mileage, and creates a timeline event.
- `POST /api/records`: creates supported record types and corresponding timeline events.
- `DELETE /api/records`: deletes a supported source record.
- `POST /api/maintenance/complete`: completes one or several items in a transaction, creates individual service records, creates one visit expense, recalculates intervals, and creates one timeline event.

### Domain calculations

- `lib/calculations.ts` owns maintenance-status rules and currency formatting used by server logic.
- `lib/health.ts` calculates the transparent weighted health score, category deductions, and remediation summaries from loaded vehicle records.
- `lib/ownership-report-pdf.ts` converts loaded records into a dependency-free PDF byte stream for browser download.
- Date and mileage thresholds should not be duplicated across API routes and pages.

### Persistence

- `lib/prisma.ts` exposes a development-safe Prisma singleton.
- `prisma/schema.prisma` defines relational data.
- `prisma/seed.ts` provides the fictional Kitty demo dataset.

## External data

The Conditions page requests forecast data from Open-Meteo. Forecast failure must not affect persisted ownership records or other routes. The default location is the Los Angeles area; precise location is used only with permission and is not persisted.

Owner Tools reads model-level recall results from NHTSA without storing them or presenting them as VIN-specific status. Emergency links point to official Toyota properties. External-service failure must never prevent access to local ownership records.

## Report generation

PDF reports are generated in the browser from the already-loaded vehicle record; ownership data is not uploaded to a conversion service. The generator wraps long lines, paginates sections, uses built-in PDF fonts, and includes generation time and page numbers.

## Transaction boundaries

Maintenance completion is atomic. Updates to maintenance items, service records, the aggregated expense, and timeline event either all succeed or all fail.

## Deployment considerations

The current database is a local SQLite file. A multi-device or hosted version requires a durable hosted relational database, authentication, per-user ownership checks, secrets management, and a migration plan. SQLite should not be treated as a horizontally scalable production store.
