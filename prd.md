# Carfolio Product Requirements

**Purpose:** Defines Carfolio’s users, outcomes, scope, requirements, non-goals, and success criteria.

**DRY:** Keep product intent here; reference feature, design, architecture, and data details from their owning documents instead of repeating them.

## Summary

Carfolio is a complete vehicle ownership dashboard and digital health record. It combines a vehicle profile, maintenance intelligence, service history, ownership costs, editable document metadata, observations, local driving conditions, vehicle education, trip readiness, recall context, emergency guidance, and portable reporting.

The initial experience is centered on car, a dark-grey 2024 Toyota Corolla Hybrid LE.

## Problem

Vehicle information is fragmented across receipts, dealer portals, calendar reminders, glove-box documents, weather apps, and owner’s manuals. A conventional tracker improves organization but still requires the owner to interpret the information.

Carfolio should answer:

- What does my car need next?
- Is an item healthy, approaching, due, or overdue?
- How does the manufacturer’s schedule differ from my personal records?
- What happened during ownership and how much did it cost?
- What should current weather make me check?
- What does each major vehicle system do, and which warning signs matter?
- Is car ready for the full mileage of a planned trip?
- What should I do first during a common roadside or ownership emergency?

## Product outcomes

1. Reduce missed maintenance and expiration dates.
2. Translate mileage, time, weather, and service history into clear actions.
3. Improve the owner’s working knowledge of their specific vehicle.
4. Let the owner ask plain-language questions grounded in car's records, Toyota's official manual, or clearly labeled general education.
5. Produce a trustworthy ownership record that supports repair decisions and resale.
6. Help a first-time owner make safer decisions before a trip or during a common roadside situation.
7. Answer frequent ownership questions quickly without unnecessarily loading a local language model into memory.

## Primary user

An everyday vehicle owner who wants to care for their car without becoming a mechanic. The user understands common terms such as mileage and oil change but may not understand hybrid cooling, regenerative brakes, warranty limits, or maintenance intervals.

## Product truth hierarchy

Carfolio must make the source and certainty of information understandable:

1. **Saved ownership records** describe what the owner entered or completed.
2. **Manufacturer guidance** describes vehicle-specific instructions or schedules and requires an official source.
3. **Carfolio calculations and estimates** interpret saved data but are not manufacturer requirements.
4. **External context** such as forecasts, recall searches, and VIN decoding may change and is not vehicle telemetry.
5. **Mechanical condition** requires physical inspection or diagnostic equipment and is outside the current product.

Future features should fit one of these levels and preserve the distinction in their copy and data model.

## Core requirements

### Vehicle profile

Store identity, specifications, purchase data, mileage, seller, notes, and warranty limits. Users can edit the full profile through a persisted form.

- Support multiple vehicles with one clearly selected active vehicle.
- Keep car's Toyota Corolla Hybrid as the curated product focus; additional vehicles use a neutral VIN setup without model-specific templates.
- Allow official NHTSA VIN lookup to populate available identity fields while requiring the owner to confirm mileage, color, plate, purchase, and ownership information.

### Maintenance intelligence

- CRUD for personal maintenance items.
- Status calculated from current mileage and current date.
- Separate presentation of official manufacturer milestones.
- Single or multi-select completion workflows.
- Completion creates service history, one correctly aggregated expense, and a timeline event.
- Completion recalculates next mileage and date.
- Users can adjust a personal item’s next mileage/date and repeat interval to match a dealer recommendation without changing the official manufacturer reference schedule.
- Service completion and service-history entry should prefill safe, editable values already known to Carfolio: today’s date, current mileage, and the most recently used provider.

### Ownership records

Persist service history, concerns, expenses, editable insurance/registration/document metadata, important dates, and combined timeline events. The dashboard date must reflect the user’s current date and update while the app remains open.

### Health inspection

- Calculate a transparent score from maintenance readiness, open observations, document coverage, and record freshness.
- Explain category weights and deductions and link each deduction to a useful action.
- State that the score reflects saved records, not a physical inspection or live diagnostic feed.
- Present one combined score rather than competing health metrics, while preserving the weighted category breakdown.

### Conditions

Use local forecast data to provide contextual guidance for tire pressure, traction, visibility, battery stress, fluids, and hybrid cooling. Weather is not presented as sensor data.

Weather guidance shared with local AI must come from the same application source so the Conditions page and chatbot do not drift. The Conditions page remains the source for live, location-selected forecast context.

### Local AI assistant

- Answer in plain language using three visible evidence levels: car’s records, Toyota manual, and general explanation.
- Use verified deterministic responses for frequent questions when Carfolio already has the required records or approved guidance.
- Use bounded Toyota-manual retrieval and local Ollama only when a question needs synthesis.
- Check shared Symptom Navigator, Quick Help, weather, trip, maintenance, and record guidance before loading Ollama.
- Answer common safety, symptom, maintenance, and ownership questions from the same guidance sources that power visible tools. The initial intent set is representative and should be expandable without changing the response contract.
- Reject echoed questions, empty responses, unsupported manual evidence, and citations to pages that were not retrieved.
- Provide direct actions into existing Carfolio workflows, such as Conditions, the trip planner, or Maintenance.
- Keep chat history session-only and exclude sensitive ownership fields from model context.
- Keep local-model memory use conservative so the assistant remains practical on consumer hardware.

### Vehicle education

Provide a searchable, car-specific component guide with:

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
- Export a concise, paginated mechanic handoff with only service-relevant vehicle information.
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
- Common brake-pad, pre-trip, and cold-weather PSI questions return verified, useful answers without requiring Ollama.
- Common questions already covered by Carfolio return verified guidance without requiring Ollama and open the relevant existing workflow.
- A verified chat answer can navigate directly to the related existing Carfolio workflow.
- Regression tests protect the public AI response contract.
- A new contributor can identify where a feature’s truth comes from, whether its state persists, and which user workflow owns it.
