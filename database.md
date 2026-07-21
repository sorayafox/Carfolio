# Database Design

## Storage

Carfolio uses SQLite through Prisma. The local database URL is configured through `DATABASE_URL`; the development file is `prisma/dev.db` and is ignored by Git.

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
```

All child records belong to a vehicle and use cascading deletion from the vehicle. Deleting a maintenance item sets its relationship on existing service records to null so service history remains intact.

## Models

### Vehicle

Stores nickname, year, make, model, trim, color, VIN, plate, fuel type, transmission, purchase details, current mileage, seller, notes, warranty limits, and timestamps. VIN is unique.

### MaintenanceItem

Stores title, category, description, optional mileage/month intervals, last completion values, next due values, estimated cost, and notes. Status is calculated rather than persisted so it cannot become stale.

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

## Calculated state

Maintenance status is derived from `Vehicle.currentMileage`, the current date, and each item’s next due values:

- Overdue when mileage or date has passed.
- Due Now within 100 miles or seven days.
- Due Soon within 1,000 miles or 30 days.
- Up to Date otherwise.

The most urgent mileage/date result wins.

## Completion behavior

Completing maintenance uses one Prisma transaction:

1. Update each selected maintenance item.
2. Add the interval to completion mileage and/or date.
3. Create one service record per item.
4. Create one expense for the visit so cost is not double-counted.
5. Allocate the visit cost evenly across service records for reporting.
6. Create one timeline event summarizing the visit.

## Seed data

`prisma/seed.ts` resets and recreates a fictional demo vehicle named Kitty and associated records. Running it deletes existing local records; it must not be used casually against user data.

## Known limitations and future migrations

- Monetary values currently use floating-point columns. A production financial migration should store integer cents.
- There is no `User` or ownership/authorization model.
- Manufacturer schedule content and education content are currently application content, not normalized database records.
- Weather location is not persisted.
- Documents contain metadata only.
- Hosted multi-user operation requires migration from a local SQLite file to a durable hosted database and per-vehicle authorization.

