# Carfolio project documentation

These seven documents answer different questions about the same product:

| Document | Question it answers | What belongs inside |
| --- | --- | --- |
| [Product requirements](prd.md) | Why are we building Carfolio, for whom, and what must it accomplish? | User problem, audience, outcomes, requirements, non-goals, and measurable success criteria. |
| [Feature reference](features.md) | What can the current product do? | User-visible behavior, workflows, calculations, states, and current limitations. |
| [Product design](design.md) | How should Carfolio look and feel? | UX principles, navigation, colors, typography, components, responsive behavior, and accessibility. |
| [Architecture](architecture.md) | How does the application work technically? | Runtime layers, routes, APIs, shared helpers, external services, transactions, and deployment boundaries. |
| [Database design](database.md) | What information is stored, related, or calculated? | Prisma entities, relationships, persistence rules, transactions, derived state, and migration concerns. |
| [Engineering conventions](conventions.md) | How should contributors write and change the code? | Naming, TypeScript practices, API rules, copy standards, styling rules, report requirements, and file hygiene. |
| [Agent guidance](agents.md) | What guardrails must an AI coding agent follow? | Product intent, safety boundaries, preservation rules, validation commands, and non-negotiable UX behavior. |

## Keeping them current

- Change `prd.md` when product scope, audience, outcomes, or success criteria change.
- Change `features.md` whenever visible behavior is added, removed, or materially altered.
- Change `design.md` when navigation, interaction patterns, visual language, or accessibility rules change.
- Change `architecture.md` when data flow, routes, integrations, helpers, or deployment assumptions change.
- Change `database.md` when schema, persistence, calculations, or transaction behavior changes.
- Change `conventions.md` when the team adopts a repeatable implementation rule.
- Change `agents.md` when automated contributors need a new mandatory guardrail.
