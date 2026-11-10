# Experience Workspace author guide

Adobe-styled, task-based training for new and occasional authors. Includes a
searchable topic directory, responsive guide navigation, on-page contents,
previous/next lessons, ten lessons, and a block reference.

- Preview: https://main--author-training--cloudadoption.aem.page/
- Live: https://main--author-training--cloudadoption.aem.live/
- Content: https://da.live/#/cloudadoption/author-training

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000/. `npm run dev` prepares a disposable `.preview/`
from the canonical DA documents in `content/`, then starts AEM CLI. It does not
upload, preview remotely, or publish anything. Rerun it after editing the HTML
sources. Code/CSS changes are served directly. Production has no build step.

The local adapter supplies the `head.html` scripts and extracts the supplied
two-cell Metadata rows. It is intentionally limited to this starter content;
actual DA round-tripping must be checked after import.

## Import the content into DA

The 15 HTML files in `content/` are **DA source documents**, not static website
pages. They include the required body, header, main, and footer wrappers,
canonical block divs, and page Metadata. Keep their structure when importing.
Do not upload `.preview/`, which contains generated development pages.

Map paths by removing `content/`:

| Source | DA destination |
| --- | --- |
| `content/index.html` | `/index.html` (site overview) |
| `content/docs/nav.html` | `/docs/nav.html` |
| `content/docs/footer.html` | `/docs/footer.html` |
| `content/docs/guide-nav.html` | `/docs/guide-nav.html` |
| `content/docs/enablement/*.html` | `/docs/enablement/*.html` |

Use your approved DA import workflow, or the Source API with a valid Adobe IMS
token and write permission. **Importing an existing path overwrites its content.**
Inspect and back up any existing destination first. The root overview is supplied
for this training site; choose another location and update links if `/index`
already serves a different purpose.

Example for one shared document (run only when you intend to write to DA):

```sh
curl --fail-with-body --request PUT \
  --header "Authorization: Bearer ${DA_TOKEN:?Set a valid Adobe IMS token}" \
  --form 'data=@content/docs/guide-nav.html;type=text/html' \
  https://admin.da.live/source/cloudadoption/author-training/docs/guide-nav.html
```

Repeat with each source and its matching destination. Do not put tokens in
files or source control. The multipart field must be named `data`.

**Code deployment is not content deployment.** Pushing `main` ships code through
the configured AEM integration, but does not import these HTML documents into DA.
`content/`, tooling, tests, and design records are excluded by `.hlxignore`.

## Preview and launch

1. Import all documents. Open them in DA and confirm their tables and content.
1. Preview `/docs/nav`, `/docs/footer`, and `/docs/guide-nav`, then the lessons and
   `/index`. Preview is a separate action; source upload alone is not enough.
1. Check the overview search, current lesson, on-page links, mobile menus, page
   titles, button examples, and block reference on the actual preview host.
1. Have the site owner validate the lessons against your workspace, permissions,
   available library, and approval process. Initial copy was prepared with AI
   assistance and links to official sources.
1. Publish shared dependencies and lessons before the overview, only after
   approval. A preview URL may be publicly accessible; do not use it as a privacy
   boundary.

This implementation does not upload content, configure your workspace library,
enable integrations, or publish live.

## Authoring model

Guide pages use normal headings, paragraphs, lists, and links. Keep one Heading 1
and use Heading 2 for sections. Each lesson ends with a Metadata table containing:

| Metadata | |
| --- | --- |
| Title | A descriptive page title |
| Description | A short page summary |
| Template | guide |
| Nav | /docs/nav |
| Footer | /docs/footer |

`Template: guide` opts into the guide shell and Spectrum/Adobe styles. Ordinary
pages retain the existing template. `/docs/guide-nav` provides the sidebar and
lesson order. Heading 2 elements provide on-page contents automatically. If the
shared guide navigation is unavailable, the lesson remains readable.

### Guide Topics

| Guide Topics | |
| --- | --- |
| Getting started | Heading 3 containing a descriptive link, followed by a short description |
| Creating content | Heading 3 containing a descriptive link, followed by a short description |

Each row becomes one topic. Search matches categories, titles, and descriptions
using all entered words, ignoring case. It does **not** search full lesson text.
An omitted category defaults to Topics. Empty rows are ignored, extra content
cells are retained, and unlinked content remains readable.

Add a new lesson to both `/docs/guide-nav` and the overview's Guide Topics block.
The [maintenance lesson](content/docs/enablement/maintaining.html) explains the
editorial workflow. The [block reference](content/docs/enablement/block-library.html)
documents Cards, Columns, Hero, Fragment, Widget, and Guide Topics.

## Validate

```sh
npm run lint
npx playwright install chromium
npm test
```

Tests start their own local AEM server on port 3100. They cover search and its
empty state, keyboard navigation, collapsed mobile menus, lesson navigation,
heading anchors, partial block rows, missing navigation, internal destinations,
template isolation, dark mode, and layouts at 375, 768, and 1440px.
Screenshots are saved under `test-results/`.

`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, and the surface brief are
development records to keep in version control. Generated screenshots, test
reports, and `.preview/` are not shipping assets.
