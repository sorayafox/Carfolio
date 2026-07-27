# Agent Guidance

**Purpose:** Defines mandatory repository guardrails, validation expectations, and workflow routing for automated contributors.

**DRY:** Keep each durable rule in its owning document and reference it elsewhere instead of duplicating it.

Act as Carfolio’s repository-level knowledge steward. Preserve product intent while keeping implementation, tests, and documentation aligned so another contributor can continue the work without reconstructing decisions from chat history.

Before changing this project:

1. Read this file completely.
2. Inspect the implementation and source-of-truth document for the area being changed.
3. Use the applicable project skills.
4. After material changes, use `$sync-carfolio-docs` to update only affected documents and leave a concise validation handoff.

## Product intent

Carfolio should help an owner understand what their vehicle needs, why it matters, and what has happened over its lifetime. It is not merely a storage interface. New work should increase confidence, prevent missed maintenance, or explain vehicle ownership in plain language.

## Working rules

- Preserve the Next.js App Router, React, TypeScript, Prisma, and SQLite architecture.
- Persist authoritative vehicle data through Prisma. Do not use browser storage as the record of truth.
- Keep calculations in shared helpers or server routes when they affect multiple views.
- Prefer verified deterministic answers for common safety and ownership questions; use Ollama for questions that require open-ended explanation or synthesis.
- Treat visible owner guidance as shared product knowledge: place reusable symptom, weather, and Quick Help content in `lib/` modules consumed by both the UI and chat route rather than duplicating it inside components.
- Treat `POST /api/ai/chat` as a public behavior boundary. Preserve its answer, evidence, citation, and navigation-action contracts.
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
- Keep product documentation broad and durable: document intent, boundaries, extension points, and user-visible behavior; avoid freezing incidental copy, exact test inventories, or tunable implementation counts into requirements.

## Knowledge transfer protocol

- A material change should leave a trace from product intent to implementation boundary, user-visible behavior, and validation without repeating the same detail in every file.
- For current behavior, verify the implementation. For desired behavior, preserve the PRD. Call out meaningful gaps between them.
- Identify data as persisted, calculated, session-only, device-local, external, or generated so future contributors know what may safely change.
- Record durable decisions and extension points; use code and tests for volatile mechanics.
- Route detail to its owning document: product scope to `prd.md`, current capabilities to `features.md`, runtime boundaries to `architecture.md`, persistence to `database.md`, experience rules to `design.md`, and repeatable contributor rules to `conventions.md`.

## Required validation

Run before handing off material changes:

```bash
npm test
npm run typecheck
npm run build
```

For schema changes, also run:

```bash
npm run db:generate
npm run db:push
```

Run `npm run db:seed` only when intentionally recreating demo data. It deletes existing local records and is not a routine validation command.

`npm run lint` is expected once the repository has an ESLint 9 flat configuration. Until then, record the missing configuration as a validation limitation rather than claiming lint passed.

## Project skills

- Use `.agents/skills/tdd` for test-first feature or bug work. Agree on the public seam, demonstrate a failing behavior test, implement the smallest passing change, and repeat vertically.
- Use `.agents/skills/impeccable` for scoped frontend critique or refinement. Preserve the incumbent Carfolio structure unless the user explicitly requests a redesign, and run its detector once after UI edits.
- Use `.agents/skills/sync-carfolio-docs` after material product or implementation changes and for documentation audits. Keep the seven documents accurate, consistent, and broad enough for future extension.
- Delegate a bounded documentation audit or handoff to the project-scoped `carfolio_docs_steward` agent in `.codex/agents/carfolio-docs-steward.toml`. It follows the sync skill, verifies claims against implementation, and reports remaining gaps without changing application behavior.
- Skills guide the workflow; repository product rules and user instructions still define scope and truth.

## UX principles

- Lead with the active vehicle and the next useful action.
- Prefer an interpretation over an unexplained metric.
- Use progressive disclosure to avoid dense navigation and forms.
- Keep primary labels short; place detail in supporting text.
- Use green for healthy, amber for approaching, orange for due now, and red for overdue.
- Treat generated images as project assets and include meaningful alternative text.
- Put direct verdicts before supporting checklists in trip and safety workflows.
- Keep emergency guidance globally discoverable without adding sidebar density.
- In local AI, show where an answer came from and offer a direct in-product action when an existing Carfolio workflow can help next.
- Keep the combined health score explicitly record-based, and let urgent safety observations outrank routine maintenance in Today’s Priority.
- Reduce repeat entry by reusing safe, editable values such as the current date, current mileage, and most recently used provider.
