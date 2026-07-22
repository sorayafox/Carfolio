# Engineering Conventions

## TypeScript and React

- Use strict TypeScript and avoid untyped data at new boundaries.
- Prefer server components for loading authoritative data and client components only for interaction.
- Every rendered list item must have a stable, domain-derived `key`.
- Do not use array indexes as keys when a record ID or stable label exists.
- Use semantic elements, accessible names, and explicit button types inside forms.
- Keep hooks at component scope and declare derived values after state.

## Naming

- Components: `PascalCase`.
- Functions and variables: `camelCase`.
- Prisma models: singular `PascalCase`.
- Route slugs: lowercase kebab case.
- API payload fields should match Prisma field names unless translation materially improves the boundary.
- Status values use title case because they are persisted and displayed: `Up to Date`, `Due Soon`, `Due Now`, `Overdue`.

## Data and dates

- Convert form numeric values explicitly with `Number`.
- Convert accepted date strings to `Date` in server routes.
- Do not allow current mileage below purchase mileage or below the previously recorded odometer in the mileage workflow.
- Display dates with a consistent user-facing formatter.
- Treat money as USD in this version. A future financial model should use integer minor units rather than floating-point values.
- Treat trip distance as the complete round trip and compare its projected ending odometer with saved service limits.

## API behavior

- Validate IDs and required inputs before mutation.
- Return JSON errors with an appropriate HTTP status.
- Use Prisma transactions for operations that create multiple related records.
- Timeline events are an audit history and are not removed automatically when a source record is deleted.
- Verified chat responses return a non-empty `answer`, `answerKind: "verified"`, evidence levels, a source list, and optional internal actions with working routes.
- Match deterministic in-product guidance before calling Ollama. Add common owner intents to a shared domain module, then consume that module from both the visible tool and `POST /api/ai/chat`.
- AI-generated Toyota claims must cite only manual pages present in the retrieved source set. Reject an unreliable response rather than adding a citation after generation.

## Styling

- Global product styling lives in `app/globals.css`.
- Use the existing blue neutral palette and spacing language.
- Reuse status classes instead of inventing one-off colors.
- Preserve responsive rules at 1050 px and 760 px unless a component needs a documented exception.
- Ensure interactive targets are usable with touch and keyboard.
- Chat actions use existing Next.js routes, close the drawer after navigation, and must open the intended workflow directly.
- Chat supports Escape to close, Enter to send, Shift+Enter for a newline, visible focus, retryable errors, reduced motion, and an announced loading state.

## Copy

- Use short labels and plain language.
- Explain the implication of a metric, not only its value.
- Use “observation” rather than “defect” until confirmed.
- Avoid promising that estimates are manufacturer requirements.
- Use “could,” “may,” and “check” for weather-derived guidance.
- Never imply that crossing a service interval guarantees component damage; explain the calculation and recommend service confirmation.
- Label model-level recall results separately from VIN-specific status.
- Emergency guidance must name stop conditions and link to an official manual, placard, government source, or qualified professional.
- Local-AI Toyota-manual claims must cite an indexed page supplied to the model; never let the model invent or cite an unretrieved page.
- Keep manual retrieval bounded and unload Ollama after every response so local-model use remains practical on consumer hardware.
- Reuse shared application guidance before duplicating copy in chat. Live location-selected weather remains owned by the Conditions page.
- Internal chat actions must open the intended workflow and relevant state, not merely its top-level page.

## Testing

- Use `npm test` for behavior tests and keep tests at agreed public seams.
- Follow red → green in vertical slices: one failing behavior, the smallest passing implementation, then the next behavior.
- Prefer real route handlers and the local test database over mocks of Carfolio modules. Mock only true system boundaries when necessary.
- Tests describe observable outcomes and use independent expected values; do not assert private calls or duplicate implementation logic.

## Reports

- PDF exports must remain readable with long values and multiple pages.
- Service briefs should exclude financial, registration, insurance, and other owner-only information unless it affects the requested maintenance visit.
- Include generation time, page numbering, and a limits disclaimer.
- Do not send ownership data to a third-party PDF service.
- Use ASCII hyphens in generated PDF content to avoid missing glyphs.

## Files and changes

- Keep generated vehicle imagery in `public/`.
- Do not commit `.env`, database files, build output, logs, or TypeScript build metadata.
- Update documentation when calculation rules, persistence behavior, or navigation changes.
- Keep the seven product documents together in `docs/`; keep only the minimal root `AGENTS.md` pointer required by tooling.
