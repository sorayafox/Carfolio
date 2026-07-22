# Agent Guidance

## Product intent

Carfolio should help an owner understand what their vehicle needs, why it matters, and what has happened over its lifetime. It is not merely a storage interface. New work should increase confidence, prevent missed maintenance, or explain vehicle ownership in plain language.

## Working rules

- Preserve the Next.js App Router, React, TypeScript, Prisma, and SQLite architecture.
- Persist authoritative vehicle data through Prisma. Do not use browser storage as the record of truth.
- Keep calculations in shared helpers or server routes when they affect multiple views.
- Use fictional providers and identifiers in seed data.
- Never present a seeded concern as a confirmed defect.
- Clearly distinguish manufacturer recommendations, Carfolio estimates, weather context, and actual vehicle sensor data.
- Manufacturer-specific claims must cite an official manufacturer guide.
- Safety-critical advice must direct users to the owner’s manual, door placard, or a qualified professional.
- Recall results must be described as model-level unless VIN-specific status is verified by an official source.
- Do not claim a trip will damage a component only because it crosses a saved interval; explain the limit and recommend service confirmation.
- Keep temporary trip and seasonal choices in session state unless they become explicit authoritative records.
- Generate ownership PDFs locally rather than uploading vehicle records to a conversion service.
- Every visible action must work. Remove controls that are only decorative.
- Maintain keyboard focus states, semantic labels, responsive layouts, and reduced-motion support.
- Preserve unrelated user changes and do not reset the local database without explicit approval.

## Required validation

Run before handing off material changes:

```bash
npm run typecheck
npm run build
```

For schema changes, also run:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Do not reseed when validating changes against user-entered local data unless resetting that data is intended.

## UX principles

- Lead with the active vehicle and the next useful action.
- Prefer an interpretation over an unexplained metric.
- Use progressive disclosure to avoid dense navigation and forms.
- Keep primary labels short; place detail in supporting text.
- Use green for healthy, amber for approaching, orange for due now, and red for overdue.
- Treat generated images as project assets and include meaningful alternative text.
- Put direct verdicts before supporting checklists in trip and safety workflows.
- Keep emergency guidance globally discoverable without adding sidebar density.
