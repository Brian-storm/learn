/**
 * Browserless renderers for the visual-tools authoring loops.
 *
 * Originally both tools shelled out to a headless-Chrome-dependent binary
 * (`mmdc`) or to system rasterizers (`rsvg-convert` / `magick`). Those are
 * macOS-centric and absent on this machine (no Chrome, no unzip, no sudo).
 *
 * These two functions reproduce the SAME output contract — a PNG on disk —
 * using only pure-JS npm packages:
 *
 *   mermaidSourceToPng(src, outPath)  mermaid + jsdom  -> SVG -> resvg -> PNG
 *   svgSourceToPng(svg, outPath)      resvg            -> PNG
 *
 * No browser, no system binary, no network at render time.
 */

import { existsSync, writeFileSync } from "node:fs"
import opentype from "opentype.js"

type OpenTypeFont = ReturnType<typeof opentype.parse>
import { JSDOM } from "jsdom"
import sharp from "sharp"

/**
 * Rasterize an SVG string to a PNG file.
 *
 * Uses sharp (libvips + librsvg) rather than @resvg/resvg-js: resvg's Rust
 * geometry code PANICS — a hard process abort, not a catchable JS error — on
 * the SVGs Mermaid emits (dash-animated edge styles, `em`-unit tspans and
 * nested label groups combine to trip an unwrap). librsvg renders the same
 * input correctly, so sharp is the working browserless rasterizer here.
 *
 * `width` requests an output pixel width; sharp preserves aspect ratio.
 */
export async function svgToPng(svg: string, outPath: string, width?: number): Promise<void> {
  // Mermaid emits width="100%" with only a viewBox, and percentage intrinsic
  // sizes are not resolvable without a viewport. Pin BOTH width and height in
  // absolute px (height derived from the viewBox aspect) so librsvg renders the
  // whole diagram rather than one cropped, over-scaled region.
  const m = /viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/.exec(svg)
  let sized = svg
  if (m) {
    const vbW = Number(m[3])
    const vbH = Number(m[4])
    if (Number.isFinite(vbW) && vbW > 0 && Number.isFinite(vbH) && vbH > 0) {
      const w = width ?? Math.ceil(vbW)
      const h = Math.round((w * vbH) / vbW)
      sized = svg.replace(/\swidth="[^"]*"(\s+height="[^"]*")?/, ` width="${w}" height="${h}"`)
    }
  }

  // Leave density at its default: librsvg takes the SVG's own width/height as
  // the output pixel size, so raising density too would double-scale it.
  const png = await sharp(Buffer.from(sized))
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer()
  writeFileSync(outPath, png)
}

/**
 * Render Mermaid source to a PNG with no browser.
 *
 * Mermaid needs a DOM, so we stand up a jsdom window and shim the few browser
 * APIs its layout code touches but jsdom lacks (CSSStyleSheet, getBBox). These
 * shims mirror what mermaid-cli gets for free from real Chrome; they affect
 * only style handling and measurement defaults, not graph layout semantics.
 */
/**
 * Real font metrics for mermaid's layout measurements.
 *
 * Mermaid derives node box dimensions from text measurement, so jsdom needs a
 * genuine answer rather than a stub. We read a system sans font once per size
 * and cache the parsed font. Falls back to undefined if no font is readable.
 */
const FONT_CANDIDATES = [
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
  "/System/Library/Fonts/Helvetica.ttc",
]
const fontCache = new Map<number, OpenTypeFont | null>()

function loadFont(size: number): OpenTypeFont | null {
  const cached = fontCache.get(size)
  if (cached !== undefined) return cached
  let font: OpenTypeFont | null = null
  for (const path of FONT_CANDIDATES) {
    if (!existsSync(path)) continue
    try {
      font = opentype.loadSync(path)
      break
    } catch {
      /* try the next candidate */
    }
  }
  fontCache.set(size, font)
  return font
}

export async function mermaidSourceToPng(
  source: string,
  outPath: string,
  width = 1000,
): Promise<void> {
  const dom = new JSDOM("<!DOCTYPE html><body></body>", { pretendToBeVisual: true })

  const g = globalThis as Record<string, unknown>
  g.window = dom.window
  g.document = dom.window.document
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
    configurable: true,
  })

  // jsdom has no layout engine, so mermaid's getBBox()/getComputedTextLength()
  // measurements must be supplied. Real font metrics matter here: mermaid sizes
  // every node box from these numbers, so a fake constant produces boxes that
  // do not fit their labels. We measure with opentype.js against a real font.
  const measure = (text: string, fontSize: number): number => {
    if (!text) return 0
    const font = loadFont(fontSize)
    if (font) {
      try {
        return font.getAdvanceWidth(text, fontSize)
      } catch {
        /* fall through to the estimate below */
      }
    }
    // Rough fallback if the font could not be read.
    return text.length * fontSize * 0.55
  }

  const elemText = (el: { textContent?: string | null }): string => el.textContent ?? ""

  const proto = dom.window.SVGElement.prototype as unknown as {
    getBBox?: () => { x: number; y: number; width: number; height: number }
    getComputedTextLength?: () => number
  }

  proto.getBBox = function (this: {
    textContent?: string | null
    tagName?: string
    children?: ArrayLike<unknown>
    querySelectorAll?: (s: string) => ArrayLike<unknown>
    getAttribute?: (n: string) => string | null
  }): { x: number; y: number; width: number; height: number } {
    // Mermaid calls getBBox() on the freshly-rendered node element and uses the
    // result as node.width/node.height for graph layout. Returning a text-sized
    // box makes it under-size shapes (notably diamonds), which then overlap
    // their neighbours. So derive bounds from the element's own child geometry
    // when we can, and only fall back to text metrics otherwise.
    const shape = this.querySelectorAll?.("rect, path, circle, polygon, ellipse")
    if (shape && shape.length > 0) {
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (let i = 0; i < shape.length; i++) {
        const el = shape[i] as {
          getAttribute?: (n: string) => string | null
          tagName?: string
          textContent?: string | null
        }
        const num = (n: string): number => Number(el.getAttribute?.(n) ?? 0) || 0
        const tag = (el.tagName ?? "").toLowerCase()
        if (tag === "rect") {
          const x = num("x")
          const y = num("y")
          const w = num("width")
          const h = num("height")
          if (w === 0 && h === 0) continue
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x + w)
          maxY = Math.max(maxY, y + h)
        } else if (tag === "circle") {
          const cx = num("cx")
          const cy = num("cy")
          const r = num("r")
          minX = Math.min(minX, cx - r)
          minY = Math.min(minY, cy - r)
          maxX = Math.max(maxX, cx + r)
          maxY = Math.max(maxY, cy + r)
        } else if (tag === "polygon" || tag === "path") {
          // Bounding these properly needs path parsing; mermaid draws diamonds
          // and rounded rects as polygons/paths centred on the origin. Use the
          // points when present, else a generous square.
          const pts = el.getAttribute?.("points")
          if (pts) {
            for (const pair of pts.trim().split(/\s+/)) {
              const [px, py] = pair.split(",").map(Number)
              if (Number.isFinite(px) && Number.isFinite(py)) {
                minX = Math.min(minX, px)
                minY = Math.min(minY, py)
                maxX = Math.max(maxX, px)
                maxY = Math.max(maxY, py)
              }
            }
          }
        }
      }
      if (Number.isFinite(minX) && Number.isFinite(minY) && maxX > minX && maxY > minY) {
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
      }
    }

    const text = elemText(this)
    const size = 16
    const lines = text.length ? text.split("\n").length : 1
    return { x: 0, y: 0, width: measure(text, size), height: size * 1.2 * lines }
  }

  proto.getComputedTextLength = function (this: { textContent?: string | null }): number {
    return measure(elemText(this), 16)
  }

  class CSSStyleSheetShim {
    cssRules: unknown[] = []
    replaceSync(): void {}
    insertRule(): number {
      return 0
    }
  }
  g.CSSStyleSheet = CSSStyleSheetShim

  const mermaid = (await import("mermaid")).default
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    // Use native SVG <text> labels rather than <foreignObject> HTML. resvg's
    // Rust geometry code PANICS (hard process abort, not a catchable error) on
    // foreignObject, so this is required for browserless rasterization.
    flowchart: { htmlLabels: false },
    htmlLabels: false,
  })

  const { svg } = await mermaid.render(`vt-${Date.now()}`, source)
  await svgToPng(fixViewBox(preserveSpace(svg)), outPath, width)
}

/**
 * Preserve whitespace in SVG text.
 *
 * With htmlLabels disabled mermaid renders multi-word labels as several tspans
 * where the separating space is a LEADING character ("one", " thread"). SVG's
 * default whitespace handling strips that leading space when rendering, so
 * "one thread" comes out as "onethread". xml:space="preserve" keeps it.
 */
function preserveSpace(svg: string): string {
  return svg
    .replace(/<svg /, '<svg xml:space="preserve" ')
    .replace(/<text /g, '<text xml:space="preserve" ')
    .replace(/<tspan /g, '<tspan xml:space="preserve" ')
}

/**
 * Recompute an SVG's viewBox from its actual content bounds.
 *
 * Mermaid sizes the viewBox using getBBox() measurements taken while it lays
 * the graph out. jsdom has no layout engine, so those measurements come from
 * our shims and the resulting viewBox is far too small — it crops most of the
 * diagram. Rather than fake better measurements, we ignore mermaid's viewBox
 * and derive the real bounds from the emitted geometry: node/edge transforms,
 * rects, and text anchors.
 */
function fixViewBox(svg: string): string {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  const grow = (x: number, y: number): void => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  // Walk the markup tracking the accumulated translate offset of the enclosing
  // <g> elements. Mermaid positions node boxes RELATIVE to their parent group
  // (e.g. rect x="-80" inside transform="translate(58, 18)"), so bounds are only
  // correct once that offset is added in.
  const token = /<g\b([^>]*)>|<\/g>|<(rect|image)\b([^>]*)>/g
  const stack: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }]
  let m: RegExpExecArray | null

  while ((m = token.exec(svg)) !== null) {
    if (m[0] === "</g>") {
      if (stack.length > 1) stack.pop()
      continue
    }

    const cur = stack[stack.length - 1]

    if (m[1] !== undefined) {
      // Opening <g>: push its offset (translate only; that is all mermaid emits).
      let nx = cur.x
      let ny = cur.y
      const t = /transform="translate\(([-\d.]+)[ ,]+([-\d.]+)\)"/.exec(m[1])
      if (t) {
        nx += Number(t[1])
        ny += Number(t[2])
      }
      stack.push({ x: nx, y: ny })
      continue
    }

    // A rect/image: convert its local box into absolute coordinates.
    const attrs = m[3] ?? ""
    const num = (attr: string): number | undefined => {
      const r = new RegExp(`\\b${attr}="([-\\d.]+)"`).exec(attrs)
      return r ? Number(r[1]) : undefined
    }
    const w = num("width")
    const h = num("height")
    // Skip the empty measurement placeholder rects mermaid leaves behind.
    if (w === undefined || h === undefined || (w === 0 && h === 0)) continue
    const x = cur.x + (num("x") ?? 0)
    const y = cur.y + (num("y") ?? 0)
    grow(x, y)
    grow(x + w, y + h)
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return svg

  const pad = 12
  const vbX = Math.floor(minX - pad)
  const vbY = Math.floor(minY - pad)
  const vbW = Math.ceil(maxX - minX + pad * 2)
  const vbH = Math.ceil(maxY - minY + pad * 2)
  if (vbW <= 0 || vbH <= 0) return svg

  return svg.replace(/viewBox="[^"]*"/, `viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`)
}
