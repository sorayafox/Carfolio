# Product Design System

## Design direction

Carfolio is a calm, premium ownership tool—not a racing interface. The visual language should feel trustworthy, legible, and quietly automotive.

## Experience principles

### Vehicle first

The vehicle's identity, photo, mileage, and condition anchor the experience. Data should feel attached to a real car rather than to an abstract account.

### Interpretation before inventory

Surface “what needs attention” before presenting every record. Explanations should answer why a status matters and what the owner can do.

The dashboard begins with one dominant **Today’s priority** decision. Maintenance is grouped into **Needs attention** and **Planned care**, with calculations available through progressive disclosure instead of a dense table.

### Progressive disclosure

The sidebar exposes six frequent destinations. Historical pages are grouped under Records. Owner Tools begins with situation-based choices and reveals one utility at a time, while emergency help and Ask about car use compact global launchers with focused drawers.

### Concise but thorough

Use short titles, one-line summaries, and scannable metrics. Keep deeper context inside supporting copy, expandable groups, or focused detail panels.

### Knowledge at the point of decision

Show the verdict first, then its evidence, source, and next action. Do not require users to translate raw records before they can decide what to do. When a related workflow already exists, link to it instead of recreating the full workflow in a card or chat answer.

## Visual foundation

- Primary blue: `#245f99`
- Deep navigation blue: `#13263a`
- Canvas: cool light neutral around `#f3f5f7`
- Paper: white
- Text: deep charcoal
- Muted text: blue-grey
- Rounded corners: 9–19 px depending on hierarchy
- Shadows: soft, low-opacity, and functional
- Brand mark: a compact, recognizable vehicle symbol with a friendly detail that remains legible at sidebar size; avoid concepts that become abstract when reduced

## Status colors

- Up to Date: green
- Due Soon: amber
- Due Now: orange
- Overdue: red
- Trip ready: green
- Trip crosses a future limit: amber
- Service required before trip: red

Never rely on color alone; always show a text label.

## Typography

Use the system sans stack for navigation, labels, forms, and metrics. Use the restrained serif stack for major editorial moments such as vehicle names and learning-page titles. Avoid excessive uppercase; reserve it for short eyebrows and metadata labels.

## Navigation

- Primary: Overview, My Car, Maintenance, Car Guide, Conditions, Owner Tools
- Expandable Records: Service History, Things to Watch, Expenses, Documents, Timeline
- Footer: vehicle health and Settings
- car’s vehicle switcher opens Garage

The vehicle-health footer is a navigation control, not a decorative metric. It shows one combined ownership-health score derived from maintenance, observations, document coverage, and record freshness, then opens the transparent breakdown. Copy must distinguish this record-based score from a physical inspection or live diagnostic.

Active states use both contrast and color. Child navigation is indented and separated by a subtle rail.

## Components

- Metric cards: one icon, one primary value, one explanatory line.
- Status chip: semantic background, border, and label.
- Vehicle hero: photo plus key ownership facts and one action.
- Table: clear columns, comfortable row height, and visible row actions.
- Modal: focused title, short context, grouped fields, and explicit cancel/save actions.
- Service forms: known values appear as editable defaults to reduce repeat entry without hiding what will be saved.
- Learning panel: component selection, first-owner explanation, normal-versus-warning comparison, car-specific insight, expandable vocabulary and expert tips, safe checks, and maintenance connection.
- Trip verdict: projected odometer, direct readiness language, affected service names, and an explanation of the calculation.
- Emergency drawer: topic selector, safety warning, ordered actions, official links, and an obvious close control.
- PDF service brief: strong blue header, compact vehicle summary, status-tinted service rows, readable single-column sections, consistent margins, and page numbers.
- Source badge: distinguishes a personal schedule, Toyota-based reference, or dealer-adjusted recommendation.
- Save confirmation: brief, non-blocking feedback after a successful persisted action.
- Symptom flow: three numbered steps, category and symptom selection, a severity-colored response panel, and a concise mechanic-ready recording form.
- Local AI drawer: existing right-side panel with a trust statement, readable conversational measure, suggested questions, explicit loading and retry states, evidence chips, verified-response marker, cited manual links, and one clear next action when Carfolio already has a related workflow.
- Chat evidence chips: blue for car’s records, violet for Toyota manual, and amber for general education. Text labels remain mandatory because color is supplementary.
- Verified chat action: primary blue, descriptive label, arrow icon, and direct navigation to the intended existing workflow.

## Information-state patterns

- Persisted records use save confirmation and remain visible after refresh.
- Calculated values explain their inputs or offer a route to the breakdown.
- Session-only tools say that selections are temporary.
- External context identifies its provider and avoids implying live vehicle telemetry.
- Safety guidance leads with stop conditions and keeps manufacturer or professional escalation visible.
- Empty states explain what information is missing and provide the next valid action.

## Accessibility

- Maintain visible focus rings.
- Provide alternative text for meaningful images.
- Pair icons with text except for controls with accessible labels.
- Respect reduced-motion preferences.
- Keep primary navigation and dialog controls at least 44 px tall; keep compact row actions at least 40 px.
- Trap keyboard focus inside open overlays, support Escape to close, and restore focus to the launching control.
- Preserve readable contrast in all status and active states.
- Chat opens with focus in the question field, closes with Escape, uses Enter to send and Shift+Enter for a newline, and announces loading and errors to assistive technology.
- All overlays lock background scrolling, keep keyboard focus inside while open, and restore focus to the launching control when closed.

## Responsive behavior

At tablet sizes, reduce secondary columns and stack dense card grids. At mobile sizes, use an off-canvas sidebar, single-column content, horizontally scrollable secondary controls where necessary, and forms with one field per row.

The AI drawer fills the mobile width while preserving the same hierarchy. Its launcher becomes icon-sized, conversation text remains at a readable size, and action controls retain approximately 40 px touch targets.
# Progressive owner help

Owner tools live in one concise navigation destination. Emergency help is a small persistent action that opens a focused drawer, keeping safety guidance discoverable without occupying the main workspace.

Ask about car is a separate compact global action. It supplements rather than replaces Conditions, Maintenance, Owner Tools, the manual, or professional inspection. Answers link back into those established workflows instead of duplicating full interfaces inside chat.

On small screens the emergency launcher becomes icon-sized. The calculated trip verdict appears before the supporting physical checklist so the owner does not confuse checked boxes with mechanical readiness.
