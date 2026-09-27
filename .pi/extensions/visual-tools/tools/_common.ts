/**
 * Shared helpers for the visual-tools authoring loops (mermaid_tools.ts,
 * svg_tools.ts): a per-session managed source file, an exact-match editor
 * (pi-edit semantics), and publishing a chosen render into <cwd>/viz with a
 * unique filename.
 *
 * Each tool file keeps its OWN session state (importing the type/helpers here),
 * so mermaid and svg never share a source file.
 *
 * NOTE: rendering is done in-process by ./_render_js.ts. An earlier revision
 * shelled out to external binaries (mermaid-cli's `mmdc` via headless Chrome,
 * plus rsvg-convert / ImageMagick) and carried macOS-only discovery hints
 * (MacPorts, Homebrew, /Applications app bundles) for them. Those binaries are
 * absent on Windows and this Linux box alike, so the subprocess runner and the
 * platform-specific path/chrome helpers were removed rather than left as
 * unreachable code.
 */

import { tmpdir } from "node:os"
import { basename, dirname, join } from "node:path"
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

// Transient session/preview files live under the OS temp dir (NOT the vault),
// so only the PUBLISHED PNG ever lands inside the Obsidian vault (viz/).
export const STAGING_ROOT = join(tmpdir(), "pi-visual-tools")
export const FILES_DIRNAME = "viz"

/** Per-session managed source file, one per child pi process (pid-keyed). */
export interface Session {
  workDir: string
  bodyPath: string
}

/** Per-session work dir under the OS temp dir, keyed by pid + a group name. */
export function sessionDir(group: string): string {
  return join(STAGING_ROOT, `${group}-${process.pid}`)
}

/** Write the full source to the managed file, creating the session work dir. */
export function writeBody(group: string, bodyFileName: string, source: string): Session {
  const workDir = sessionDir(group)
  mkdirSync(workDir, { recursive: true })
  const bodyPath = join(workDir, bodyFileName)
  writeFileSync(bodyPath, source, "utf8")
  return { workDir, bodyPath }
}

/**
 * Exact-match single replacement on the current source, matching pi's built-in
 * edit: old_text must appear exactly once. Returns the updated content and the
 * match offset, or throws a precise error.
 */
export function applyEdit(current: string, oldText: string, newText: string): { updated: string; index: number } {
  if (oldText === "") throw new Error("`old_text` must be non-empty.")
  if (oldText === newText) throw new Error("`old_text` and `new_text` are identical.")
  const first = current.indexOf(oldText)
  if (first === -1) {
    throw new Error("`old_text` not found in the current source — match it exactly.")
  }
  const second = current.indexOf(oldText, first + 1)
  if (second !== -1) {
    let n = 0
    let i = current.indexOf(oldText)
    while (i !== -1) {
      n++
      i = current.indexOf(oldText, i + oldText.length)
    }
    throw new Error(`\`old_text\` appears ${n} times — add surrounding context to make it unique.`)
  }
  const updated = current.slice(0, first) + newText + current.slice(first + oldText.length)
  return { updated, index: first }
}

/** A small numbered window of `content` around char offset `index`. */
export function snippetAround(content: string, index: number, contextLines = 3): string {
  const before = content.slice(0, index)
  const hitLine = before.split("\n").length - 1
  const lines = content.split("\n")
  const start = Math.max(0, hitLine - contextLines)
  const end = Math.min(lines.length - 1, hitLine + contextLines)
  const width = String(end + 1).length
  const out: string[] = []
  for (let i = start; i <= end; i++) out.push(`${String(i + 1).padStart(width)}  ${lines[i]}`)
  return out.join("\n")
}

/** Copy a rendered PNG into <cwd>/viz with a unique, slugified name. */
export function publish(pngPath: string, slug: string): { filename: string; path: string } {
  const filesDir = join(process.cwd(), FILES_DIRNAME)
  mkdirSync(filesDir, { recursive: true })
  const clean =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "viz"
  const filename = `viz-${clean}-${Date.now()}.png`
  const dest = join(filesDir, filename)
  copyFileSync(pngPath, dest)
  return { filename, path: dest }
}

export { basename, dirname, join, existsSync, mkdirSync, readFileSync, writeFileSync }

/**
 * Whether the model driving this session can actually SEE an image.
 *
 * The render tools attach their PNG inline so the maker can inspect it and
 * iterate. A model without image input does not fail loudly on such a result —
 * it silently confabulates a description of a picture it never received, then
 * reports success. Observed directly: deepseek-v3.2 described a diagram of
 * "Node.js single thread" as "Thread Pool" when handed an unviewable PNG.
 *
 * So callers must check this before attaching an image and, when it is false,
 * return text only and drop the "look at it" instruction entirely.
 *
 * `model.input` is the capability list from the model catalogue
 * (`("text" | "image")[]`); an absent model is treated as text-only, i.e. the
 * conservative choice.
 */
export function modelSeesImages(ctx: { model?: { input?: readonly string[] } } | undefined): boolean {
  return ctx?.model?.input?.includes("image") === true
}
