# Copilot Instructions — Books Library

## When to Consult Specialized Guides

Before generating or modifying files, read the relevant specialized guide:

- Markdown: `docs/markdown-standards.md`.
- All code and repository operations: `AGENTS.md`, the agent-agnostic source of truth.

## Catalog Structure

```text
vault/
  books/    One Markdown note per work
  series/   One Markdown introduction per series or associated collection
  universes/ Shared-universe introductions and related draft references
data/
  audiobook-import.json    Initial filenames-only provenance
src/                       Astro pages, components, styles, and search
```

Catalog notes are the editable database. No database server or credentials are needed. Build output is derived.

## Book Format

Use YAML frontmatter followed by one short, spoiler-free prose paragraph:

```yaml
---
title: "Example Book"
author: "Example Author"
series: "Example Series"
order: 1
read: null
listened: true
audioSources: []
genres: ["Fantasy"]
kind: "Book"
cover: ""
coverSource: ""
coverRegion: ""
source: ""
year: null
descriptionStatus: "reviewed"
---
```

- Keep stable filenames: existing IDs are used in URLs and the import audit.
- `read: null` means historical reading status was not recorded; preserve it when enriching an existing record.
- New photo additions use `read: false` unless the owner says read; follow [photo import](../docs/photo-import.md).
- Reading and listening are independent. `read: true` and `listened: true` activates both status icons.
- Optional `queued: true` explicitly adds a book to the owner's TODO list, independent of completion history.
  Preserve queue membership during enrichment. Do not infer it from unread status or clear it without an owner request.
- The initial Dropbox audiobook inventory is listened, per the owner's explicit statement. This does not extend to
  future photo additions. Do not infer reading from ebook sidecar files.
- Optional `formats` records confirmed holdings: `Print`, `Ebook`, and/or `Audiobook`. Ownership does not imply
  completed reading or listening. Preserve existing formats when adding another edition.
- `audioSources` retains known Audible and/or GraphicAudio editions as metadata; it is not displayed on the site.
  Empty or omitted means unconfirmed.
- Preserve multiple edition sources when merging narrations. Never infer Audible from the absence of GraphicAudio.
- `genres` is a nonempty list of broad editorial categories; use existing labels and allow multiple genres.
- `series` must exactly match a series note's title; use an empty string for a standalone work.
- `order` is a display-order hint, not a claim that the local collection includes every published volume.
- Keep short fiction, anthologies, adaptations, and genuinely different versions distinguishable.
- Merge alternate narrations and multi-disc tracks when they represent the same work.
- Prefer verified US print covers. Never assume a cover is American solely from its language or an ISBN prefix.
- Optional `coverFit: "contain"` preserves square or unusually proportioned artwork without clipping the title.
- Optional `coverCrop` records top/right/bottom/left crop percentages (0–40) for packaging borders.
- Prefer clean artwork; verify any crop keeps the full title and author visible at card and detail sizes.
- Store all active cover images in `public/covers/<book-id>.<extension>` and use local `/covers/` paths in `cover`.
- Preserve the original image URL in `coverOriginal` and exact edition page in `coverSource`. Verify downloaded files
  are valid images, not HTML errors or tiny service placeholders. Use the fallback when no reliable image is available.
- Do not fabricate bibliographic fields. Unknown years stay `null`; unavailable URLs stay empty.
- Write original descriptions about premise and themes, without plot resolutions or spoilers from previous volumes.
- A collection's description may describe its scope. Do not represent the collection as one of its individual stories.

## Series Format

Each `vault/series/*.md` has `title` and `author` in YAML frontmatter and a single spoiler-free paragraph as its body.
The site derives each series' book list from book records. Update introductions in place and preserve stable IDs.

## Shared Universes

Use optional book `universe` values matching a `vault/universes/` title exactly. Preserve the actual `series`, order,
status, cover, and stable ID. Verify membership from official author/publisher sources; not every book by an author
shares a universe. Add only requested/library works, not an entire bibliography.

Universe notes have `title`, `author`, an original spoiler-free paragraph, optional `sources` (label/URL pairs), and
optional `relatedBooks` (existing book IDs). Reserve related books for non-canon drafts: do not also tag those records
as canonical members. Grouping and canonical counts derive from book records; collections remain single records.
Keep cross-book connections spoiler-free. The build validates universe references and related-book membership.

## Import and Reconciliation

For photographs, use [the photo-import procedure](../docs/photo-import.md), including its status defaults, metadata,
cover research, and duplicate checks. The filenames-only steps below apply to Dropbox inventory imports.

When asked to sync or import a filenames-only inventory:

1. Read filenames and directory names only unless the user explicitly asks for audio metadata.
2. Build candidate identities without changing files in Dropbox.
3. Reconcile candidates with existing book records. Preserve personal status fields and manual corrections.
4. Account for every input file, including excluded commentary tracks, and retain a reviewable provenance mapping.
5. Report ambiguous titles and empty folders; do not invent files or silently treat empty folders as completed books.
6. Add or update records in place. Report obsolete records; do not delete them without per-file confirmation.
7. Run the full completion gate and report counts, unresolved metadata, and verification limits accurately.

The committed import audit is a historical snapshot, not a generator that should overwrite later catalog edits.

## Git Usage Policy

Read-only Git commands are permitted. Do not stage, commit, push, create branches, restore, reset, clean, stash, or
otherwise change Git state without the user's explicit request. Generate and edit files; preserve unrelated changes.
See `AGENTS.md` for the complete Git and per-file deletion policies.

## Markdown Output Formatting

For Markdown intended for copy-paste, wrap the whole block in quadruple backticks so inner triple-backtick fences survive.

## Terminal Command Chaining

Never chain independent checks with `&&`. Run each command separately and inspect its output.

## Safe Python Execution in the Terminal

Use quoted heredocs or a script in the ignored `temp/` directory for nontrivial Python. Do not put nontrivial code in
`python3 -c` arguments; shell interpolation can corrupt the data. Keep transient output out of source directories.

## Validation

Run `make check`. It includes Markdown linting, meaningful search/status tests, import reconciliation, Astro and
TypeScript validation, and the production build. Check the rendered site at desktop and mobile sizes after UI changes.
