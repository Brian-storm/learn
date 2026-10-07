---
name: md-to-pdf
description: Convert one or more Markdown notes into clean, searchable PDFs with readable headings, code blocks, pipe tables, lists, and Obsidian callouts. Use when the user asks to export, print, or create PDFs from Markdown notes.
compatibility: Requires Python 3, DejaVu Sans fonts, and network access on the first run if ReportLab is not already installed.
---

# Markdown to PDF workflow

Use this skill when the user asks to turn Markdown notes into PDFs. The bundled renderer is designed for terminal-readable study notes and supports headings, paragraphs, bold/italic/inline code, ordered and unordered lists, fenced code, pipe tables, Obsidian callouts such as `> [!tip]`, and YAML frontmatter (omitted from the printed content).

## Run it

The launcher is bundled at `scripts/md-to-pdf` relative to this skill directory. It uses an existing ReportLab installation when possible; otherwise, it creates a reusable environment in `${XDG_CACHE_HOME:-~/.cache}/pi-md-to-pdf/venv` and installs the pinned-compatible dependency range from `requirements.txt` once. Do not recreate a temporary converter or temporary virtual environment for each request.

Convert one or more specific notes:

```bash
.pi/skills/md-to-pdf/scripts/md-to-pdf path/to/note.md [another-note.md ...]
```

By default each PDF is written beside its source with the same basename and `.pdf` extension. An existing matching PDF is replaced so a rerun refreshes the export. To collect outputs in a folder, use:

```bash
.pi/skills/md-to-pdf/scripts/md-to-pdf --output-dir path/to/pdfs path/to/note.md another-note.md
```

Optional controls:

- `--paper A4` (default) or `--paper Letter`
- `--no-overwrite` to keep existing PDFs unchanged
- Set `MD_TO_PDF_PYTHON` if Python 3 is installed under a nonstandard command/path.

## Procedure

1. Resolve the exact source note(s) from the request or current context. Do not batch-convert unrelated Markdown files.
2. Run the bundled launcher with quoted paths when a path contains spaces. Do not edit the Markdown source as part of export.
3. Check the command succeeded and verify the resulting PDF exists and is non-empty. If available, use `file`, `pdfinfo`, or text extraction with `pdftotext`/`pypdfium2` to confirm it is a valid, nonempty PDF and report its page count. Do not render PDF pages to images or inspect image previews unless the user asks; metadata/text checks are sufficient by default.
4. Report the exact PDF paths and any skipped or failed inputs.

## Fidelity notes

This lightweight renderer preserves the common Markdown structures used in the study vault. It does not typeset LaTeX, resolve Obsidian wikilinks, or embed linked images/attachments; these are kept as text or omitted from visual rendering. If those features are essential to a requested export, tell the user before choosing a different conversion path. Keep mathematical notation plain-text when that matches the source note.
