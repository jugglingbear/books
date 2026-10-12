# Initial audiobook import

The initial catalog was reconciled on October 12, 2026 from directory and filenames in the owner's Dropbox audiobook
collection. No audio file, embedded tag, ebook, cover sidecar, or archive was opened. Dropbox files were not changed.

## Reconciliation

- 12,581 audio filenames map to 694 distinct catalog entries.
- Two explanatory tracks about Alvin Maker stories are recorded as exclusions in the audit.
- 89 series or associated collections have independent introductions.
- Alternate narrations, recording formats, multi-disc tracks, and duplicate editions share a record where appropriate.
- Distinct adaptations, original shorter versions, short fiction, and collections remain distinguishable.
- Every imported entry is marked listened, according to the owner's statement.
- Reading history is unknown (`read: null`), including when ebook sidecar files were present.

The [import audit](../data/audiobook-import.json) preserves relative source filenames and their book IDs. These paths
are not shipped in the website's public output. The audit is an immutable historical baseline for later reconciliation;
manual edits to book notes are the current source of truth. Explicit later removals are listed in
`removedFromCatalog` so historical import records do not cause removed books to be reintroduced.

## Empty folders

These five leaf folders contained no audio filenames and were not turned into completed-book records:

- `Brandon Sanderson/Cosmere/Elantris (GraphicAudio)`
- `EL James/1b - Grey - Fifty Shades as Told by Christian`
- `Orson Scott Card/Ender's Game (books in chronilogical order)/5 - The Hive (NOT YET RELEASED)`
- `Orson Scott Card/Ender's Game (books in chronilogical order)/6 - The Queens (NOT YET RELEASED)`
- `Orson Scott Card/Ender's Game (books in chronilogical order)/20 - Shadows Alive (NOT YET RELEASED)`

The parenthetical release notes above are literal local folder names, not current publication claims.

## Editorial choices

Obvious author-name and title spelling errors were corrected in catalog metadata; source filenames remain unchanged.
Known US title equivalents and alternate titles are reconciled where they represent the same book, such as Bill
Bryson's *Down Under* and *In a Sunburned Country*. Harry Potter's first novel uses its US title.

Series ordering begins with the local collection's order hints. Prequels and companion stories may appear between
main novels. This is a personal shelf, not a definitive bibliography or a recommended first-reading sequence. No
unrepresented volumes are inferred as listened.

Book and series descriptions are original, deliberately brief, and limited to setup or broad themes. In particular,
later-volume descriptions avoid naming plot outcomes from earlier volumes.

## Metadata and cover sources

Public [Open Library metadata](https://openlibrary.org/developers/api) supplies work references and cover editions.
Edition locations are used to prefer US covers, with other English editions and typographic jackets as fallbacks.
Translated work titles, subtitles, and volume numbers need explicit reconciliation; approximate matches alone are
not sufficient evidence that a cover depicts the right volume.

Each record keeps its selected reference and cover-edition URL. External cover availability and catalog accuracy can
change. Replace a wrong cover by editing that record's `cover`, `coverSource`, and `coverRegion` fields. Do not overwrite
reading history during metadata maintenance. Years stay unrecorded when they have not been independently verified.

The import scripts, downloaded metadata, and visual-audit sheets are in ignored `temp/`. They are one-time working
materials and should not be rerun over later manual edits. Future catalog maintenance follows the
[reconciliation guidance](../.github/copilot-instructions.md).
