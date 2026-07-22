# Product Design System

## Design direction

Carfolio is a calm, premium ownership tool—not a racing interface. The visual language should feel trustworthy, legible, and quietly automotive.

## Experience principles

### Vehicle first

Kitty’s identity, photo, mileage, and condition anchor the experience. Data should feel attached to a real car rather than to an abstract account.

### Interpretation before inventory

Surface “what needs attention” before presenting every record. Explanations should answer why a status matters and what the owner can do.

### Progressive disclosure

The sidebar exposes six frequent destinations. Historical pages are grouped under Records. Owner Tools uses tabs to keep multiple utilities in one destination, while emergency help uses a compact global launcher and focused drawer.

### Concise but thorough

Use short titles, one-line summaries, and scannable metrics. Keep deeper context inside supporting copy, expandable groups, or focused detail panels.

## Visual foundation

- Primary blue: `#245f99`
- Deep navigation blue: `#13263a`
- Canvas: cool light neutral around `#f3f5f7`
- Paper: white
- Text: deep charcoal
- Muted text: blue-grey
- Rounded corners: 9–19 px depending on hierarchy
- Shadows: soft, low-opacity, and functional

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
- Kitty’s vehicle switcher opens Garage

The vehicle-health footer is a navigation control, not a decorative metric. It shows the calculated score and state, then opens the full inspection breakdown.

Active states use both contrast and color. Child navigation is indented and separated by a subtle rail.

## Components

- Metric cards: one icon, one primary value, one explanatory line.
- Status chip: semantic background, border, and label.
- Vehicle hero: photo plus key ownership facts and one action.
- Table: clear columns, comfortable row height, and visible row actions.
- Modal: focused title, short context, grouped fields, and explicit cancel/save actions.
- Learning panel: component selection, first-owner explanation, normal-versus-warning comparison, Kitty-specific insight, expandable vocabulary and expert tips, safe checks, and maintenance connection.
- Trip verdict: projected odometer, direct readiness language, affected service names, and an explanation of the calculation.
- Emergency drawer: topic selector, safety warning, ordered actions, official links, and an obvious close control.
- PDF report: restrained blue hierarchy, readable single-column sections, consistent margins, and page numbers.

## Accessibility

- Maintain visible focus rings.
- Provide alternative text for meaningful images.
- Pair icons with text except for controls with accessible labels.
- Respect reduced-motion preferences.
- Keep touch targets close to 40 px or larger.
- Preserve readable contrast in all status and active states.

## Responsive behavior

At tablet sizes, reduce secondary columns and stack dense card grids. At mobile sizes, use an off-canvas sidebar, single-column content, horizontally scrollable secondary controls where necessary, and forms with one field per row.
# Progressive owner help

Owner tools live in one concise navigation destination. Emergency help is a small persistent action that opens a focused drawer, keeping safety guidance discoverable without occupying the main workspace.

On small screens the emergency launcher becomes icon-sized. The calculated trip verdict appears before the supporting physical checklist so the owner does not confuse checked boxes with mechanical readiness.
