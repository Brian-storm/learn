---
name: exercise
description: Generate course-grounded exam and practice questions, or convert and organize existing exam papers as readable, source-faithful Markdown, including scanned PDFs.
---

# Exam and exercise workflow

Use this skill when the user asks to:

- Generate exam questions, mock exams, quizzes, or practice sets—with or without reference to past exam papers
- Convert an existing exam paper in PDF format into Markdown
- OCR, clean up, verify, or organize converted exam papers

The goal is twofold: **readable study material for the user** and **faithful, structured source material that future agents can reliably search and reason from**.

## Binding requirements

- Preserve the distinction between **original source material**, **faithful conversion**, and **newly generated questions**
- Never silently omit, invent, or “repair” exam content; mark uncertainty and retain page context
- Never claim a generated question appeared on an actual exam or predict what will appear on a future exam
- Keep original PDFs intact; do not overwrite, rename, or move existing sources without a clear reason or direct instruction
- Inspect local course organization and existing artifacts before creating files; preserve established patterns where they already exist
- Before reporting completion, verify paths, links, question numbering, marks, and conversion quality against the source
- If an important requirement is unclear and cannot be safely defaulted, ask one focused question; otherwise proceed with explicit assumptions

## 1. Classify the task and establish scope

Identify the applicable workflow:

1. **Generate** new questions or a mock exam
2. **Convert** an existing PDF paper to Markdown
3. **Both**—convert past papers, then use them as references for new questions
4. **Practice interactively**—present questions in chat rather than creating a paper, when explicitly requested

Before working, establish:

- Course and topic/scope
- Source PDFs or course materials to use, if any
- Whether past papers are references for style, topic emphasis, question structure, or direct transformation
- Requested question types, difficulty, duration, total marks, and answer/solution expectations
- Whether the output is a durable vault artifact or an interactive practice session

Use the current session and course context when clear. If the user gives no exam specifications, choose reasonable defaults from relevant course materials, label those assumptions in the generated file, and avoid implying that the result matches an official exam blueprint.

## 2. Inspect the course and choose destinations

Before writing to the vault, read `/home/bb891/vault/WORKFLOW.md` and inspect the target course's `Course.md`, `Exercises/` tree, and relevant existing generated or converted papers. Use the vault symlink paths under `/home/bb891/vault`.

### Existing source papers

- Keep original PDFs in their existing course folder unless asked to reorganize them
- Do not create a duplicate PDF when one is already present
- For a new exam source with no established local pattern, use `Courses/<course>/Exercises/Exams/`
- For a new conversion, put Markdown in a `Converted Markdown/` subfolder beside the relevant exam collection
  - Example: `Exercises/Exams/Converted Markdown/`
  - For an established exam folder such as `Exercises/Exam/`, place its conversion in `Exercises/Exam/Converted Markdown/`
  - If a course already consistently stores exam PDFs directly in `Exercises/` and conversions in `Exercises/Converted Markdown/`, retain that local pattern rather than making competing folders
- Preserve the source filename stem where useful; use a descriptive, stable name including course/year/exam number when the original name is vague
- Never overwrite an existing conversion without comparing it; preserve a distinct alternate extraction using `-Alternate-Extraction` before `.md`

### Newly generated papers

- Default location: `Courses/<course>/Exercises/Generated/`
- Use descriptive names, e.g. `CSCI3150-Processes-Practice-Exam.md`
- Keep the question paper and answer key/solutions as separate files so the questions remain usable for self-testing
- Save the solutions file in the **same folder as its matching exercise paper**, not in a separate solutions directory
- Default answer-key filename: match the paper stem plus `-Solutions.md`
- If the request is explicitly for questions only, do not create an answer key
- For interactive practice, do not save a paper unless requested; present one question at a time and withhold solutions until the user's attempt

Do not repurpose `Notes/` for raw conversions or generated question papers. Do not reorganize unrelated files as part of this task.

## 3. Generate questions

### Source-grounded design

- Inspect the relevant lecture/tutorial conversions, notes, exercises, and exam papers before composing questions
- Prefer official course material for factual coverage; use past papers to learn style, format, difficulty, topic distribution, and expected level—not as proof of a future exam blueprint
- If using reference papers, identify which papers were consulted and how they informed the new set
- Build a compact internal topic/skill inventory to avoid over-concentrating on one visible past-paper pattern
- Cover only the requested scope; do not invent course content to fill a target question count
- Do not reproduce a past-paper question verbatim by default; write original variants that test the same underlying skill, or clearly identify verbatim reproduction when directly requested
- Separate facts established by course sources from design choices or assumptions
- Never label a generated paper “official,” “predicted,” or “representative” unless that status is explicitly supported by the user or a source

### Paper construction

Unless the user specifies otherwise:

- Include a clear title, course/topic scope, status (`Generated practice paper`), suggested time, total marks, and concise instructions
- Give each question a stable number and each part a stable label
- State mark values and ensure question/part marks add up to the declared total
- Use a deliberate mix of question types appropriate to the source and requested scope
- Make all prompts self-contained: define symbols, provide needed data/assumptions, and include diagrams or tables in Markdown/SVG only when they materially help
- Calibrate difficulty to the requested level and vary the cognitive work (e.g. explain, derive, trace, calculate, compare, debug, apply)
- Avoid ambiguous wording, hidden assumptions, unnecessary trick wording, and duplicate questions that test the same narrow fact
- Ensure data, code, equations, and subparts are internally consistent
- Keep solutions out of the question paper; put checked answers and worked reasoning in the separate solutions file when included
- Use Markdown headings, lists, tables, fenced code, and LaTeX where appropriate; keep notation consistent and readable

### Answer keys and solutions

- Match answer numbering exactly to the question paper
- Provide enough reasoning to verify the result, not just an unexplained final value
- Show intermediate steps for nontrivial calculations, derivations, tracing, and code behavior
- Note accepted alternatives or grading criteria where appropriate
- Check every answer independently against course sources or by calculation
- Cite the course materials used; identify generated content as generated

### Provenance for generated files

Include a compact frontmatter block and source section. For example:

```yaml
---
course: CSCI3150
title: "Processes Practice Exam"
content_type: generated-practice-exam
scope: "fork, exec, wait, and process state"
reference_exams:
  - "2021 CSCI3150 Exam 1.pdf"
---
```

- Include only fields that are known; omit unsupported details rather than guessing
- State in the paper that questions are newly generated
- Link or name the lecture/course sources and reference exams actually consulted
- Do not imply endorsement, exact alignment, or prediction based solely on past papers

## 4. Convert an existing PDF paper to Markdown

### 4.1 Inspect the source and available tools

- Confirm the PDF opens and record its page count, file size, and exact path
- Inspect the destination for an existing conversion before writing
- First inspect `/home/bb891/ai-learning/.pi/agents/content-parser.md` and reuse that agent's extraction workflow for routine PDF text conversion when suitable; give it the source, course, and destination explicitly, then independently perform the exam-specific completeness and accuracy checks in this skill
- Reuse existing project helpers and installed packages before writing custom conversion code; do not build a parallel converter unless the existing workflow cannot handle the source or the user requests one
- Current project inventory: a `content-parser` agent and `markitdown` are available; no general exam-PDF conversion script was found. Tesseract is also available in the current environment for scanned pages. Recheck availability at run time
- Check utilities rather than assuming they are installed: `markitdown`, `pdftotext`, `pdfinfo`, `pdftoppm`/`mutool`, `tesseract`, `ocrmypdf`, and `python3` with relevant PDF/OCR packages
- Keep temporary page images and intermediate OCR text outside the vault; do not leave caches or render artifacts mixed with final study files

### 4.2 Determine whether the PDF is digitally typed, scanned, or mixed

1. Attempt text-layer extraction using the best available extractor; prefer `markitdown` when it yields usable output
2. Compare extracted text to page count and inspect the first, middle, and final pages
3. Classify the PDF:
   - **Digital text:** selectable/extracted text is complete and legible
   - **Scanned image:** little/no usable text layer, or output is primarily image placeholders/garbage
   - **Mixed:** some pages have text and others are images, or figures/equations require visual reading
4. Do not trust a non-empty extraction as proof of completeness; detect missing pages, broken reading order, garbled symbols, and omitted figures

### 4.3 Digital-text extraction

- Use the best installed extractor (commonly `markitdown`, `pdftotext -layout`, PyMuPDF, `pypdf`, or `pdfplumber`)
- Preserve page boundaries during extraction where practical so source locations remain traceable
- Clean conversion artifacts and restore meaningful Markdown structure, but do not paraphrase or change the exam's meaning
- Compare each page's extracted content to the original, especially multi-column layouts, tables, code, equations, superscripts/subscripts, and choice labels
- If multiple tools produce materially different text, inspect the PDF and retain the more faithful conversion; keep an alternate only when it provides genuinely useful distinct content

### 4.4 Scanned-page OCR

- Render pages to temporary images at a suitable resolution (typically 300 DPI or higher for small print/math) using an available PDF renderer
- Apply OCR page-by-page with installed language packs; use layout/segmentation settings suited to the page (text columns, code, tables, or formulas)
- If OCR tools are unavailable, first check existing renderers, Python packages, and visual-reading options; do not assume the user must preconfigure the workflow
- Do not install new packages or change the environment without the user's approval; if no existing route works, explain the specific blocker and ask for the smallest needed intervention (e.g. permission to install a tool, a searchable PDF, or a clearer scan) rather than inventing a transcription
- OCR is a draft, not an authoritative source: manually compare every page against the page image
- Carefully verify high-risk content: mathematical notation, Greek letters, signs, exponents, subscripts, code punctuation/indentation, table entries, multiple-choice options, units, and mark values
- Use OCR output to aid transcription; do not accept implausible text just because OCR returned it
- Preserve question wording faithfully; do not silently correct apparent source typos. Where a correction seems necessary, retain the source reading and add a concise `[sic]` or conversion note only when useful
- If a region remains unreadable, mark it explicitly, e.g. `[unclear in source image: symbol after x]`, and include its page number; never guess

### 4.5 Structure and format the Markdown

- Use YAML frontmatter for known metadata: course, year/term, exam identifier, title, source PDF, conversion type, extraction/OCR tool, and language(s) as applicable
- Use one H1 title, followed by the paper's original sections and question numbering
- Preserve instructions, time allowed, total marks, marks per question/part, choices, footnotes, provided constants/formula sheets, and any stated assumptions
- Format questions consistently with headings or bold question labels and nested parts; do not flatten distinctions between prompts and options
- Preserve equations with Markdown LaTeX (`$...$`, `$$...$$`); preserve code in fenced blocks with the language when known
- Represent tables as Markdown tables only when cell structure is clear; otherwise use a faithful plain-text layout or note the limitation
- Include page headings such as `## Page 3` when they aid source navigation, OCR verification, or mixed-page traceability; do not add noisy page headers to a clean short digital paper unless useful
- For diagrams, charts, screenshots, or essential visual data: embed/crop the source image only when a reliable image workflow and stable vault-relative path are available; otherwise provide a precise description or clearly mark the missing visual and source page
- Do not reproduce blank answer-space pages verbatim; note the presence/range of answer pages at the end when relevant
- Add a concise conversion-quality callout for scanned or imperfect source material, naming limitations and advising verification against the linked PDF
- Retain unclear text markers in the final file so future agents do not mistake guesses for source facts

### 4.6 Conversion metadata example

```yaml
---
course: CSCI3150
year: 2025
exam: 1
title: "2025 CSCI3150 Exam 1"
source: "../2025 CSCI3150 Exam 1.pdf"
content_type: exam-paper-transcription
converted_with: "Tesseract 5.x"
ocr_languages: [eng]
---
```

- Adjust `source` to the actual relative path; verify that it resolves from the Markdown file
- Use `content_type: exam-paper-conversion` for clean digital extraction and `exam-paper-transcription` when materially transcribing/OCRing image pages
- Add `ocr_languages` only when OCR was performed and known
- Do not claim a tool was used unless it actually produced or materially supported the final text

### 4.7 Quality verification

Before saving/reporting a conversion:

- Verify that every exam question and subpart is present, ordered correctly, and traceable to the PDF
- Compare total marks, individual marks, instructions, options, equations, code, and table data against the source
- Inspect OCR output page-by-page; at minimum visually verify every page for scanned/mixed PDFs
- Check heading hierarchy, readable line breaks, code fences, math delimiters, and table alignment
- Confirm every source link/path and frontmatter value
- Confirm no answer-space page was mistaken for a question page and no actual question page was dropped
- Review the whole Markdown once for both human scanability and agent retrieval (descriptive headings, stable numbering, complete context, explicit uncertainty)
- Report residual OCR or image limitations honestly

## 5. Save and report

- Save conversions and generated papers in the selected course `Exercises/` location; preserve original PDFs
- Use portable Markdown and vault-relative source links; verify each destination exists
- Report exact paths, task performed, source papers/materials used, tools used for conversion, and any unresolved quality limits
- Briefly distinguish generated content from source transcription
- Do not paste an entire converted paper into the completion report
