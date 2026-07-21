# Carfolio Product Requirements

## Summary

Carfolio is a complete vehicle ownership dashboard and digital health record. It combines a vehicle profile, maintenance intelligence, service history, ownership costs, documents, observations, local driving conditions, and plain-language vehicle education.

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

## Product outcomes

1. Reduce missed maintenance and expiration dates.
2. Translate mileage, time, weather, and service history into clear actions.
3. Improve the owner’s working knowledge of their specific vehicle.
4. Produce a trustworthy ownership record that supports repair decisions and resale.

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

Persist service history, concerns, expenses, document metadata, important dates, and combined timeline events.

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

## Navigation

The condensed sidebar keeps Overview, My Car, Maintenance, Car Guide, and Conditions visible. Service history, concerns, expenses, documents, and timeline are grouped under Records. Settings remains in the footer.

## Non-goals for the current version

- Diagnostic-code scanning or live vehicle telemetry
- Claims that weather predicts actual tire pressure
- Automated repair diagnosis
- Manufacturer recall ingestion
- Authentication or multi-user authorization
- Uploaded document binaries
- Market-value guarantees
- Cloud synchronization

## Success criteria

- An owner can identify the next service within ten seconds.
- Maintenance states remain correct after mileage and completion updates.
- A multi-item service visit does not double-count cost.
- Manufacturer and personal schedules are visually distinguishable.
- Every record mutation survives refresh.
- Educational content explains action and risk without overstating certainty.
- All primary flows work on desktop and mobile.

