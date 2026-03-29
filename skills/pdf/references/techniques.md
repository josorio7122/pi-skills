# PDF Techniques

Reference for PDF generation, extraction, form filling, and merging.

---

## Generate PDFs with reportlab

Use `reportlab` to create PDFs programmatically. All strings must be UTF-8; all image paths must be absolute.

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("output/document.pdf", pagesize=letter)
width, height = letter

c.setFont("Helvetica", 12)
c.drawString(72, height - 72, "Hello, World!")
c.save()
```

**Common patterns:**

- Use `c.drawString(x, y, text)` for simple text (y=0 is bottom of page)
- Use `platypus` (`SimpleDocTemplate`, `Paragraph`, `Table`) for multi-page layouts with flow
- Embed images with `c.drawImage(path, x, y, width, height)` — path must be absolute
- Use `c.showPage()` to advance to a new page before calling `c.save()`

**Font note:** Use ASCII hyphens only. reportlab renders Unicode dashes (U+2011, U+2013, U+2014) as black squares unless a Unicode-capable font is registered (e.g., `registerFont(TTFont('DejaVu', 'DejaVuSans.ttf'))`).

If reportlab raises a font or encoding error, verify all strings are UTF-8 and all image paths are absolute.

---

## Extract Text with pdfplumber / pypdf

Use `pdfplumber` when table structure matters. Use `pypdf` for simple full-text extraction or when pdfplumber is unavailable. Do not rely on either for layout fidelity.

**pdfplumber (tables and structured text):**

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        print(page.extract_text())
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                print(row)
```

**pypdf (simple full-text):**

```python
from pypdf import PdfReader

reader = PdfReader("document.pdf")
for page in reader.pages:
    print(page.extract_text())
```

---

## Fill PDF Forms (AcroForms)

Use `pypdf` to discover fields and fill AcroForm PDFs.

**Step 1 — Discover field names:**

```python
from pypdf import PdfReader

reader = PdfReader("form.pdf")
print(reader.get_fields())  # returns dict of field name -> field object
```

If `get_fields()` returns `None` or an empty dict, the PDF has no AcroForm fields and cannot be filled programmatically. Tell the user.

**Step 2 — Fill and write:**

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("form.pdf")
writer = PdfWriter()
writer.clone_reader_document_root(reader)
writer.update_page_form_field_values(writer.pages[0], {"field_name": "value"})
with open("filled.pdf", "wb") as f:
    writer.write(f)
```

Render and inspect the filled PDF before delivery.

---

## Merge PDFs

Use `pypdf`'s `PdfMerger`:

```python
from pypdf import PdfMerger

merger = PdfMerger()
for f in files:
    merger.append(f)
merger.write("merged.pdf")
merger.close()
```
