# Scopes

Canonical boundary between `ai-learning` (the harness) and `vault` (the learning material).

## `ai-learning` — agent harness (this directory)

Everything the **machine** needs to run pi: skills, agents, extensions, config, and the harness repo itself.

| Category | Path |
|---|---|
| Skills | `.pi/skills/teach/`, `.pi/skills/visualize/` |
| Agent definitions | `.pi/agents/*.md` |
| Extensions | `.pi/extensions/*.ts`, `.pi/extensions/visual-tools/` |
| Project config | `.pi/README.md`, `.pi/APPEND_SYSTEM.md` |
| Harness repo | `.git/`, `.gitignore` |
| Symlinked output | `viz → vault/viz` |

**Never open these in Obsidian.** They are code and instruction files for the agent.

## `vault` — learning material (human-facing)

Everything you **read and review** in Obsidian: notes, course indexes, lecture slides, rendered diagrams.

| Category | Path |
|---|---|
| Course indexes | `Courses/<course>/Course.md` |
| Source materials | `Courses/<course>/Sources/` (`.pptx`, `.pdf`, converted text) |
| Course notes and exercises | `Courses/<course>/Notes/`, `Courses/<course>/Exercises/` |
| General notes | `Notes/<topic>.md` |
| Rendered diagrams | `viz/*.png` |
| Workflow reference | `WORKFLOW.md` |

`vault` is a symlink to `C:\Users\bb891\Obsidian\Vault\Study\AI-Learning`. Edits here appear instantly in Obsidian.

## Decision table

| If you are… | Put it in |
|---|---|
| Writing a pi skill or agent definition | `ai-learning/.pi/…` |
| Adding an extension or tool | `ai-learning/.pi/extensions/…` |
| Creating a course lesson note to read later | `vault/Courses/<course>/Notes/Lectures/` |
| Creating a general note | `vault/Notes/` |
| Dropping in lecture slides | `vault/Courses/<course>/Sources/Lectures/` |
| Writing a course overview | `vault/Courses/` |
| Publishing a diagram from a subagent | `ai-learning/viz/` (lands in `vault/viz/`) |

## Rule of thumb

- **Open in Obsidian to study?** → `vault`
- **Code, config, or instructions for pi?** → `ai-learning`
