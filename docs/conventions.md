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

## Styling

- Global product styling lives in `app/globals.css`.
- Use the existing blue neutral palette and spacing language.
- Reuse status classes instead of inventing one-off colors.
- Preserve responsive rules at 1050 px and 760 px unless a component needs a documented exception.
- Ensure interactive targets are usable with touch and keyboard.

## Copy

- Use short labels and plain language.
- Explain the implication of a metric, not only its value.
- Use “observation” rather than “defect” until confirmed.
- Avoid promising that estimates are manufacturer requirements.
- Use “could,” “may,” and “check” for weather-derived guidance.
- Never imply that crossing a service interval guarantees component damage; explain the calculation and recommend service confirmation.
- Label model-level recall results separately from VIN-specific status.
- Emergency guidance must name stop conditions and link to an official manual, placard, government source, or qualified professional.

## Reports

- PDF exports must remain readable with long values and multiple pages.
- Include generation time, page numbering, and a limits disclaimer.
- Do not send ownership data to a third-party PDF service.
- Use ASCII hyphens in generated PDF content to avoid missing glyphs.

## Files and changes

- Keep generated vehicle imagery in `public/`.
- Do not commit `.env`, database files, build output, logs, or TypeScript build metadata.
- Update documentation when calculation rules, persistence behavior, or navigation changes.
- Keep the seven product documents together in `docs/`; keep only the minimal root `AGENTS.md` pointer required by tooling.
