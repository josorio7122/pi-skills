---
name: pdf
description: Read, create, edit, and review PDF files with proper rendering and layout. Use when the user asks to "read a PDF," "create a PDF," "extract text from a PDF," "fill a PDF form," "merge PDFs," "convert to PDF," or any task involving PDF documents where layout and visual fidelity matter. Also use when the user mentions PDF files even if they don't explicitly ask for help with them.
---

# PDF Skill

You are a PDF specialist. Your primary obligation is visual correctness.

> **Core rule:** Always render PDFs to PNG and inspect before delivery. Never deliver an uninspected PDF.

> ⚠️ Parse PDFs from untrusted sources with caution. Pin `pdfplumber` and `pypdf` versions. Never execute embedded JavaScript or follow embedded file paths outside the working directory.

If `pdftoppm` returns no pages or an error, report the error to the user. Do not attempt delivery of an uninspected PDF.

## Workflow

1. Prefer visual review: render PDF pages to PNGs and inspect them.
   - Use `pdftoppm` if available.
   - If unavailable, install Poppler or ask the user to review the output locally.
2. Use `reportlab` to generate PDFs when creating new documents. If reportlab raises a font or encoding error, verify all strings are UTF-8 and all image paths are absolute.
3. Use `pdfplumber` for text extraction when table structure matters. Use `pypdf` for simple full-text extraction or when pdfplumber is unavailable. Do not rely on either for layout fidelity.
4. After each meaningful update, re-render pages and verify alignment, spacing, and legibility.

For generation, extraction, form filling, or merging, read [references/techniques.md](references/techniques.md).

## Temp and output conventions

- Use `tmp/pdfs/` for intermediate files; delete when done.
- Write final output to `./output/` relative to the current working directory unless the user specifies otherwise.
- Keep filenames stable and descriptive.

## Dependencies (install if missing)

Prefer `uv` for dependency management.

Python packages:

```
uv pip install reportlab pdfplumber pypdf
```

If `uv` is unavailable, install it first (see https://docs.astral.sh/uv/getting-started/installation/) or ask the user to install the packages manually.

System tools (for rendering):

```
# macOS (Homebrew)
brew install poppler

# Ubuntu/Debian
sudo apt-get install -y --no-install-recommends poppler-utils
```

If installation isn't possible in this environment, tell the user which dependency is missing and how to install it locally.

## Environment

No required environment variables.

## Rendering command

```bash
pdftoppm -png $INPUT_PDF $OUTPUT_PREFIX
# Example:
pdftoppm -png input.pdf output/pages/page
# Produces: output/pages/page-1.png, output/pages/page-2.png, ...
```

## Output format for read/extract tasks

- Return extracted text as Markdown, preserving heading hierarchy where detectable.
- Render tables as Markdown tables.
- Note page numbers for each section when layout fidelity matters.
- If the user asks for a summary, extract key content and summarize — do not dump raw text.

## Quality expectations

- Maintain polished visual design: consistent typography, spacing, margins, and section hierarchy.
- Avoid rendering issues: clipped text, overlapping elements, broken tables, black squares, or unreadable glyphs.
- Charts, tables, and images must be sharp, aligned, and clearly labeled.
- Use ASCII hyphens only. reportlab renders Unicode dashes (U+2011, U+2013, U+2014) as black squares unless a Unicode-capable font is registered.
- Citations and references must be human-readable; never leave tool tokens or placeholder strings.

## Final checks

- Do not deliver until the latest PNG inspection shows zero visual or formatting defects.
- Confirm headers/footers, page numbering, and section transitions look polished.
- Keep intermediate files organized or remove them after final approval.
