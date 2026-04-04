---
name: pdf
description: Read, create, edit, and review PDF files with proper rendering and layout. Use when the user asks to "read a PDF," "create a PDF," "extract text from a PDF," "fill a PDF form," "merge PDFs," "convert to PDF," or any task involving PDF documents where layout and visual fidelity matter. Also use when the user mentions PDF files even if they don't explicitly ask for help with them.
---

# PDF Skill

Operate as a PDF specialist with visual correctness as the primary obligation. Always render PDFs to PNG and inspect before delivery. Never deliver an uninspected PDF. If `pdftoppm` returns no pages or an error, report the error immediately — do not attempt delivery of an uninspected PDF.

> ⚠️ Parse PDFs from untrusted sources with caution. Pin `pdfplumber` and `pypdf` versions. Never execute embedded JavaScript or follow embedded file paths outside the working directory.

## Prerequisites

**Python packages** — prefer `uv` for dependency management:

```
uv pip install "reportlab>=4.2" "pdfplumber>=0.11" "pypdf>=4.3"
```

If `uv` is unavailable, install it first (see https://docs.astral.sh/uv/getting-started/installation/) or ask the user to install the packages manually.

**System tools** (for rendering):

```bash
# macOS (Homebrew)
brew install poppler

# Ubuntu/Debian
sudo apt-get install -y --no-install-recommends poppler-utils
```

**Rendering command:**

```bash
pdftoppm -png $INPUT_PDF $OUTPUT_PREFIX
# Example:
pdftoppm -png input.pdf output/pages/page
# Produces: output/pages/page-1.png, output/pages/page-2.png, ...
```

If installation isn't possible in this environment, tell the user which dependency is missing and how to install it locally. No environment variables are required.

## Choosing the Right Command

| Goal | Tool / Approach |
|------|-----------------|
| Generate a new PDF | `reportlab` — see `references/techniques.md` for generation patterns |
| Extract text (table-heavy) | `pdfplumber` — preserves table structure |
| Extract text (simple / full-text) | `pypdf` — faster for plain extraction |
| Fill a PDF form | `pypdf` AcroForm API — verify AcroForm fields exist first |
| Merge PDFs | `pypdf` `PdfMerger` — see `references/techniques.md` |
| Render pages to PNG for inspection | `pdftoppm` (Poppler) — required before every delivery |

## Rules

**Rendering and delivery**

- Always render PDF pages to PNGs and inspect before delivery. Use `pdftoppm` if available.
- If rendering is impossible and the user cannot inspect locally, halt — delivery is blocked until visual inspection is confirmed.
- Do not deliver until the latest PNG inspection shows zero visual or formatting defects.
- Confirm headers/footers, page numbering, and section transitions look polished before delivery.
- After each meaningful update, re-render pages and verify alignment, spacing, and legibility.

**Tool selection**

- Use `reportlab` to generate PDFs. For generation techniques and error handling, see `references/techniques.md`.
- Use `pdfplumber` for text extraction when table structure matters. Use `pypdf` for simple full-text extraction or when `pdfplumber` is unavailable. Do not rely on either for layout fidelity.
- For generation, extraction, form filling, or merging patterns, see `references/techniques.md`.

**File management**

- Use `tmp/pdfs/` for intermediate files; delete when done.
- Write final output to `./output/` relative to the current working directory unless the user specifies otherwise.
- Keep filenames stable and descriptive.
- Keep intermediate files organized or remove them after final approval.

**Visual quality**

- Maintain polished visual design: consistent typography, spacing, margins, and section hierarchy.
- Avoid rendering issues: clipped text, overlapping elements, broken tables, black squares, or unreadable glyphs.
- Charts, tables, and images must be sharp, aligned, and clearly labeled.
- Use ASCII hyphens only. `reportlab` renders Unicode dashes (U+2011, U+2013, U+2014) as black squares unless a Unicode-capable font is registered.
- Citations and references must be human-readable; never leave tool tokens or placeholder strings.

## Output Format

- Return extracted text as Markdown, preserving heading hierarchy where detectable.
- Render tables as Markdown tables.
- Note page numbers for each section when layout fidelity matters.
- If the user asks for a summary, extract key content and summarize — do not dump raw text.

```markdown
# Annual Report 2024                          <!-- heading from PDF -->

Revenue grew 18% year-over-year, driven by..  <!-- body paragraph -->

| Quarter | Revenue ($M) | Growth |
|---------|-------------|--------|
| Q1      | 42.1        | +12%   |
| Q2      | 48.7        | +18%   |
| Q3      | 51.3        | +21%   |

_Page 3_                                       <!-- page reference -->
```

## Error Recovery

- `pdftoppm` not found → install Poppler (`brew install poppler` or `sudo apt-get install -y --no-install-recommends poppler-utils`).
- `pdftoppm` returns no pages → the PDF may be corrupt or empty. Report to user.
- Rendering impossible and user cannot inspect locally → halt delivery. The core rule (never deliver uninspected) overrides all fallbacks.
- `reportlab` font/encoding error → verify strings are UTF-8 and image paths are absolute. See `references/techniques.md`.
- `get_fields()` returns `None` → PDF has no AcroForm fields. Tell the user it cannot be filled programmatically.

## References

- `references/techniques.md` — generation techniques, error handling, form filling, and merge patterns for all PDF operations.
- https://docs.astral.sh/uv/getting-started/installation/ — `uv` installation guide.
