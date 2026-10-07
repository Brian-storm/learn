---
name: lesson-note
description: Create or improve clear, source-grounded study notes and exam revision notes in the Obsidian vault. Use when the user asks for a lesson note, lecture summary, study guide, or to improve note readability.
---

# Lesson-note authoring

Create notes that are accurate, selective, and easy to scan. A note should help the learner retrieve and apply ideas, not preserve every slide or compress a lecture into an intimidating wall of text.

## 1. Establish the task and inspect sources

- Identify whether the user wants a new note, a rewrite, or advice only. **Do not edit files when the user asks only for suggestions.**
- For course material, inspect the relevant source files before drafting. Use available lecture conversions first; check original/related material when conversion is incomplete or when exam relevance needs corroboration.
- Follow vault conventions in `/home/bb891/vault/WORKFLOW.md` when working there. Course-specific lecture notes belong in `Courses/<course>/Notes/Lectures/`; study guides spanning lectures belong in `Notes/Study Guides/`; general topics belong in `Notes/`.
- If the user explicitly limits scope (for example, “only useful information that may be tested”), honor that. Do not make up an exam blueprint. State briefly that prioritization is inferred from source emphasis, course assessment information, and relevant exercises—not a guarantee of exam coverage.
- When exam relevance is unclear, prioritize definitions, distinctions, procedures, formulas, worked problem patterns, stated learning objectives, and concepts reused in exercises/assignments. Omit administrative details, decorative anecdotes, and unsourced predictions unless specifically requested.
- Keep the source note linked near the top with an Obsidian wikilink when one exists.

## 2. Design for readability before writing

Use a layered structure so the learner can choose the depth they need:

1. **At-a-glance map:** a few core relationships, distinctions, or steps (often 3–6 bullets or a small diagram).
2. **Core chunks:** short, question-led sections, each answering one useful question.
3. **Practice/retrieval:** a small self-test; include an answer key only when helpful, preferably collapsible in Obsidian.

Aim for a scan-friendly revision sheet, not a mini-textbook. Prefer a small number of meaningful sections over many tiny headings. Make the page visually breathable:

- Keep paragraphs short (usually 1–3 sentences); split a paragraph when it contains multiple ideas.
- Use descriptive headings phrased around the learner's question or task (e.g. “Which split tunes hyperparameters?”).
- Use bullets for parallel points and numbered steps for procedures.
- Use tables only when comparing a few aligned items. Keep cells brief; turn long explanations into prose or separate bullets instead of building wide, dense tables.
- Put key equations on separate display-math lines in LaTeX and explain the symbols/interpretation nearby.
- Use Obsidian callouts sparingly for high-value warnings, rules, or scope notes. Avoid decorative callout overload.
- Use a compact diagram when it makes a hierarchy, flow, state, or spatial relationship much clearer than prose. Do not add a diagram just to decorate; use the `visualize` skill where appropriate.
- Avoid repeating the same explanation in a summary, body, and “common mistakes” section. If a recap is useful, make it a genuinely shorter checklist.
- Keep examples small and targeted: use one to clarify an abstract distinction or show how a method is applied, not a gallery of anecdotes.

A useful default is one screen of orientation followed by short chunks. Do not enforce arbitrary page or word limits: preserve necessary explanations, but make supplementary detail visibly optional (for example, a “Further detail” subsection or `<details>` block).

## 3. Select and explain content

- Preserve the distinction between **source-supported fact** and **editorial prioritization**. Never label content “definitely on the exam” without explicit evidence.
- Explain core ideas in terms of what they mean, how to recognize/apply them, and what they are commonly confused with.
- Connect related ideas explicitly, but avoid forcing a dependency graph into a note when a short hierarchy or sequence is clearer.
- For procedures, show inputs/goal, ordered steps, and the result or check.
- For formulas, state when they apply and what the denominator/terms count when that is a common source of mistakes.
- Use terminology consistent with course materials. Correct obvious conversion artifacts using context, but do not silently guess at ambiguous source text; flag uncertainty or verify another source.
- Distinguish essential core material from optional context. A concise “Common traps” list should add contrast or diagnose a likely mistake, not restate every previous section.

## 4. Retrieval practice

When a self-test fits the request, include about 3–6 questions that test different actions: define, distinguish, choose a method, interpret, calculate, or explain a consequence. Avoid questions answerable by merely rereading the heading. Keep answers after the questions or in a collapsible answer key. Verify calculations and ensure every answer is supported by the source or standard course content.

If the user requests only a note, create the note directly; do not interrupt with a teaching-session quiz or a multi-step lesson-plan approval process. Ask a clarifying question only when a missing choice would materially change the note (such as whether to overwrite an existing note or which course/source they mean).

## 5. Save and report

- Create or update the requested note in the correct vault location; preserve existing useful links and metadata when revising.
- Include lightweight metadata if useful: course, lecture/topic, date, source link, and scope. Avoid metadata that makes a simple note cumbersome.
- Before finishing, check for: source accuracy, repeated content, overly long paragraphs/table cells, broken wikilinks, LaTeX syntax, and whether the note is easy to skim.
- In the final response, give the exact path and a short description of the note's scope. If asked only to think or advise, give recommendations without modifying the note.
