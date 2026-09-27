/**
 * visual-tools
 *
 * Registers the diagram authoring tools for the visualize skill:
 *
 *   • write_mermaid / edit_mermaid / render_mermaid
 *       (tools/mermaid_tools.ts) — the mermaid-maker's authoring loop: write a
 *       Mermaid source, exact-match edit it, render whatever is currently in
 *       the managed file to a PNG, return the PNG inline for inspection, and —
 *       when given `save_as` — publish it into <cwd>/viz with a unique name.
 *   • write_svg / edit_svg / render_svg
 *       (tools/svg_tools.ts) — same shape, for hand-written SVG.
 *
 * Rendering is fully in-process (mermaid + jsdom -> SVG -> sharp), so no
 * installed browser and no system rasterizer (mmdc, rsvg-convert, magick) are
 * required. That means these tools work on Linux, macOS and Windows alike.
 *
 * ── How the tools reach a subagent ──────────────────────────────────────────
 * This extension registers its tools directly via `pi.registerTool`, so they
 * are available in ANY session that loads this entrypoint — including the
 * parent session, with no subagent involved.
 *
 * A subagent child process is launched with `--no-extensions` (automatic
 * project/global extension discovery is disabled), so it will NOT load this
 * file by itself. To give the mermaid-maker / svg-maker agents these tools,
 * the two tool files must be listed explicitly in the interactive-subagents
 * child-extension config:
 *
 *   ~/.pi/agent/extensions/pi-interactive-subagents/config.json
 *     { "subagentExtensions": [
 *         "<abs>/visual-tools/tools/mermaid_tools.ts",
 *         "<abs>/visual-tools/tools/svg_tools.ts"
 *       ] }
 *
 * Each agent then declares the tool names it may call in its `tools:`
 * frontmatter (see .pi/agents/mermaid-maker.md).
 *
 * NOTE: an earlier revision of this file did no registration of its own — it
 * only called `registerToolExtension` on a `globalThis.__pi_interactive_subagents`
 * hook provided by another subagent package. That hook does not exist in the
 * @maplezzk/pi-interactive-subagents fork (verified absent from its source), so
 * the extension registered nothing and the tools were silently unavailable.
 * Registering directly removes that dependency entirely.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import mermaidToolsExtension from "./tools/mermaid_tools.ts"
import svgToolsExtension from "./tools/svg_tools.ts"

const EXT_DIR = path.dirname(fileURLToPath(import.meta.url))
const MERMAID_TOOLS = path.join(EXT_DIR, "tools", "mermaid_tools.ts")
const SVG_TOOLS = path.join(EXT_DIR, "tools", "svg_tools.ts")

/** Tool names registered by each trio, in the order the makers should use them. */
export const MERMAID_TOOL_NAMES = ["write_mermaid", "edit_mermaid", "render_mermaid"] as const
export const SVG_TOOL_NAMES = ["write_svg", "edit_svg", "render_svg"] as const

/**
 * Paths a caller can pass to a subagent package's explicit child-extension list
 * so the makers get these tools. Returned rather than written, so this
 * extension never mutates another package's config behind the user's back.
 */
export function toolExtensionPaths(): { mermaid: string; svg: string } {
  return { mermaid: MERMAID_TOOLS, svg: SVG_TOOLS }
}

export default function visualToolsExtension(pi: ExtensionAPI) {
  // Skip a tool file that is missing rather than failing the whole extension,
  // so a partial checkout still yields the other tool set.
  if (fs.existsSync(MERMAID_TOOLS)) mermaidToolsExtension(pi)
  if (fs.existsSync(SVG_TOOLS)) svgToolsExtension(pi)
}