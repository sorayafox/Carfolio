# Feature Reference

**Purpose:** Records Carfolio’s current user-visible capabilities, workflows, calculations, states, and limitations.

**DRY:** Describe current behavior here and link to product, design, architecture, or database rules instead of duplicating them.

## State and source legend

- **Persisted:** authoritative ownership data stored through Prisma and retained after refresh.
- **Calculated:** derived from current records and time; recalculated rather than stored as truth.
- **Session-only:** temporary planning or conversation state that resets with the browser session.
- **Device-local:** a preference stored for this browser or device, not a vehicle fact.
- **External:** fetched context that may change and is not saved unless a user explicitly creates a record.
- **Generated:** an export created locally from already-loaded records.

Use these categories when adding features so users and contributors understand what Carfolio remembers.

## Overview dashboard

Shows the active vehicle’s current mileage, ownership duration, miles since purchase, estimated value range, next service, warranty, tracked costs, recent activity, maintenance outlook, and unresolved observations. The greeting date uses the current local date and refreshes while the app remains open. The value range is a clearly labeled Carfolio depreciation estimate based on the saved purchase price, vehicle age, and miles driven—not current listings or a live market appraisal.

The first decision surface is **Today’s priority**, which compares maintenance and unresolved observations. Urgent or high-severity safety observations outrank routine maintenance; otherwise the most time-sensitive saved maintenance item leads. It confirms when no saved item currently needs action.

The greeting stays intentionally concise; the record-based qualification and combined-score explanation appear in supporting copy rather than inside the greeting sentence.

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
- Multi-vehicle garage with a persisted active-vehicle preference
- Guided VIN setup without model-specific starter templates
- Official NHTSA vPIC VIN decoding for available identity fields
- Clear decoded-versus-owner-entered labels and editable Carfolio starter maintenance estimates

## Local AI questions about car

- Detects the locally installed Ollama model without making AI availability a requirement for normal Carfolio use
- Answers questions using a privacy-filtered snapshot of car's saved maintenance, recent service, and unresolved observations
- Searches an indexed official Toyota owner’s manual and sends only a bounded set of relevant excerpts to the configured local model
- Uses three visible evidence levels: car's records, Toyota manual with page citations, and general explanation
- Returns verified instant answers for common brake-pad, pre-trip, and cold-weather PSI questions without loading Ollama
- Reuses Symptom Navigator guidance for recognized owner observations, with safe escalation language and a direct navigator action
- Reuses Quick Help guidance for recognized roadside and routine-owner questions before Ollama, returning deterministic safety guidance and an in-app action
- Quick Help chat actions open the drawer on the requested topic through a `help` query parameter
- Recognizes PSI intent even when “tires” is misspelled and reuses the Conditions page’s shared weather guidance
- Rejects empty, echoed, or unsupported answers instead of displaying a misleading response
- Offers contextual actions that open Conditions, the pre-trip planner, or Maintenance
- Opens the pre-trip planner directly through `/owner-tools?tool=trip`
- Keeps chat history in the current browser session rather than persisting it as an ownership record
- Excludes VIN, plate, documents, costs, seller, insurance, registration, and account data from the model context
- Treats owner observations as unconfirmed, avoids diagnosis, and defers unverified Toyota-specific claims to the official manual or a qualified professional
- Unloads the model after each response to reduce memory pressure on consumer hardware
- Provides a readable responsive drawer with evidence chips, verified-response labels, keyboard controls, retryable errors, explicit loading state, and reduced-motion support

## Maintenance

- Personal maintenance schedule with mileage and calendar intervals
- Status colors and labels
- Toyota factory milestone panel with official-guide link
- Create and delete maintenance items
- Complete one item or select several for one service visit
- Shared date, mileage, provider, and total visit cost for bulk completion
- Current date and mileage plus the most recently used provider are reused as smart defaults for service entry
- Individual service records with evenly allocated cost and one aggregated expense
- Automatic next-due calculations
- Per-item schedule adjustment for dealer-recommended next mileage/date and repeat intervals, without marking service complete or changing the separate Toyota factory guide
- Adjustment source notes and a timeline event explaining the personal schedule change
- Decision-oriented cards grouped into Needs attention and Planned care
- Source badges and expandable “Why this status?” calculations

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
- Shared tire-pressure guidance used consistently by the Conditions page and local AI; live forecast interpretation remains on the Conditions page

## Know Your Car

Searchable and filterable guide to car’s hybrid system, engine, brakes, tires, cooling systems, 12-volt battery, eCVT, suspension, and filters. Each topic includes a first-owner explanation, physical location, purpose, normal behavior, warning signs, safe owner checks, car-specific design details, common mistakes, expert longevity tips, vocabulary definitions, and its maintenance-schedule connection. Deeper information uses expandable sections to preserve scannability.

## Settings

Presents reminder and display preferences and explains local data ownership. Some preference controls are currently presentation-only and should be persisted before expansion.

Settings controls that do not yet persist must not be presented as durable preferences.

## Owner Tools

The landing view starts with situation-based questions—planning a trip, noticing something unusual, preparing for weather, checking recalls, or visiting a mechanic—before revealing the selected tool.

- Pre-trip readiness accepts the complete round-trip mileage, calculates the projected odometer, and returns a ready, caution, or service-first verdict against every saved maintenance mileage limit.
- It names affected services, shows miles remaining or beyond the limit, and keeps physical checks session-only.
- Symptom navigator uses a three-step flow: choose what changed, choose a specific symptom, then record its driving context, frequency, and notes. Each specific symptom has its own severity, stop/continue guidance, mechanic-friendly capture tips, and a persisted observation workflow.
- Recall lookup uses NHTSA's public vehicle recall API and links to the definitive VIN search.
- Seasonal preparation covers heat, rain, cold, smoke, and dust context.
- Ownership reports export a mechanic-focused service brief containing vehicle identity, current mileage, due/upcoming maintenance, unresolved observations, and recent service history. Expenses, personal documents, purchase history, and general timeline events are intentionally excluded.
- A persistent emergency guide covers hybrid 12V jump starting, flat tires, tire inflation, washer fluid, and oil-change safety with ordered steps and official Toyota resources.
- Toyota Quick Help and chat read their common procedures from `lib/owner-guidance.ts`; the Symptom Navigator and chat share sound guidance from `lib/symptom-guidance.ts`.

## Capability ownership summary

| Capability | State/source |
| --- | --- |
| Vehicle, maintenance, service, observations, expenses, documents, and timeline | Persisted |
| Maintenance status, ownership metrics, estimated value, and combined health | Calculated |
| Active vehicle selection | Device-local preference |
| Chat conversation, trip inputs, and temporary checklists | Session-only |
| Weather, model-level recalls, and VIN decoding | External |
| Mechanic service brief | Generated locally |
