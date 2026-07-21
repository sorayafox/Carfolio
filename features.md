# Feature Reference

## Overview dashboard

Shows Kitty’s current mileage, ownership duration, miles since purchase, next service, warranty, tracked costs, recent activity, maintenance outlook, and unresolved observations.

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

Tracks metadata for registration, insurance, warranties, agreements, receipts, and inspections. Supports issue and expiration dates, providers, and reference numbers. Files themselves are not uploaded.

## Ownership timeline

Combines purchases, mileage updates, services, expenses, concerns, documents, and profile changes into a newest-first ownership history.

## Drive Conditions

- Default regional forecast with optional browser geolocation
- Current temperature, humidity, wind, rain chance, and five-day outlook
- Tire-pressure context based on temperature change
- Traction, visibility, battery, coolant, and hybrid intake guidance
- Explicit distinction between forecasts and vehicle sensor measurements

## Know Your Car

Searchable and filterable guide to Kitty’s hybrid system, engine, brakes, tires, cooling systems, 12-volt battery, eCVT, suspension, and filters. Each topic explains its role, importance, warning signs, safe owner checks, and schedule connection.

## Settings

Presents reminder and display preferences and explains local data ownership. Some preference controls are currently presentation-only and should be persisted before expansion.

