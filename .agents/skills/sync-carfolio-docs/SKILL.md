---
name: sync-carfolio-docs
description: Keep Carfolio's seven required Markdown documents aligned with material product, architecture, data, UX, AI, testing, and workflow changes. Use after implementing or revising Carfolio behavior, when documentation may be stale, when a user asks to update or audit project docs, or before a project handoff. Preserve broad future-facing scope and avoid copying incidental implementation detail into durable requirements.
---

# Sync Carfolio Docs

Keep Carfolio's documentation accurate without turning it into a line-by-line implementation transcript.

## Use This Skill When

Use this skill when:

- A product feature, workflow, UI behavior, API, calculation, database model, AI capability, or testing policy has materially changed.
- One or more of Carfolio's seven required documents may no longer match the implementation.
- The user asks to update, review, audit, organize, or verify the project documentation.
- A contributor needs a concise knowledge-transfer handoff after completing work.
- The project is being prepared for submission, review, or transfer to another contributor.

Do not run a full documentation rewrite for formatting-only edits, dependency installation, or other changes that do not affect durable product knowledge. Audit first and update only the documents that own the changed information.

## Workflow

1. Read the root `AGENTS.md` and follow its repository rules.
2. Run `bash .agents/skills/sync-carfolio-docs/scripts/audit-docs.sh` from the repository root.
3. Inspect the user's request, relevant code changes, and `git status --short`. Treat the audit output as routing help, not proof that prose is stale.
4. Read all seven required documents before editing so terminology and boundaries remain consistent:
   - `AGENTS.md`
   - `prd.md`
   - `architecture.md`
   - `conventions.md`
   - `features.md`
   - `design.md`
   - `database.md`
5. Update only documents materially affected by the change. Do not force a change into every file.
6. Run the audit script again and `git diff --check -- AGENTS.md prd.md architecture.md conventions.md features.md design.md database.md`.
7. If implementation changed, run the validation required by `AGENTS.md`. For documentation-only edits, the audit and diff check are sufficient unless the user asks for full validation.

## Route Information to the Right Document

- `prd.md`: problem, users, outcomes, scope, requirements, non-goals, and success criteria.
- `features.md`: user-visible capabilities and current limitations.
- `architecture.md`: system boundaries, data flow, integrations, shared modules, and deployment implications.
- `database.md`: persisted entities, relationships, calculated state, transaction behavior, and migration constraints.
- `design.md`: experience principles, visual language, interaction patterns, accessibility, and responsive behavior.
- `conventions.md`: repeatable engineering, copy, testing, API, and styling rules.
- `AGENTS.md`: product guardrails, validation requirements, skill routing, and rules future agents must always follow.

## Keep Documentation Durable

- Prefer intent, contracts, boundaries, and extension points over exact copy or internal line-level behavior.
- Include concrete examples only when they clarify a rule; label representative examples as expandable.
- Avoid brittle counts, exhaustive test inventories, temporary model names, local machine details, or tunable thresholds unless they are true product requirements.
- Keep factual calculations and persisted schema fields precise where accuracy depends on them.
- Separate current behavior from future direction and known limitations.
- Preserve user terminology and resolve contradictions across documents in the same pass.
- Never claim an unimplemented feature exists. Verify uncertain behavior in code before documenting it.

## Change Mapping

- UI or workflow changes usually affect `features.md` and `design.md`; add `prd.md` only when scope or outcomes change.
- API, shared helper, AI retrieval, or integration changes usually affect `architecture.md` and `conventions.md`.
- Prisma schema, persistence, transaction, or calculated-state changes affect `database.md` and often `architecture.md`.
- New safety, privacy, validation, or agent rules affect `agents.md` and may also affect `prd.md`.
- Tests alone rarely require feature documentation; document a testing-policy change in `conventions.md` or `architecture.md`.

## Handoff

Report which documents changed, the durable concepts added or corrected, and the validation performed. Mention documents reviewed but intentionally unchanged only when that helps explain scope.
