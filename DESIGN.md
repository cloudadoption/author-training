---
name: Experience Workspace author guide
description: Adobe documentation style for opt-in guide pages.
colors:
  brand-primary: "#3b63fb"
  brand-on-primary: "#fff"
  brand-surface: "#fff"
  brand-surface-alt: "#f8f8f8"
  brand-accent: "#eb1000"
  brand-ink: "#292929"
  brand-muted: "#505050"
  brand-link: "#3b63fb"
  brand-border: "#dadada"
  dark-primary: "#4069fd"
  dark-surface: "#111"
  dark-surface-alt: "#1b1b1b"
  dark-ink: "#dbdbdb"
  dark-muted: "#afafaf"
  dark-link: "#5681ff"
  dark-border: "#393939"
typography:
  headline:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "clamp(36px, 4vw, 52px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  subheading:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  intro:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.7
  navigation:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: '"Adobe Clean", "Source Sans 3", "Source Sans Pro", -apple-system, system-ui, sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  brand-radius: "8px"
spacing:
  compact: "8px"
  small: "12px"
  inset: "16px"
  gutter: "24px"
  group: "32px"
  heading: "40px"
  section: "48px"
  page-end: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    rounded: "{rounded.brand-radius}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "{colors.brand-surface}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.brand-radius}"
    padding: "10px 18px"
  button-clear:
    backgroundColor: "{colors.brand-surface}"
    textColor: "{colors.brand-link}"
    rounded: "{rounded.brand-radius}"
    padding: "8px 16px"
  button-clear-hover:
    backgroundColor: "{colors.brand-surface-alt}"
  input-search:
    backgroundColor: "{colors.brand-surface}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.brand-radius}"
    padding: "10px 14px"
  navigation-item:
    textColor: "{colors.brand-muted}"
    typography: "{typography.navigation}"
    rounded: "{rounded.brand-radius}"
    padding: "8px 12px"
  navigation-current:
    backgroundColor: "{colors.brand-surface-alt}"
    textColor: "{colors.brand-link}"
    rounded: "{rounded.brand-radius}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.brand-surface-alt}"
    rounded: "{rounded.brand-radius}"
  search-empty:
    backgroundColor: "{colors.brand-surface-alt}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.brand-radius}"
    padding: "24px"
---

# Design System: Experience Workspace author guide

## Overview

**Creative North Star: "Adobe documentation"**

Plain, readable documentation for new and occasional authors. Neutral flat surfaces, Spectrum blue controls, left-hand guide navigation, and readable lessons implement the confirmed direction. This is a project training resource, not official Adobe product documentation.

This system applies only to pages opting into `Template: guide`. Original non-guide boilerplate is outside its scope. The shipped implementation, not a fictional brand or a new aesthetic choice, is the source of the tokens.

**Key Characteristics:**
- Plain reading typography.
- Neutral flat surfaces and fine dividers.
- Spectrum blue links and controls.
- Responsive topic navigation and live topic filtering.

## Colors

Neutral surfaces carry the reading content; blue distinguishes actions and links.

### Primary
- **Spectrum blue:** `brand-primary` fills primary actions; `brand-link` colors links, current navigation, carets, and focus outlines. They coincide in light mode but separate in dark mode.
- **On-primary white:** `brand-on-primary` provides button and selection text in both modes.

### Secondary
- **Adobe red:** `brand-accent` styles the single Adobe text mark in the light masthead, not a second control palette. The dark masthead uses `dark-ink` instead.

### Neutral
- **Page surface / alternate surface:** page background versus navigation states, code containers, cards, empty-search recovery, and footer.
- **Ink / muted ink:** body and headings versus introductions, descriptions, navigation, and supporting labels.
- **Divider:** structural rules and container borders; search fields use muted ink for their edge.

The `dark-*` tokens are the observed `prefers-color-scheme: dark` replacements for corresponding `brand-*` roles. On-primary white is unchanged. Unused declared status and dark-band tokens are not part of this recorded palette.

**The Blue Roles Rule.** In dark mode, blue text uses the link role; primary blue remains a fill.

## Typography

**Display and Body Font:** the shared Adobe Clean / Source Sans / system stack in the frontmatter. It is reading typography, not a separate display-face identity; Adobe Clean availability is not assumed.

The hierarchy uses bold sentence-case headings and regular body text. Headline titles balance within a short measure (20ch); paragraphs and authored top-level lists stop at a readable measure (72ch).

### Hierarchy
- **Headline:** page H1, using the fluid headline token.
- **Title / subheading:** H2 / H3. Learning-path H3 uses a smaller size (19px).
- **Intro:** the paragraph directly following H1, in muted ink.
- **Body:** lesson paragraphs and lists.
- **Label:** search label; action links instead use semibold weight (650) and compact line height (1.25).
- **Navigation / caption:** sidebar links versus breadcrumbs, contents, pager labels, and footer.
- **Directory:** category headings (17px / 650), linked topic headings (18px / 600), and descriptions (15px, line height 1.6). Descriptions use muted ink.

## Layout

The centered shell caps its width (1600px). Phone/tablet layout has side gutters (24px), main top padding (32px), and a native guide disclosure above the lesson. Main content ends with generous padding; section rhythm uses the frontmatter spacing scale.

At the desktop navigation breakpoint (900px), the shell becomes a topic rail (224px) plus a flexible main column, with a gap (48px) and side gutters (40px). The rail is sticky beneath the fixed masthead (72px), independently scrollable, and separated by a fine right divider. Main top padding increases (48px).

At the contents breakpoint (1200px), lessons with contents use three columns (224px / minmax(0, 760px) / 180px), separated by gaps (40px). The right contents rail is sticky; below this breakpoint it becomes an inline native disclosure before the first H2. Headings have anchor clearance (100px).

The topic directory switches at its own breakpoint (700px): category column (160px), followed by two topic columns; otherwise groups stack. Group padding is vertical (24px), with column gaps (32px). Search controls wrap with a gap (12px).

Print removes masthead, footer, rails, pager, breadcrumb, and skip link; the lesson becomes a single unpadded black-on-white column.

## Elevation & Depth

Surfaces are flat: no shadows or gradients. Alternate surface tones, whitespace, and fine borders (1px) distinguish regions. Fixed and sticky navigation provide position, not simulated elevation.

**The Flat Surfaces Rule.** Separate guide regions with neutral tones and dividers, not shadows or gradients.

## Shapes

Controls and contained panels use the shared radius. Main action links have borders (2px); search, reset, masthead tools, and cards use finer borders (1px). Directory groups and learning-path columns are divided rows/columns, not raised cards. Native disclosure markers and the CSS-drawn masthead menu remain functional navigation devices.

## Components

### Buttons
Primary links are blue with white text; secondary links are page-colored with muted borders and ink text. Both use a minimum height (44px), semibold text (15px / 650), and wrapping labels. Hover adds an underline without a lift or fill change. The search reset is a separate outlined blue-text button, minimum height (48px), with alternate-surface hover.

### Inputs / Fields
Search has a visible label, full-width neutral field, muted border, and minimum height (48px). The placeholder remains muted at full opacity. A blue outline (2px), offset from the control (4px), marks visible keyboard focus throughout the guide.

### Navigation
Sidebar links use muted text; hover adds alternate surface and ink, while current-page state combines alternate surface, link blue, bold weight (700), and `aria-current="page"`. Mobile guide navigation uses native details/summary. The separate masthead menu is a CSS-drawn button, not a glyph icon.

The masthead uses bold Adobe styled text (25px / 700, line height 1, tracking -0.02em), not a logo image. Breadcrumbs wrap; generated H2 contents and a two-column previous/next pager support lessons. A failed navigation fetch leaves the lesson readable with a home link and explanatory message.

### Cards / Containers
Cards use alternate surface, divider border, and the shared radius, with body inset (16px). Code containers use the same material with padding (20px). Empty-search recovery uses alternate surface and the search-empty token; it is not an error-color alert.

### Topic directory
The directory filters authored categories, titles, and descriptions live, matching every search word. It announces the result count, hides empty groups, and offers a clear-search action plus plain recovery text when nothing matches. Clearing restores results and returns focus to the input. No remote index or imagery is required.

Links and buttons transition only background and text colors (140ms ease-out), and only when reduced motion is not requested.

## Do's and Don'ts

### Do:
- **Do** apply this system only to opt-in guide pages.
- **Do** preserve readable measures, labeled search, current-page semantics, and visible keyboard focus.
- **Do** use the observed dark-mode roles rather than carrying light-mode blue text into dark mode.
- **Do** retain the training-resource distinction from official Adobe documentation.

### Don't:
- **Don't** introduce shadows, gradients, ornamental illustration, or fictional interface screenshots.
- **Don't** replace the styled Adobe text with an invented logo or use red as a control fill.
- **Don't** turn the reading font stack into a system-display identity.

Not canonized: no new craft-floor defect was identified in the sampled guide implementation; unused token declarations and original non-guide boilerplate remain outside this system. This record covers local rendered/import-ready content, not DA upload, import execution, or remote delivery validation.
