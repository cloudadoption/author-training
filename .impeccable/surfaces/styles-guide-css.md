---
version: 1
slug: "styles-guide-css"
primary_target: "styles/guide.css"
related_targets: ["scripts/guide.js","blocks/guide-topics"]
---

# Author guide

Mode: Read. Target: / and lessons under /docs/enablement/.

## Direction contract

THESIS: An Adobe-styled task guide, not a marketing homepage. Authors find an
answer, try a bounded exercise, and know the next safe action.

OWN-WORLD: Spectrum white and neutral surfaces, blue links and controls, one red
Adobe wordmark, system/Adobe Clean reading typography, fine dividers, 8px controls.
No ornamental illustration or fictional interface screenshots.

STORY: Find a topic, follow steps in Experience Workspace, preview and check the
result, then publish only after approval. Keep site rules distinct from platform
capabilities.

FIRST VIEWPORT: Compact Adobe masthead, a 224px desktop topic rail, a broad title
and short introduction, a blue start action beside a secondary workspace link.
Below, a three-step learning path and a searchable categorized topic directory.
Lessons use a calm 70ch column with an on-page contents rail.

FORM: User-pinned Adobe documentation structure, not an open visual tournament.
seed:e75e6cff5d7a206e. Recorded retrospectively during finish review, not used to
choose the design. The user's pinned Adobe documentation direction takes
precedence over the roll.
Signature interaction: live topic filtering with announced result counts and a
clear no-results recovery. Native navigation disclosure on smaller screens.
Motion grammar: short color transitions only; respect reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Acceptance criteria

- DA body-fragment HTML is the source of all lesson and navigation content.
- Ten focused lessons cover access, first page, formatting, blocks, media,
  sections/metadata, review/history, publishing, troubleshooting, and maintenance.
- Search filters authored topic titles/descriptions/categories, supports multiple
  words, announces counts, and has an empty state and reset.
- Current-page navigation, generated H2 contents, and previous/next lesson links.
- Missing navigation never prevents reading the lesson.
- Semantic controls and visible focus; mobile navigation has no hidden focus trap.
- No overflow at 375, 768, or 1440px; print hides navigation.
- Existing non-guide pages retain their template, styles, and behavior.
- No credentials, uploads, live publishing, external runtime packages, or edits to
  scripts/aem.js.
- Lint and focused browser checks pass; local source links resolve.
