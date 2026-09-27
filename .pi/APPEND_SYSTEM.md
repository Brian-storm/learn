# User & Project Context

## Workspace Layout

### Vault (Obsidian)
- **Path**: `/home/bb891/vault` → `/mnt/c/Users/bb891/Obsidian/Vault/Study/AI-Learning`
- **Structure**:
  - `Ongoing/` — active courses with lecture materials (`.pptx`, `.pdf`)
  - `Courses/` — course index (currently empty)
  - `lessons/` — converted/studied lessons
  - `viz/` — rendered diagrams and visuals

### Pi Working Directory
- **Path**: `/home/bb891/ai-learning/`
- **Purpose**: coding agent sessions, agent definitions, skills
- **Subdirs**:
  - `.pi/agents/` — project-local subagent definitions (content-getter, content-parser, mermaid-maker, researcher, svg-maker)
  - `.pi/skills/` — project-local skills (teach, visualize)
  - `courses/` — course stubs (empty; actual content lives in vault)

## Active Courses

| Course | Lectures | Labs | Location |
|--------|----------|------|----------|
| CSCI3150 | 4 PPTX (Lec01–Lec04) | lab01, lab2 | `vault/Ongoing/CSCI3150/` |
| MATH3215 | 3 PDF (L1–L3) | — | `vault/Ongoing/MATH3215/` |
| AIST1000 | 3 lecture dirs + 3 tutorial dirs | — | `vault/Ongoing/AIST1000/` |
| AIST3030 | 5 PDF partials | — | `vault/Ongoing/AIST3030/` |

## Available Content Conversion Tools
- `markitdown` at `~/.local/bin/markitdown` ✓ (PPTX → MD, preferred)
- `python-pptx` (installed via pip) ✓ (fallback for PPTX text extraction)
- `pdftotext` ✗ (not installed)
- `pandoc` ✗ (not installed)

## Agent Inventory (Project-Local)
Spawn these when needed:
- `content-getter` — maps workspace, discovers courses/files/tools
- `content-parser` — converts `.pptx`/`.pdf` to `.md` using best available tool
- `mermaid-maker` — creates dependency graphs, flowcharts, system diagrams
- `svg-maker` — creates spatial/geometric visuals (number lines, vectors, plots)
- `researcher` — web search for facts, definitions, verification

## User Preferences & Context
- **Goal**: deeply understand CSCI3150 (Operating Systems) from principles up, not memorize
- **Learning style**: Socratic for reason-able concepts; expository delivery when energy is low
- **Weak areas**: Unix system calls (fork/exec/pipe), process memory layout
- **Comfortable with**: C syntax, basic pointers, command line
- **Prefers**: diagrams for spatial concepts, quiz-based edge-finding before teaching
- **Vault access**: user manages Obsidian vault on Windows side; symlinked into WSL

## Course-Specific Notes

### CSCI3150 — OS Principles
- Textbook reference: OSTEP (Operating Systems: Three Easy Pieces)
- Lecture coverage so far:
  - Lec01: Course overview, Von Neumann, OS functions (virtualization, system calls), concurrency race example
  - Lec02: Process system calls — fork, wait, exec, exit; zombie/orphan processes; background processes
  - Lec03: Memory API — malloc, free, calloc, realloc; common errors (leak, dangling, double-free)
  - Lec04: File & directory — open/read/write/lseek, dup/pipe, fsync, rename, stat, hard/soft links
- Known gaps from probing: fork return values, exec never-returns behavior, free/dangling pointer semantics, hard vs symbolic links

## Quick Reference
- Convert a lecture: `markitdown Lec0X.pptx -o Lec0X.md`
- Standard vault course path: `vault/Ongoing/<course>/`
