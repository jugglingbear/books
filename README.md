# Books

A personal library of books read and audiobooks listened to, with a searchable cover grid and spoiler-free book and
series pages. Built with Astro and published to [Books on GitHub Pages](https://jugglingbear.github.io/books/).

## The text database

- `vault/books/*.md`: one editable Markdown record per distinct work.
- `vault/series/*.md`: one paragraph introducing a series or associated collection.
- `vault/universes/*.md`: shared-universe introductions and separately identified related drafts.
- `data/audiobook-import.json`: the filenames-only provenance of the initial audiobook import.

The Markdown body is the description. YAML frontmatter holds the title, author credit, series, order hint, independent
reading/listening status, and optional cover and reference URLs. Open `vault/` in Obsidian or any text editor.

```yaml
read: null
listened: true
```

`null` means reading history has not been recorded. Set `read: true` when a book has been read; leave `listened: true`
to show both badges. Set an explicit `false` only when that status is known. The public site is a view of the committed
catalog; visitors cannot change the owner's reading history. New photo imports default to unread (`read: false`) and
not listened (`listened: false`) unless confirmed otherwise, while preserving any existing recorded history.

Known audiobook edition sources are retained as optional catalog metadata in `audioSources`, but are not displayed
on the site. Reading and listening badges remain independent of the edition source. Existing source metadata is
preserved so the display can be restored later if desired.

See [catalog guidance](.github/copilot-instructions.md) and the [import notes](docs/import.md) before adding records.

## Add books from photos

Give the assistant photos of covers or readable spines and ask to add them. Include reading or listening status when
it differs from the defaults above. The [photo-import procedure](docs/photo-import.md) covers identification, duplicate
checks, online cover and metadata research, spoiler-free descriptions, series notes, and validation.

## Develop locally

Use Node.js 22.12 or newer and the pinned pnpm version from `package.json`, matching the Quotes project.

```bash
make install
make serve-local
```

The site serves at [the local Books URL](http://127.0.0.1:4321/books/). Search title, author, series, or universe;
combine the filters (including genre), switch reading/listening status, and share the resulting query URL.
The `/` keyboard shortcut focuses search.
Without JavaScript, all book links remain available, but filtering and pagination require JavaScript.

```bash
make check
make build
make preview
```

`make` or `make help` lists the available commands. The production output is `dist/`.

## Publish with GitHub Pages

The repository's **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. This setting already
matches Quotes. The included `.github/workflows/deploy-pages.yml` builds and deploys pushes to `main`, or can be run
manually from the Actions tab after it has been committed and pushed.

After reviewing and committing changes, run:

```bash
make publish
```

This validates the site, requires a clean `main` branch, and pushes it to `origin`. Watch the **Deploy to GitHub Pages**
workflow; its deployment step publishes to the `github-pages` environment. The first successful deployment is what
adds the live-site banner seen in the Quotes screenshot. No Jekyll setup or custom domain is needed.

The Astro base path is `/books/`. Do not copy `/quotes/` into links or configuration.

## Genres and sorting

Book records contain editable `genres` lists. These are broad editorial shelf categories, and a title can have
multiple genres. Genre selection combines with the other filters and is preserved in the search URL.
Book and series titles sort A–Z ignoring leading “A,” “An,” and “The,” with numeric volume ordering.
Displayed titles stay unchanged; author sorting uses the displayed author credit.
Series pages default to series order. The three hero books are fixed featured selections.

## Shared universes

An optional `universe: "The Cosmere"` field groups a book across series without changing its existing `series` or ID.
The **Series & universes** browse page and grouped dropdown link these shelves. Universe pages show only cataloged
works, grouped by series, standalones/short fiction, and collections; counts describe records, not unique stories.
Search for a universe name or share a filter such as `?universe=The%20Cosmere`.

Each universe note has `title`, `author`, a spoiler-free paragraph, optional labeled `sources`, and a `relatedBooks`
list of existing IDs for non-canon drafts. Related drafts appear separately and are excluded from canonical universe
counts and filtering. Verify membership using author/publisher references; never infer it solely from author credit.

## Covers and descriptions

Cover URLs point to public image services and have an exact source link where available. US editions are preferred
when their publication location supports that designation. Missing or failed images have a typographic fallback.
Use `coverFit: "contain"` for square audiobook artwork or other covers whose full image should stay visible.
Descriptions are original, short, and focused on setup and themes rather than plot outcomes.

The catalog and build do not make metadata API requests. Visitors fetch only the cover images and optional web fonts;
search stays entirely in the browser. Cover copyright remains with the respective rights holders. Book references
and cover-edition links appear on detail pages.

## Repository guidance

AI guidance and Markdown tooling were ported from Quotes, retaining its Git, deletion, scratch-file, and coding
policies while replacing quote-specific catalog rules. Start with [AGENTS.md](AGENTS.md).
