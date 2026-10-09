---
name: lesson-note
description: Generate source-grounded lecture notes and cumulative course exam-revision notes using a clear coverage-to-draft workflow and the learner's concise, explanation-first defaults.
---

# Lesson-note authoring

The goal is a note that is concise without leaving the learner with unexplained labels. For course lectures, keep two artifacts distinct:

1. **Lecture note:** explains the lecture's key ideas.
2. **Course exam-revision note:** accumulates compact, exam-oriented reference sections for each lecture.

Use the workflow below. Adapt the presentation to the subject, but do not skip the scope, coverage, or final accuracy checks.

## 1. Interpret the request and set scope

- Identify the requested artifact: new lecture note, lecture-note revision, course revision guide, feedback only, or another note type. Do not edit for advice-only requests.
- Identify course, lecture/topic, source range, and requested depth. Apply any requested inclusions, exclusions, length, practice format, or output restrictions. Ordinary wording is sufficient; no special syntax is required. Explicit user instructions override defaults.
- Default depth is **concise but self-contained**: explain the important ideas briefly, without turning the note into a transcript or a bare glossary. If asked for balanced or comprehensive depth, expand the reasoning and examples; keep optional material visibly separate.
- If a material choice is unclear (for example, which course/source, what scope, or whether an existing note should be replaced), ask one focused clarifying question. Otherwise draft directly; do not ask for approval of a format or outline.
- For a course lecture note, update both the lecture note and the course's cumulative exam-revision note by default. If the user asks for only one, update only that artifact. For general or cross-course topics, do not create a course revision guide unless requested.

Understand plain-language controls such as:

- “Make the standard note for Lecture 4 and update the course revision guide.”
- “Cover only topics X and Y; keep it concise, include one worked example, and skip practice questions.”
- “Update only the exam-revision section for Lecture 4; leave the lecture note unchanged.”

These are examples, not required syntax. Honor the requested output rather than filling the default template mechanically.

## 2. Inspect sources and make a coverage inventory

Before drafting, inspect the relevant source material. Prefer available Markdown conversions; check the original slides/PDF or related sources when the conversion is incomplete, ambiguous, or insufficient to verify a claim. Consult course objectives, tutorials, exercises, and assessment information when useful.

Create a brief **internal coverage inventory**—it guides drafting but need not appear as a large checklist in the note:

- Include every stated learning objective within the requested scope.
- Identify substantive lecture content: defined terms, important distinctions, mechanisms, claims, formulas, procedures, worked methods, and concepts that are emphasized, reused, or needed to understand course problems.
- Exclude logistics and incidental examples unless they teach a reusable idea or method.
- Classify content as **core**, **supporting**, or **further exploration**. Every core item must be explained in the main note. Supporting items may be folded into those explanations. Put relevant deeper proofs, context, applications, or related theorems in an optional appendix.
- Respect a narrower user-requested scope. Do not silently imply that a subtopic note covers an entire lecture.

For exam-oriented material, use source emphasis, objectives, assessment information, and exercises as evidence. Never invent an exam blueprint or promise that a topic will appear. Label editorial prioritization as inferred when that distinction matters.

## 3. Draft the individual lecture note

**Location:** `Courses/<course>/Notes/Lectures/<topic>.md`

Use a predictable set of anchors, but omit any section that would be empty or unhelpful:

1. **Orientation / key concepts:** briefly state the topic and give a compact map or checklist of the central ideas. It must cover the core inventory without repeating the full explanations below.
2. **Main explanation:** group related concepts and order them so each idea has the context or prerequisites it needs. Do not mechanically follow slide order when another order teaches better.
3. **Quick check / common errors:** usually include 3–5 short self-test or practice questions, with checked answers or hints after the questions (a collapsible answer key is fine). Include likely errors with corrections when they are relevant; ground them in course material or label them as likely pitfalls.
4. **Further exploration:** when there is relevant deeper material, put substantial proofs, derivations, context, applications, and related theorems here so they do not interrupt the core explanation.
5. **Sources:** at the end, link the lecture and the other sources actually used. Distinguish primary course material from supplementary references. Also link the principal source near the top when an Obsidian wikilink exists.

For **each core concept**, use this as an internal explanatory checklist—not repeated subheadings:

- **Meaning:** What does the term, claim, mechanism, or method mean? State genuine definitions precisely.
- **Motivation:** What problem does it solve, what observation motivates it, or how does the reasoning lead to it? Avoid presenting derived claims as arbitrary facts.
- **Use:** How can the learner recognize when it applies, use it, or infer its consequences? State important conditions, assumptions, and limits.

Explain these dimensions naturally. Not every concept needs equal space: keep simple concepts short, and give difficult or easily confused concepts the explanation they need. Add a small worked example, comparison, or diagram when it resolves a real point of confusion; do not add one merely to satisfy a quota.

For formulas and procedures:

- Give formulas with symbol meanings, applicability conditions, and interpretation. Explain what terms count when that is a common source of error.
- For a procedure, show the goal/inputs, recognition cues, ordered steps, and expected result or check.
- Use display LaTeX for important equations. Use tables only for concise comparisons across a few aligned dimensions.

### Obsidian readability and visual style

- **Match the course's local style:** before drafting or substantially revising a lecture note, inspect one or two existing lecture notes in the same course and the cumulative revision guide. Follow their established callout, heading, and list conventions by default, unless the user asks for a different style. Prefer native Obsidian callouts over HTML `<details>` when the course notes use callouts for collapsed answer keys.
- Prefer Obsidian’s built-in callouts as restrained, semantic color accents: `[!abstract]` for scope, `[!tip]` for takeaways or recognition cues, `[!info]` for clarifications, `[!example]` for worked examples, `[!warning]` for pitfalls, and a collapsed `[!success]-` callout for answer checks.
- Keep callouts concise, purposeful, and **non-nested**. Use separate callout blocks rather than putting one callout inside another; avoid making every paragraph a colored box.
- Use heading levels to organize the page. Bold **key terms, method names, prerequisites, assumptions, and conditions**—for example, **linearly independent columns**—so they stand out during review. Use italics sparingly for secondary emphasis; do not bold whole sentences indiscriminately.
- When concepts can be cleanly itemized, prefer concise bullets or numbered steps over dense prose paragraphs. Use bold lead-ins such as `**Requirement:**`, `**Consequence:**`, `**Why it matters:**`, and `**Pitfall:**`; preserve a short connecting explanation where it helps the reasoning flow. Do not split every sentence into a bullet.
- Do not add custom CSS or prescribe fonts unless the user asks; built-in callout colors are determined by the active Obsidian theme.
- For Obsidian math, use `$...$` for inline expressions and `$$` on separate lines for display equations. Avoid `\(...\)` and `\[...\]` delimiters. In Markdown tables, avoid unescaped `|` inside math; use `\lvert ... \rvert` for absolute values or move the expression outside the table.

## 4. Update the cumulative course exam-revision note

**Location:** `Courses/<course>/Notes/Exam Revision/<course>-Exam-Revision.md`

Maintain one cumulative note per course, with compact lecture-by-lecture sections in course order. Use source numbering/order; label uncertain ordering rather than guessing. Inspect an existing guide first, preserve unrelated sections, and update only the relevant lecture section unless broader changes are requested.

For each lecture section, include the applicable exam-oriented reference material:

- key formulas, definitions, and distinctions, with conditions and symbol meanings;
- cues for recognizing question types and choosing a method;
- concise solution procedures and useful answer patterns;
- likely errors and how to avoid or correct them;
- representative practice questions with checked answers, hints, or solution cues when supported by the material.

Prefer actionable cues (“if the question gives/asks X, consider method Y”) over a formula dump. Do not force an empty category: if a lecture has no relevant formula or procedure, cover its applicable concepts instead. Keep sections compact and scannable, but do not force a literal one-page limit. Link each section to its lecture note and sources. Distill the lesson note rather than copying its explanations, proofs, or examples wholesale.

## 5. Verify before saving

Use this checklist on both artifacts:

- **Coverage:** every core item in the inventory is explained in the lecture note; the revision section reflects the requested scope. No important item disappeared during condensation.
- **Understanding:** core concepts have a clear meaning, motivating reason, and use/recognition cue as appropriate; the note connects ideas instead of listing isolated facts.
- **Accuracy:** terminology matches the course; source ambiguities are verified or flagged; formulas, examples, calculations, and answer keys are checked.
- **Separation:** the lecture note teaches; the course guide cues quick recall and exam methods; deeper exploration is optional and does not crowd out the core.
- **Readability:** headings are informative, paragraphs and table cells are concise, summaries do not duplicate the body, and diagrams clarify rather than decorate. Use bullets for compact sets of definitions, distinctions, or implications; use numbered lists for ordered derivations, procedures, and worked solution steps. Keep connecting prose where it explains why steps follow. Check that the callout and list style matches the existing course notes.
- **Vault quality:** paths follow `/home/bb891/vault/WORKFLOW.md`; links resolve; LaTeX is valid; useful existing content is preserved.

Do not fabricate errors, examples, citations, or exam predictions to fill a section. If the sources do not support a detail, verify it from a reliable related source when appropriate or state the uncertainty.

## 6. Report the result

Give the exact path(s) created or updated and briefly describe what each contains. If only advice or feedback was requested, make no file changes.
