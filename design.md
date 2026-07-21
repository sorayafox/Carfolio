# Product Design System

## Design direction

Carfolio is a calm, premium ownership tool—not a racing interface. The visual language should feel trustworthy, legible, and quietly automotive.

## Experience principles

### Vehicle first

Kitty’s identity, photo, mileage, and condition anchor the experience. Data should feel attached to a real car rather than to an abstract account.

### Interpretation before inventory

Surface “what needs attention” before presenting every record. Explanations should answer why a status matters and what the owner can do.

### Progressive disclosure

The sidebar exposes five frequent destinations. Historical pages are grouped under Records. Forms use modals, and detailed educational content is selected one system at a time.

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

Never rely on color alone; always show a text label.

## Typography

Use the system sans stack for navigation, labels, forms, and metrics. Use the restrained serif stack for major editorial moments such as vehicle names and learning-page titles. Avoid excessive uppercase; reserve it for short eyebrows and metadata labels.

## Navigation

- Primary: Overview, My Car, Maintenance, Car Guide, Conditions
- Expandable Records: Service History, Things to Watch, Expenses, Documents, Timeline
- Footer: vehicle health and Settings
- Kitty’s vehicle switcher opens Garage

Active states use both contrast and color. Child navigation is indented and separated by a subtle rail.

## Components

- Metric cards: one icon, one primary value, one explanatory line.
- Status chip: semantic background, border, and label.
- Vehicle hero: photo plus key ownership facts and one action.
- Table: clear columns, comfortable row height, and visible row actions.
- Modal: focused title, short context, grouped fields, and explicit cancel/save actions.
- Learning panel: component selection, explanation, warning signs, safe checks, and maintenance connection.

## Accessibility

- Maintain visible focus rings.
- Provide alternative text for meaningful images.
- Pair icons with text except for controls with accessible labels.
- Respect reduced-motion preferences.
- Keep touch targets close to 40 px or larger.
- Preserve readable contrast in all status and active states.

## Responsive behavior

At tablet sizes, reduce secondary columns and stack dense card grids. At mobile sizes, use an off-canvas sidebar, single-column content, horizontally scrollable secondary controls where necessary, and forms with one field per row.

