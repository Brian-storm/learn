---
name: lesson-note
description: Create source-grounded, concise step-by-step lesson guides and clear reference notes in Obsidian, using a consistent template and fragment-only wording.
---

# Lesson-note authoring

Create **concise, practical lesson guides**, not teaching notes, lecture transcripts, or extended explanations. Preserve source coverage and useful structure. Clarity and compliance are mandatory.

## Binding requirements for every agent

**This skill is an operating standard, not optional guidance. Noncompliant work is unacceptable and must not be delivered.**

- Applies to every agent creating, editing, reviewing, or reporting on lesson-note artifacts
- Includes the primary agent, every delegated agent, every subagent, and every external writing agent
- Every contributing agent must read and follow this skill before starting lesson-note work
- The delegating agent must transmit these requirements to every delegated writer and inspect all returned work
- No agent may weaken, ignore, reinterpret, or replace these requirements with its own defaults
- Before saving or reporting, the responsible agent must correct every detected violation and re-check the complete artifact
- Exceptions only for a direct user instruction explicitly changing a specific requirement; all other requirements remain binding

## Non-negotiable output style

**Every lesson and revision artifact must satisfy every applicable rule below. Any violation requires revision before delivery.**

- **MUST use headings, bullet lists, numbered lists, checklists, tables, equations, and callouts only**
- **MUST NOT use prose paragraphs**
- **MUST NOT use complete sentences** anywhere in lesson or revision notes
- Use short noun phrases, labels, fragments, and compact action phrases only
- Write numbered steps as short action fragments, one action per step
- Omit sentence-ending periods
- Omit conversational transitions, filler, repeated summaries, and introductory prose
- Keep enough detail for correct use; prioritize clarity over extreme compression

## 1. Interpret the request and define scope

- Identify task: create, revise, or review a lesson guide, revision guide, or selected section
- Identify course, topic, source set, intended scope, output paths, requested inclusions, exclusions, and depth
- Treat explicit user requirements as higher priority than defaults
- Default: concise, self-contained guide; procedural content in ordered steps; concepts in labeled reference bullets
- Every note must end with a **Self-test** section followed by an **Answers** section; **Answers** as the final section
- No extended motivation, proofs, derivations, broad background, or conversational teaching narrative
- If a material choice remains unclear—source, scope, replacement of existing content—ask one focused question
- Otherwise draft directly; no format or outline approval request

## 2. Inspect sources and map coverage

Before writing or updating vault content, read and follow `/home/bb891/vault/WORKFLOW.md`.

- Inspect relevant primary sources before drafting
- Prefer available Markdown conversions; verify against original slides/PDFs when conversion is incomplete, ambiguous, or insufficient
- Consult course objectives, tutorials, exercises, and assessments when useful for procedure coverage or exam relevance
- Inspect existing course notes and revision guide before substantial edits; match local conventions where practical
- Build a brief **internal coverage inventory**; do not add a large planning checklist to the note
  - Stated learning objectives within scope
  - Core definitions, distinctions, rules, mechanisms, formulas, procedures, and conditions
  - Methods emphasized, reused, or needed for course problems
  - Common confusions or failure conditions supported by course material
  - Logistics and incidental examples excluded unless reusable
- Classify content internally as **core**, **supporting**, or **optional**
  - Explain all core content compactly
  - Fold useful supporting details into relevant bullets or steps
  - Include optional depth only when requested or necessary to prevent misunderstanding
- Respect narrow scope; do not imply a subtopic guide covers an entire lecture
- For exam relevance, use objectives, source emphasis, exercises, and assessment information
- Never invent an exam blueprint, expected question, or prediction

## 3. Lecture guide

**Location:** `Courses/<course>/Notes/Lectures/<topic>.md`

### Default template

Use this template as a scaffold, not a mandatory set of empty sections. Omit irrelevant sections; add a section only when useful.

```markdown
# <Topic>

> [!abstract] Scope
> - <topic boundary>
> - <central ideas or guide contents>

## 1. <First concept or task>

- **Meaning / rule:** <compact reference fragment>
- **Use when:** <recognition cue>
- **Condition:** <essential assumption or requirement>
- **Steps:**
    1. <action fragment>
    2. <action fragment>
    3. <action fragment>
- **Check / result:** <verification cue; outcome>
- **Pitfall:** <common error, when supported>

## 2. <Next concept or task>

- <clear labeled notes>

## 3. <Optional practice or common errors>

- <include only when requested or materially useful>

## Sources

- [[<primary course source>]]
- [[<other source actually used>]]

## <next section number>. Self-test

1. <targeted retrieval prompt fragment?>
2. <targeted retrieval prompt fragment?>
3. <targeted retrieval prompt fragment?>

## <next section number>. Answers

1. <concise answer fragment>
2. <concise answer fragment>
3. <concise answer fragment>
```

### Procedure and method format

For each substantive usable technique or procedure, include applicable fields from this compact pattern:

- **Goal:** outcome phrase
- **Recognition cue:** situation or question cue, when useful
- **Condition:** checkable prerequisites and pass criteria
  - `- [ ]` one checkable requirement per item
  - Include applicability assumptions and success criteria
- **Steps:** numbered actions in execution order
  - One action per step
  - Short rationale only when needed to prevent a likely mistake
- **Result:** what completion or passing establishes; limits or next action when material

Do not split assumptions and pass criteria into confusing prose. Keep conditions distinct from the result. Do not force unused fields.

### Concept and reference-note format

For non-procedural material, use concise labeled bullets as relevant:

- **Meaning:** precise definition or claim fragment
- **Rule:** essential relationship, formula, or behavior
- **Use:** application or recognition cue
- **Condition:** assumptions, scope, or limits
- **Consequence:** immediate implication
- **Example:** minimal example only when needed for unambiguous use
- **Pitfall:** source-grounded common confusion

No need to mechanically include every label for every concept. Avoid label-only fragments that leave the meaning unclear.

### Equations, examples, and checks

- Important formula: display LaTeX; define symbols; state conditions and interpretation compactly
- Procedures: include formulas beside the relevant step or condition
- Examples: include only when they clarify application, distinguish cases, or prevent a likely error
- Worked examples: short, numbered actions; no extended explanatory narrative
- Every note: 3–5 concise self-test prompts, followed by matching answers as the final section
- Self-test: retrieval or application of core note content; source-grounded; no trivia or padding
- Answers: same numbering as prompts; concise, checked, fragment-only; no hints that reveal answers in the prompt section
- Cumulative revision note: self-test coverage across the guide's current substantive content; refresh after relevant updates
- Additional quizzes or practice sets: only when requested
- Common errors: include only when relevant and source-grounded
- Tables: concise comparisons across a few aligned dimensions only

## 4. Cumulative course exam-revision guide

**Location:** `Courses/<course>/Notes/Exam Revision/<course>-Exam-Revision.md`

- Default for course lecture requests: update both lecture guide and cumulative revision guide
- If the user requests one artifact only, update only that artifact
- For general or cross-course topics, no course revision guide unless requested
- Maintain one cumulative guide per course, organized by lecture/topic in course order
- Inspect existing guide; preserve unrelated content; update only relevant section unless broader edits requested
- Use source order or numbering; label uncertain ordering rather than guessing
- Distill, do not duplicate lecture-guide explanations, proofs, or examples
- Keep exam material actionable and compact:
  - Recognition cues
  - Essential definitions, distinctions, and formulas
  - Procedure conditions and numbered steps
  - Result interpretation and limitations
  - Common pitfalls
  - Mandatory note-level self-test and matching answer section at the end
  - Additional practice items only when requested or required by local conventions
- Label inferred prioritization as inference when useful; do not claim expected exam appearance without explicit source support

### Revision-section template

```markdown
## <Lecture / topic>

1. **<Concept or method>**
    - **Rule / meaning:** <reference fragment>
    - **Recognition cue:** <when to use>
    - **Condition:**
        - [ ] <checkable prerequisite or pass criterion>
    - **Steps:**
        1. <action fragment>
        2. <action fragment>
    - **Result / pitfall:** <interpretation or error cue>

- **Guide:** [[<lecture guide>]]
- **Sources:** [[<source>]]

## <next section number>. Self-test

1. <targeted retrieval prompt fragment?>
2. <targeted retrieval prompt fragment?>
3. <targeted retrieval prompt fragment?>

## <next section number>. Answers

1. <concise answer fragment>
2. <concise answer fragment>
3. <concise answer fragment>
```

Use only applicable fields. Number distinct concepts when that improves navigation; avoid numbering every isolated reminder. Place a note-level **Self-test** and matching **Answers** section after all topic content and sources; **Answers** must be the final section.

## 5. Presentation and Obsidian conventions

### Structure and hierarchy

- H1: unnumbered note title
- Substantive H2 sections: hierarchical numbering, such as `1.`, `2.`
- H3 subsections: `1.1`, `1.2`; meaningful H4: `1.1.1`
- Renumber affected headings when sections move
- Do not number metadata, source headings, callout titles, ordinary bullets, or table rows
- Numbered lists for ordered procedures, derivations, and workflows
- Bullets for unordered facts, conditions, comparisons, and supporting detail
- Four-space indentation for nested lists; consistent nesting throughout

### Scanability

- Bold key terms, method names, labels, assumptions, conditions, distinctions, and result cues
- Bold important phrases only; no full bold paragraphs
- Informative headings; shallow hierarchy; one idea per bullet where practical
- Avoid paragraphs, dense prose, redundant statements, and repeated body summaries
- Preserve necessary specificity; do not compress away conditions, exceptions, or interpretation

### Callouts

Use restrained native Obsidian callouts only when the role is clear:

- `[!abstract]` — scope and compact guide map; required at start of lecture guide
- `[!tip]` — useful strategy or recognition cue
- `[!info]` — qualification or clarification
- `[!example]` — short worked example
- `[!warning]` — important condition or common pitfall
- `[!success]-` — optional collapsed answer section, only when requested
- Concise callouts; no nested callouts; no whole-note callout
- No decorative callouts or color

### Math and links

- Inline math: `$...$`
- Display math: `$$...$$` on separate lines
- No `\(...\)` or `\[...\]` delimiters
- Attach display equations to the introducing bullet; group symbols, conditions, and interpretation nearby
- Markdown tables: avoid unescaped `|` inside math; use `\lvert ... \rvert` or move formula outside table
- Link primary course source near the top when useful; include sources actually used
- Check every Obsidian link and vault path
- No custom CSS or font instructions unless requested

## 6. Mandatory compliance check before saving

**Do not save, publish, or report a lesson-note artifact until every applicable check passes. Revise and repeat this check after any change.**

- **Coverage:** all core items within requested scope; no important method or condition omitted
- **Accuracy:** correct terminology, formulas, assumptions, examples, and outcomes; uncertainty flagged or verified
- **Actionability:** procedures executable in order; inputs and checks clear
- **Clarity:** concise fragments; no complete sentences; no prose paragraphs; labels meaningful
- **Self-test:** 3–5 relevant prompts; answer section present; matching checked answers; answers as final section
- **Separation:** lecture guide usable as a practical guide; revision section compact and non-duplicative
- **Formatting:** correct hierarchy, indentation, bolding, callouts, math, and links
- **Vault quality:** workflow-compliant locations; useful existing content preserved
- **Source integrity:** no fabricated examples, citations, errors, or exam predictions
- Any failed check: stop delivery, correct the artifact, and re-run the full checklist

## 7. Report the result

- Exact path(s) created or updated
- Brief artifact description
- Headings or bullets only; no complete sentences; no extended explanation
