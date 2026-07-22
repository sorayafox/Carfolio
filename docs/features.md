# Feature Reference

## Overview dashboard

Shows Kitty’s current mileage, ownership duration, miles since purchase, next service, warranty, tracked costs, recent activity, maintenance outlook, and unresolved observations. The greeting date uses the current local date and refreshes while the app remains open.

## Health inspection

- Clickable health summary in the sidebar
- Weighted score calculated from maintenance readiness (45%), open observations (25%), coverage/documents (15%), and record freshness (15%)
- Transparent category scores, deductions, and direct remediation links
- Prioritized next actions and a separate physical owner-inspection checklist
- Explicit warning that the score reflects recorded data rather than live mechanical diagnostics

## Garage and vehicle profile

- Active vehicle card with profile image
- Complete editable vehicle identity and ownership form
- Purchase, mileage, seller, warranty, and notes
- Important document dates
- Profile edits persisted through Prisma and recorded on the timeline

## Maintenance

- Personal maintenance schedule with mileage and calendar intervals
- Status colors and labels
- Toyota factory milestone panel with official-guide link
- Create and delete maintenance items
- Complete one item or select several for one service visit
- Shared date, mileage, provider, and total visit cost for bulk completion
- Individual service records with evenly allocated cost and one aggregated expense
- Automatic next-due calculations

## Service history

Chronological persisted service records with date, mileage, provider, category, cost, description, notes, and optional relationship to a maintenance item.

## Things to watch

Tracks user observations with severity, status, symptoms, first-noticed date and mileage, mechanic notes, and resolution date. Seeded observations are explicitly not confirmed defects.

## Expenses

Tracks maintenance, repair, fuel, insurance, registration, accessories, parking, and other ownership costs. Displays totals, yearly cost, monthly average, categories, and recent expenses.

## Documents

Tracks metadata for registration, insurance, warranties, agreements, receipts, and inspections. Supports adding and editing issue dates, expiration dates, providers, reference numbers, and notes. Files themselves are not uploaded.

## Ownership timeline

Combines purchases, mileage updates, services, expenses, concerns, documents, and profile changes into a newest-first ownership history.

## Drive Conditions

- Default regional forecast with optional browser geolocation
- Current temperature, humidity, wind, rain chance, and five-day outlook
- Tire-pressure context based on temperature change
- Traction, visibility, battery, coolant, and hybrid intake guidance
- Explicit distinction between forecasts and vehicle sensor measurements

## Know Your Car

Searchable and filterable guide to Kitty’s hybrid system, engine, brakes, tires, cooling systems, 12-volt battery, eCVT, suspension, and filters. Each topic includes a first-owner explanation, physical location, purpose, normal behavior, warning signs, safe owner checks, Kitty-specific design details, common mistakes, expert longevity tips, vocabulary definitions, and its maintenance-schedule connection. Deeper information uses expandable sections to preserve scannability.

## Settings

Presents reminder and display preferences and explains local data ownership. Some preference controls are currently presentation-only and should be persisted before expansion.
## Owner Tools

- Pre-trip readiness accepts the complete round-trip mileage, calculates the projected odometer, and returns a ready, caution, or service-first verdict against every saved maintenance mileage limit.
- It names affected services, shows miles remaining or beyond the limit, and keeps physical checks session-only.
- Symptom navigator gives urgency-based, non-diagnostic guidance and can save an observation to Things to Watch.
- Recall lookup uses NHTSA's public vehicle recall API and links to the definitive VIN search.
- Seasonal preparation covers heat, rain, cold, smoke, and dust context.
- Ownership reports export vehicle identity, maintenance, service, observations, expenses, documents, and timeline as a locally generated, paginated PDF with page numbers and disclaimers.
- A persistent emergency guide covers hybrid 12V jump starting, flat tires, tire inflation, washer fluid, and oil-change safety with ordered steps and official Toyota resources.
