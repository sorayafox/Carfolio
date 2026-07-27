# Carfolio

Carfolio is a complete vehicle-ownership dashboard: a digital health record for maintenance, service, observations, costs, documents, mileage, and the full life of a car. The included fictional demo garage contains a dark grey 2024 Toyota Corolla Hybrid named **Kitty**.

## Run locally

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The application uses Next.js App Router, React, Prisma, and a local SQLite database at `prisma/dev.db`. Every create, delete, mileage-update, and service-completion action is handled by a server route and persisted through Prisma.

## Product calculations

### Maintenance status

Each item is evaluated against both the current odometer and today's date. The most urgent result wins:

- **Overdue:** its due mileage or due date has passed.
- **Due Now:** within 100 miles or 7 days.
- **Due Soon:** within 1,000 miles or 30 days.
- **Up to Date:** outside both reminder windows.

Items without one of the two due values are evaluated on the value that exists. Seeded intervals are general estimates and are not a substitute for the exact manufacturer schedule, driving-condition requirements, recalls, or professional advice.

### Next service

The dashboard selects the maintenance item with the lowest upcoming due mileage. Miles remaining are `nextDueMileage - currentMileage`, clamped to zero for display. Completing an item creates a service record, an ownership expense, and a timeline event. The next due mileage is completion mileage plus interval miles; the next due date is completion date plus interval months.

### Ownership duration and mileage

Ownership duration is the elapsed time from purchase date to today, displayed as years and months. Miles driven since purchase are `currentMileage - purchaseMileage`. Mileage cannot be updated to a lower value; a successful update creates a timeline event and all maintenance statuses are recalculated on the next render.

### Warranty

Basic coverage is active only while both the calendar limit and mileage limit have not passed. The demo uses Toyota-style example values (three years / 36,000 miles); actual coverage may differ by component, market, in-service date, and warranty terms.

### Costs

Total tracked cost is the sum of all expense amounts and excludes the vehicle purchase price. Cost by category groups that same set by category. This-year cost filters by the expense year. Average monthly cost divides all tracked costs by elapsed whole ownership months (minimum one month). Completing maintenance automatically adds its actual cost to expenses.

### Expiration reminders

Documents may have an expiration date. The dashboard surfaces registration, insurance, and warranty dates. The intended reminder window is 30 days; records without expiration dates remain valid references and are not treated as expiring.

### Ownership timeline

Timeline events are generated for purchase, mileage updates, new records, completed service, expenses, concerns, and documents. Events are displayed newest first and retain relevant mileage or cost context. Deleting a source record does not delete historical timeline events, preserving the ownership audit trail.

## Assumptions and limitations

- The seed is fictional demonstration data, including providers, identifiers, expenses, and observations.
- Seeded concerns are user-recorded observations or general things to monitor—not confirmed vehicle defects.
- This local-first version has one active vehicle and no authentication, file uploads, cloud sync, tax calculations, fuel-economy telemetry, market valuation service, recall feed, or manufacturer schedule integration.
- Document entries store metadata, not uploaded document files.
- Dates use the runtime's local display timezone; production deployments should define a user timezone.

# Carfolio project documentation

These seven documents answer different questions about the same product:

| Document | Question it answers | What belongs inside |
| --- | --- | --- |
| [Product requirements](prd.md) | Why are we building Carfolio, for whom, and what must it accomplish? | User problem, audience, outcomes, requirements, non-goals, and measurable success criteria. |
| [Feature reference](features.md) | What can the current product do? | User-visible behavior, workflows, calculations, states, and current limitations. |
| [Product design](design.md) | How should Carfolio look and feel? | UX principles, navigation, colors, typography, components, responsive behavior, and accessibility. |
| [Architecture](architecture.md) | How does the application work technically? | Runtime layers, routes, APIs, shared helpers, external services, transactions, and deployment boundaries. |
| [Database design](database.md) | What information is stored, related, or calculated? | Prisma entities, relationships, persistence rules, transactions, derived state, and migration concerns. |
| [Engineering conventions](conventions.md) | How should contributors write and change the code? | Naming, TypeScript practices, API rules, copy standards, styling rules, report requirements, and file hygiene. |
| [Agent guidance](agents.md) | What guardrails must an AI coding agent follow? | Product intent, safety boundaries, preservation rules, validation commands, and non-negotiable UX behavior. |

## Keeping them current

- Change `prd.md` when product scope, audience, outcomes, or success criteria change.
- Change `features.md` whenever visible behavior is added, removed, or materially altered.
- Change `design.md` when navigation, interaction patterns, visual language, or accessibility rules change.
- Change `architecture.md` when data flow, routes, integrations, helpers, or deployment assumptions change.
- Change `database.md` when schema, persistence, calculations, or transaction behavior changes.
- Change `conventions.md` when the team adopts a repeatable implementation rule.
- Change `agents.md` when automated contributors need a new mandatory guardrail.
