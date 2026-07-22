# Carfolio Product Requirements

## Summary

Carfolio is a complete vehicle ownership dashboard and digital health record. It combines a vehicle profile, maintenance intelligence, service history, ownership costs, editable document metadata, observations, local driving conditions, vehicle education, trip readiness, recall context, emergency guidance, and portable reporting.

The initial experience is centered on Kitty, a dark-grey 2024 Toyota Corolla Hybrid LE.

## Problem

Vehicle information is fragmented across receipts, dealer portals, calendar reminders, glove-box documents, weather apps, and owner’s manuals. A conventional tracker improves organization but still requires the owner to interpret the information.

Carfolio should answer:

- What does my car need next?
- Is an item healthy, approaching, due, or overdue?
- How does the manufacturer’s schedule differ from my personal records?
- What happened during ownership and how much did it cost?
- What should current weather make me check?
- What does each major vehicle system do, and which warning signs matter?
- Is Kitty ready for the full mileage of a planned trip?
- What should I do first during a common roadside or ownership emergency?

## Product outcomes

1. Reduce missed maintenance and expiration dates.
2. Translate mileage, time, weather, and service history into clear actions.
3. Improve the owner’s working knowledge of their specific vehicle.
4. Produce a trustworthy ownership record that supports repair decisions and resale.
5. Help a first-time owner make safer decisions before a trip or during a common roadside situation.

## Primary user

An everyday vehicle owner who wants to care for their car without becoming a mechanic. The user understands common terms such as mileage and oil change but may not understand hybrid cooling, regenerative brakes, warranty limits, or maintenance intervals.

## Core requirements

### Vehicle profile

Store identity, specifications, purchase data, mileage, seller, notes, and warranty limits. Users can edit the full profile through a persisted form.

### Maintenance intelligence

- CRUD for personal maintenance items.
- Status calculated from current mileage and current date.
- Separate presentation of official manufacturer milestones.
- Single or multi-select completion workflows.
- Completion creates service history, one correctly aggregated expense, and a timeline event.
- Completion recalculates next mileage and date.

### Ownership records

Persist service history, concerns, expenses, editable insurance/registration/document metadata, important dates, and combined timeline events. The dashboard date must reflect the user’s current date and update while the app remains open.

### Health inspection

- Calculate a transparent score from maintenance readiness, open observations, document coverage, and record freshness.
- Explain category weights and deductions and link each deduction to a useful action.
- State that the score reflects saved records, not a physical inspection or live diagnostic feed.

### Conditions

Use local forecast data to provide contextual guidance for tire pressure, traction, visibility, battery stress, fluids, and hybrid cooling. Weather is not presented as sensor data.

### Vehicle education

Provide a searchable, Kitty-specific component guide with:

- What the component is
- Why it matters
- Common warning signs
- Safe owner checks
- Related manufacturer maintenance
- Clear professional-service boundaries

### Owner tools

- Calculate a direct pre-trip mileage verdict against every saved maintenance limit.
- Explain which service limit a planned round trip would cross and by how many miles.
- Provide non-diagnostic symptom guidance that can be persisted as an observation.
- Read model-level recall data from NHTSA and direct users to VIN-specific confirmation.
- Provide seasonal preparation guidance without representing weather as sensor data.
- Export a readable, paginated PDF ownership report.
- Keep Toyota-specific emergency guidance globally accessible without crowding navigation.
- Link safety-critical procedures to official Toyota owner resources, plus NHTSA where appropriate.

## Navigation

The condensed sidebar keeps Overview, My Car, Maintenance, Car Guide, Conditions, and Owner Tools visible. Service history, concerns, expenses, documents, and timeline are grouped under Records. Emergency help remains available through a compact persistent action. Settings remains in the footer.

## Non-goals for the current version

- Diagnostic-code scanning or live vehicle telemetry
- Claims that weather predicts actual tire pressure
- Automated repair diagnosis
- Authentication or multi-user authorization
- Uploaded document binaries
- Market-value guarantees
- Cloud synchronization
- Learning-progress quizzes

## Success criteria

- An owner can identify the next service within ten seconds.
- Maintenance states remain correct after mileage and completion updates.
- A multi-item service visit does not double-count cost.
- Manufacturer and personal schedules are visually distinguishable.
- Every record mutation survives refresh.
- Educational content explains action and risk without overstating certainty.
- All primary flows work on desktop and mobile.
- PDF ownership reports open correctly and preserve readable page structure.
- Pre-trip readiness changes immediately when the planned round-trip mileage crosses a saved service limit.
- The dashboard date rolls over automatically without a code change.
- Emergency guidance is reachable from every section without occupying permanent sidebar space.
