# Database Design

**Purpose:** Defines persisted entities, relationships, calculated state, transaction behavior, and migration constraints.

**DRY:** Keep data ownership and persistence rules here and link to architecture or feature documentation instead of repeating them.

## Storage

Carfolio uses SQLite through Prisma. The local database URL is configured through `DATABASE_URL`; the development file is `prisma/dev.db` and is ignored by Git.

## Data ownership boundaries

| State class | Examples | Authority |
| --- | --- | --- |
| Persisted vehicle records | profile, maintenance, service, observations, expenses, documents, timeline | Prisma and SQLite |
| Persisted reference corpus | manual document metadata and indexed pages | Prisma and the official imported source |
| Calculated state | maintenance status, health score, ownership metrics, trip verdict | shared application logic over current inputs |
| Device-local preference | active vehicle selection | HTTP-only cookie |
| Session-only state | chat conversation, trip distance, temporary checks | React state |
| External transient context | forecast, recall search, VIN decoding | external provider response |
| Generated output | mechanic PDF | browser download from loaded records |

Moving a feature from one class to another is an architectural change. Document retention, migration, privacy, and authorization implications before implementing it.

## Entity relationships

```text
Vehicle
  ├─ MaintenanceItem
  │    └─ ServiceRecord (optional relation)
  ├─ ServiceRecord
  ├─ Concern
  ├─ Expense
  ├─ Document
  └─ TimelineEvent

ManualDocument
  └─ ManualPage
```

All child records belong to a vehicle and use cascading deletion from the vehicle. Deleting a maintenance item sets its relationship on existing service records to null so service history remains intact.

## Models

### Vehicle

Stores nickname, year, make, model, trim, color, VIN, plate, fuel type, transmission, purchase details, current mileage, seller, notes, warranty limits, and timestamps. VIN is unique.

Multiple `Vehicle` rows can coexist. The selected active vehicle is a UI preference stored in a cookie rather than a vehicle fact. Creating a vehicle also creates editable starter maintenance items and an initial timeline event in one transaction.

### MaintenanceItem

Stores title, category, description, optional mileage/month intervals, last completion values, next due values, estimated cost, and notes. Status is calculated rather than persisted so it cannot become stale.

The owner may override `nextDueMileage`, `nextDueDate`, and future repeat intervals when a dealer supplies a different recommendation. This updates the personal `MaintenanceItem` only; manufacturer guide content remains application reference material. The source or reason can be stored in `notes`, and the adjustment creates a `TimelineEvent`.

### ServiceRecord

Stores service identity, category, date, mileage, provider, actual cost, description, notes, and optional maintenance-item relationship.

### Concern

Stores title, category, severity, symptoms, first-noticed date and mileage, status, mechanic notes, and optional resolution date.

### Expense

Stores title, category, amount, date, optional mileage, vendor, and notes.

### Document

Stores document metadata: title, type, issue date, optional expiration, provider, optional reference number, and notes. It does not store file bytes.

### TimelineEvent

Stores event type, title, description, date, optional mileage, and optional amount. It acts as a durable ownership audit trail.

### ManualDocument and ManualPage

`ManualDocument` records the official Toyota manual code, title, source URL, import time, and indexed page count. `ManualPage` stores extracted text and the original one-based PDF page number. This reference corpus is separate from car's ownership records and supports low-memory, page-cited retrieval. The PDF itself is not retained in the repository or database.

Chat messages, evidence labels, verified-answer actions, model responses, and answer-quality results are not stored. The drawer keeps conversation state only in React for the current page session. Verified answers read current Prisma records at request time and shared application registries at runtime, so mileage, maintenance, symptom, and Quick Help guidance do not require duplicate cache tables.

## Calculated state

Maintenance status is derived from `Vehicle.currentMileage`, the current date, and each item’s next due values:

- Overdue when mileage or date has passed.
- Due Now within 100 miles or seven days.
- Due Soon within 1,000 miles or 30 days.
- Up to Date otherwise.

The most urgent mileage/date result wins.

The pre-trip verdict is calculated rather than stored. It adds the entered round-trip distance to `Vehicle.currentMileage` and compares the projected odometer with each `MaintenanceItem.nextDueMileage`. Physical checklist completion and seasonal selections are temporary planning state, not authoritative records.

The health score is derived from maintenance, concerns, documents, mileage freshness, and timestamps. It is not stored or represented as a diagnosis.

## Completion behavior

Completing maintenance uses one Prisma transaction:

1. Update each selected maintenance item.
2. Add the interval to completion mileage and/or date.
3. Create one service record per item.
4. Create one expense for the visit so cost is not double-counted.
5. Allocate the visit cost evenly across service records for reporting.
6. Create one timeline event summarizing the visit.

## Seed data

`prisma/seed.ts` resets and recreates a fictional demo vehicle named car and associated records. Running it deletes existing local records; it must not be used casually against user data.

## Known limitations and future migrations

- Monetary values currently use floating-point columns. A production financial migration should store integer cents.
- There is no `User` or ownership/authorization model.
- Manufacturer schedule and education content remain application content rather than normalized database records. Local chat messages are session-only and are not persisted.
- Verified chat templates and shared owner guidance are application code, not database rows. New guidance families can extend these registries without a schema migration. They may read current records but do not modify them; saving an observation remains an explicit records API action.
- Manual text search is lexical rather than semantic; differently phrased questions may need improved query expansion in a future version.
- Weather location is not persisted.
- Recall responses, trip inputs, and seasonal checklist state are not persisted.
- Generated PDFs are downloaded by the browser and are not stored in SQLite.
- Documents contain metadata only.
- Hosted multi-user operation requires migration from a local SQLite file to a durable hosted database and per-vehicle authorization.
