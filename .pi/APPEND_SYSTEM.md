# User & Project Context

## Workspace Layout

### Vault (Obsidian)
- **Path**: `/home/bb891/vault` → `/mnt/c/Users/bb891/Obsidian/Vault/Study/AI-Learning`
- **Structure**:
  - `Courses/<course>/` — per-course indexes, sources, exercises, and study notes
  - `Notes/` — general or cross-course notes
  - `viz/` — rendered diagrams embedded in notes
  - `WORKFLOW.md` — Pi/Obsidian operating guide

### Pi Working Directory
- **Path**: `/home/bb891/ai-learning/`
- **Purpose**: coding agent sessions, agent definitions, skills
- **Subdirs**:
  - `.pi/agents/` — project-local subagent definitions
  - `.pi/skills/` — project-local skills
  - `courses/` — harness-side course stubs, if any (course content lives in vault)

## Courses in the Vault

| Course | Current content | Vault location |
|--------|-----------------|----------------|
| AIST1000 | Lectures, tutorials, quiz prep, lecture notes | `vault/Courses/AIST1000/` |
| AIST3030 | Lecture sources and lecture notes | `vault/Courses/AIST3030/` |
| CSCI3150 | Four lecture decks, labs, and study notes | `vault/Courses/CSCI3150/` |
| CSCI3160 | Lecture/tutorial sources, exercises, and working notes | `vault/Courses/CSCI3160/` |
| MATH3215 | Three lecture PDFs | `vault/Courses/MATH3215/` |

## Available Content Conversion Tools
- `markitdown` at `~/.local/bin/markitdown` ✓ (PPTX → Markdown, preferred)
- `python-pptx` ✓ (fallback for PPTX text extraction)
- `pdftotext` ✗ (not installed)
- `pandoc` ✗ (not installed)

## Project Skills (Pi)
- `teach` — teach through first principles and adaptive retrieval practice.
- `visualize` — create and embed a focused diagram when it materially clarifies a lesson.
- `md-to-pdf` — export Markdown notes as searchable PDFs; invoke with `/skill:md-to-pdf`.

## Agent Inventory (Project-Local)
- `content-getter` — maps workspace, courses, files, and tools
- `content-parser` — converts `.pptx`/`.pdf` to `.md` using available tools
- `mermaid-maker` — creates dependency graphs, flowcharts, and system diagrams
- `svg-maker` — creates spatial/geometric visuals
- `researcher` — web search for facts, definitions, and verification

## User Preferences & Context
- **Goal**: deeply understand CSCI3150 (Operating Systems) from principles up, not memorize.
- **Learning style**: Socratic for reason-able concepts; expository delivery when energy is low.
- **Weak areas**: Unix system calls (`fork`/`exec`/`pipe`), process memory layout.
- **Comfortable with**: C syntax, basic pointers, command line.
- **Prefers**: diagrams for spatial concepts and quiz-based edge-finding before teaching.
- **Vault access**: user manages Obsidian on Windows; the vault is symlinked into WSL.

## Course-Specific Notes

### CSCI3150 — OS Principles
- Textbook reference: OSTEP (Operating Systems: Three Easy Pieces).
- Lecture coverage: Lec01 overview/virtualization/concurrency; Lec02 process system calls; Lec03 memory API; Lec04 file/directory calls and links.
- Known gaps from probing: `fork` return values, `exec` never-return behavior, `free`/dangling-pointer semantics, hard vs symbolic links.
- Course materials and notes: `vault/Courses/CSCI3150/`.

## Vault Conventions
- Course materials belong under `vault/Courses/<course>/`.
- Original lecture/tutorial files go under `Sources/Lectures/` or `Sources/Tutorials/`; Markdown conversions/extractions go under `Sources/Converted/Lectures/` or `Sources/Converted/Tutorials/`. Do not create a separate `Sources/Extracted/` folder.
- Exercise PDFs go under `Exercises/Regular/` or `Exercises/Special/`; regular-exercise conversions go under `Exercises/Regular/Converted Markdown/`.
- Synthesized study material goes under `Notes/`, not `Sources/Converted/`.
- General or cross-course notes go under `vault/Notes/`.
- Course indexes are `Courses/<course>/Course.md`; the vault landing page is `Home.md`.
- Diagrams are published to `vault/viz/` through the `ai-learning/viz` symlink.
- Convert a lecture: `markitdown input.pptx -o output.md`.
- Convert notes to PDF: `.pi/skills/md-to-pdf/scripts/md-to-pdf path/to/note.md [another-note.md ...]`.
