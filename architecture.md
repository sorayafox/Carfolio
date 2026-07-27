# Architecture

## System overview

Carfolio is a server-rendered Next.js application with a client-side application shell and SQLite persistence through Prisma.

```text
Browser
  ├─ Server-rendered route: /[section]
  ├─ Client coordination: components/AppShell.tsx
  ├─ Feature UI and forms: components/app-shell/
  ├─ Browser geolocation (optional)
  ├─ Open-Meteo forecast request
  ├─ NHTSA model-level recall request
  ├─ NHTSA vPIC VIN decoding request
  └─ Client-side PDF generation
          │
          ▼
Next.js route handlers
  ├─ /api/vehicle
  ├─ /api/vehicle/active
  ├─ /api/mileage
  ├─ /api/records
  ├─ /api/maintenance/complete
  ├─ /api/ai/status
  └─ /api/ai/chat
          │
          ├─ Prisma Client → SQLite (prisma/dev.db)
          └─ Local Ollama API (127.0.0.1 only)
```

## Application layers

### Routing and server rendering

- `app/page.tsx` redirects to `/dashboard`.
- `app/[section]/page.tsx` validates the requested section, loads the active vehicle and relations, calculates maintenance statuses, and serializes the result into the client shell.
- The route is dynamic so persisted changes appear after refresh.

### Client application

- `components/AppShell.tsx` owns cross-section coordination: navigation, active overlays, shared mutation state, server refreshes, and selection of the current section.
- `components/app-shell/` owns focused client features and presentation, including the dashboard, Conditions, Car Guide, Owner Tools, emergency guidance, and record or vehicle forms. Feature-local state stays with its feature component.
- Stable educational reference content lives outside the shell in domain-oriented `lib/` modules so large knowledge collections do not obscure interaction logic.
- `router.refresh()` reloads server-derived data after a successful mutation.
- Device geolocation is requested only after the user selects **Use my location**.
- The dashboard date refreshes every minute so an open session rolls over correctly.
- Trip and seasonal checklist state is intentionally session-only; saved symptom observations use the records API.
- Service forms reuse the loaded vehicle mileage, current local date, and most recent saved provider as editable client-side defaults; submitted records still persist through the APIs.
- A `help` query parameter opens Quick Help and selects the matching shared emergency topic for verified chat actions.
- The active vehicle is a device-local HTTP-only cookie preference; all authoritative vehicle profiles and records remain in Prisma.

### API routes

- `POST /api/vehicle`: creates a vehicle, starter maintenance records, and its initial timeline event in one transaction, then selects it.
- `PUT /api/vehicle`: validates and updates the active vehicle, then creates a timeline event.
- `POST /api/mileage`: prevents odometer rollback, updates mileage, and creates a timeline event.
- `POST /api/records`: creates supported record types and corresponding timeline events.
- `PATCH /api/records`: updates supported maintenance, concern, or document records and records schedule adjustments on the timeline where applicable.
- `DELETE /api/records`: deletes a supported source record.
- `POST /api/maintenance/complete`: completes one or several items in a transaction, creates individual service records, creates one visit expense, recalculates intervals, and creates one timeline event.
- `POST /api/vehicle/active`: persists the selected vehicle ID in an HTTP-only device-local cookie.
- `GET /api/ai/status`: reports whether the configured local Ollama model is reachable and installed and whether the Toyota manual index is available.
- `POST /api/ai/chat`: validates conversation input, loads a privacy-filtered car snapshot, checks shared in-product guidance first, or performs bounded manual retrieval before requesting a local Ollama response.

### Domain calculations

- `lib/calculations.ts` owns maintenance-status rules and currency formatting used by server logic.
- `lib/health.ts` calculates the transparent weighted health score, category deductions, and remediation summaries from loaded vehicle records.
- `lib/ownership-report-pdf.ts` converts loaded records into a dependency-free PDF byte stream for browser download.
- `lib/manual-search.ts` retrieves a bounded set of relevant Toyota manual pages without loading the full manual or a second AI model into memory.
- `lib/weather-guidance.ts` is the shared source for tire-pressure weather language used by Conditions and local AI.
- `lib/symptom-guidance.ts` and `lib/owner-guidance.ts` feed both visible owner tools and deterministic chat answers. Ollama is reserved for open-ended questions that do not match verified records or shared guidance.
- Date and mileage thresholds should not be duplicated across API routes and pages.

### Shared knowledge and consumers

| Knowledge owner | Primary consumers | Extension rule |
| --- | --- | --- |
| `lib/calculations.ts` | server-loaded maintenance states and maintenance workflows | Change status logic once and protect it with behavior tests |
| `lib/health.ts` | dashboard summary, sidebar health, and health breakdown | Keep one calculated score with transparent category evidence |
| `lib/weather-guidance.ts` | Conditions and verified chat guidance | Keep live forecast selection in Conditions and shared interpretation in the helper |
| `lib/symptom-guidance.ts` | Symptom Navigator and verified chat answers | Add recognized observations to the shared registry before adding surface-specific copy |
| `lib/owner-guidance.ts` | Quick Help and verified chat answers | Add common owner procedures once, with safety boundaries and an official resource |
| Indexed manual pages | manual search and cited local-AI synthesis | Keep retrieval bounded and citations tied to supplied pages |

This is a transfer map, not an exhaustive module inventory. Add a row when a new shared knowledge family has multiple consumers.

### Persistence

- `lib/prisma.ts` exposes a development-safe Prisma singleton.
- `prisma/schema.prisma` defines relational data.
- `prisma/seed.ts` provides the fictional car demo dataset.

## External data

The Conditions page requests forecast data from Open-Meteo. Forecast failure must not affect persisted ownership records or other routes. The default location is the Los Angeles area; precise location is used only with permission and is not persisted.

Owner Tools reads model-level recall results from NHTSA without storing them or presenting them as VIN-specific status. Emergency links point to official Toyota properties. External-service failure must never prevent access to local ownership records.

car chat sends a limited record snapshot and a bounded set of relevant excerpts from Toyota's indexed owner’s manual to Ollama at `127.0.0.1`; it excludes sensitive identity, document, financial, and account data. Retrieval ranks candidates locally and clips selected excerpts before constructing the prompt. The model is unloaded after each response. Answers separate record, manual, and general-education evidence, and manual claims include page citations. Ollama failure must not affect the rest of Carfolio.

Before Ollama is considered, the chat route handles high-value questions already covered by records or shared application guidance. Visible tools and chat consume the same domain modules so future guidance can be added in one place. Responses preserve a stable answer, evidence, source, and optional action contract. Open-ended responses pass a quality gate and return a recoverable error rather than displaying unreliable output.

The one-time `npm run manual:import` script downloads Toyota manual `OM02684U`, extracts text locally with `pypdf`, stores page text in SQLite, and removes the temporary PDF. The application never loads the complete PDF into the model context.

## Report generation

PDF reports are generated in the browser from the already-loaded vehicle record; ownership data is not uploaded to a conversion service. The generator wraps long lines, paginates sections, uses built-in PDF fonts, and includes generation time and page numbers.

## Transaction boundaries

Maintenance completion is atomic. Updates to maintenance items, service records, the aggregated expense, and timeline event either all succeed or all fail.

## Deployment considerations

The current database is a local SQLite file. A multi-device or hosted version requires a durable hosted relational database, authentication, per-user ownership checks, secrets management, and a migration plan. SQLite should not be treated as a horizontally scalable production store.

## Change-impact guide

- New persisted facts: review Prisma, mutation routes, transactions, timeline behavior, `database.md`, and migration needs.
- New calculated guidance: create or extend a shared helper, identify every consumer, and add representative behavior tests.
- New external integration: define failure behavior, privacy boundaries, source labeling, and whether responses persist.
- New UI workflow: define its authoritative data source, empty/error states, accessibility behavior, and direct navigation contract.
- New AI capability: decide whether it is deterministic shared guidance, record retrieval, manual retrieval, or open-ended synthesis before changing prompts.

## Testing

`tests/ai-chat.test.ts` exercises the public chat route directly with Node’s test runner through `tsx`. It protects representative verified fast paths without mocking Carfolio internals or invoking Ollama. Add regression cases as new intent families or safety boundaries are introduced. `npm test` is part of normal validation alongside type checking and the production build.
