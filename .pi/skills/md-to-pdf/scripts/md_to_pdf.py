#!/usr/bin/env python3
"""Render a practical Markdown subset to a clean, searchable PDF."""
from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def register_fonts() -> None:
    candidates = [
        Path('/usr/share/fonts/truetype/dejavu'),
        Path('/usr/share/fonts/dejavu'),
    ]
    font_dir = next((p for p in candidates if (p / 'DejaVuSans.ttf').exists()), None)
    if font_dir is None:
        raise RuntimeError('DejaVu Sans fonts not found. Install the DejaVu fonts package.')
    pdfmetrics.registerFont(TTFont('DV', str(font_dir / 'DejaVuSans.ttf')))
    pdfmetrics.registerFont(TTFont('DV-Bold', str(font_dir / 'DejaVuSans-Bold.ttf')))
    # Alias regular/bold faces for the italic family slots; this keeps <i> portable.
    pdfmetrics.registerFont(TTFont('DV-Oblique', str(font_dir / 'DejaVuSans.ttf')))
    pdfmetrics.registerFont(TTFont('DV-BoldOblique', str(font_dir / 'DejaVuSans-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('DVM', str(font_dir / 'DejaVuSansMono.ttf')))
    pdfmetrics.registerFont(TTFont('DVM-Bold', str(font_dir / 'DejaVuSansMono-Bold.ttf')))
    pdfmetrics.registerFontFamily('DV', normal='DV', bold='DV-Bold', italic='DV-Oblique',
                                  boldItalic='DV-BoldOblique')


register_fonts()

NAVY = colors.HexColor('#17365D')
TEAL = colors.HexColor('#16697A')
PALE_GOLD = colors.HexColor('#FFF8E7')
PALE_BLUE = colors.HexColor('#EFF6FA')
LIGHT_GRAY = colors.HexColor('#F3F5F7')
GRID = colors.HexColor('#C6D0D8')
DARK = colors.HexColor('#263238')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='DocTitle', fontName='DV-Bold', fontSize=21, leading=27,
                          textColor=NAVY, spaceAfter=14, keepWithNext=True))
styles.add(ParagraphStyle(name='HeadingOne', fontName='DV-Bold', fontSize=15, leading=19,
                          textColor=NAVY, spaceBefore=13, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name='HeadingTwo', fontName='DV-Bold', fontSize=12, leading=15,
                          textColor=TEAL, spaceBefore=10, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name='HeadingThree', fontName='DV-Bold', fontSize=10.2, leading=13,
                          textColor=DARK, spaceBefore=7, spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle(name='BodyTextCustom', fontName='DV', fontSize=9.1, leading=13.1,
                          textColor=DARK, spaceAfter=6, alignment=TA_LEFT, splitLongWords=1))
styles.add(ParagraphStyle(name='MetaText', fontName='DV', fontSize=8.5, leading=11.5,
                          textColor=colors.HexColor('#48545C'), spaceAfter=3))
styles.add(ParagraphStyle(name='BulletText', fontName='DV', fontSize=9.0, leading=12.5,
                          textColor=DARK, leftIndent=14, firstLineIndent=-10, spaceAfter=3,
                          splitLongWords=1))
styles.add(ParagraphStyle(name='TableHeader', fontName='DV-Bold', fontSize=7.7, leading=9.5,
                          textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name='TableCell', fontName='DV', fontSize=7.6, leading=9.5,
                          textColor=DARK, alignment=TA_LEFT, splitLongWords=1))
styles.add(ParagraphStyle(name='CalloutTitle', fontName='DV-Bold', fontSize=9.0, leading=11,
                          textColor=colors.HexColor('#155B4B'), spaceAfter=2))
styles.add(ParagraphStyle(name='CalloutBody', fontName='DV', fontSize=8.8, leading=12,
                          textColor=DARK))
styles.add(ParagraphStyle(name='QuoteBody', fontName='DV', fontSize=8.8, leading=12,
                          textColor=DARK))


def inline_markup(text: str) -> str:
    """Escape text, then apply the small inline-Markdown subset used in study notes."""
    text = html.escape(text, quote=False)
    code_parts: list[str] = []

    def save_code(match: re.Match[str]) -> str:
        code_parts.append(match.group(1))
        return f'\x00CODE{len(code_parts) - 1}\x00'

    text = re.sub(r'`([^`]+)`', save_code, text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'(?<!\*)\*([^*\n]+?)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                  r'<link href="\2" color="#174A7E">\1</link>', text)
    for index, value in enumerate(code_parts):
        text = text.replace(f'\x00CODE{index}\x00',
                            f'<font name="DVM" color="#304050">{value}</font>')
    return text


def wrap_code_line(line: str, max_width: float, font: str = 'DVM', size: float = 7.7) -> list[str]:
    if not line:
        return ['']
    out: list[str] = []
    current = ''
    indent = len(line) - len(line.lstrip(' '))
    continuation = ' ' * min(indent + 2, 10)
    for word in line.split(' '):
        candidate = word if not current else current + ' ' + word
        if current and pdfmetrics.stringWidth(candidate, font, size) > max_width:
            out.append(current)
            current = continuation + word
        else:
            current = candidate
        if pdfmetrics.stringWidth(current, font, size) > max_width:
            piece = ''
            for char in current:
                if piece and pdfmetrics.stringWidth(piece + char, font, size) > max_width:
                    out.append(piece)
                    piece = continuation + char
                else:
                    piece += char
            current = piece
    if current:
        out.append(current)
    return out


class CodeBox(Flowable):
    def __init__(self, text: str):
        super().__init__()
        self.raw_lines = text.splitlines() or ['']
        self.lines: list[str] = []
        self.box_width = 0.0
        self.box_height = 0.0
        self.pad = 7
        self.leading = 10.3

    def wrap(self, avail_width: float, _avail_height: float) -> tuple[float, float]:
        self.box_width = avail_width
        max_line_width = avail_width - 2 * self.pad
        self.lines = []
        for line in self.raw_lines:
            self.lines.extend(wrap_code_line(line, max_line_width))
        self.box_height = 2 * self.pad + max(1, len(self.lines)) * self.leading
        return self.box_width, self.box_height

    def draw(self) -> None:
        canvas = self.canv
        canvas.setFillColor(LIGHT_GRAY)
        canvas.setStrokeColor(GRID)
        canvas.roundRect(0, 0, self.box_width, self.box_height, 4, fill=1, stroke=1)
        canvas.setFont('DVM', 7.7)
        canvas.setFillColor(DARK)
        y = self.box_height - self.pad - 8
        for line in self.lines:
            canvas.drawString(self.pad, y, line)
            y -= self.leading


def make_table(raw_rows: list[str], available_width: float) -> Table | Spacer:
    rows: list[list[str]] = []
    for row in raw_rows:
        cells = [cell.strip() for cell in row.strip().strip('|').split('|')]
        if cells and all(re.fullmatch(r'\s*:?-{3,}:?\s*', cell or '') for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return Spacer(1, 1)
    column_count = max(len(row) for row in rows)
    for row in rows:
        row.extend([''] * (column_count - len(row)))
    data = []
    for row_index, row in enumerate(rows):
        style = styles['TableHeader'] if row_index == 0 else styles['TableCell']
        data.append([Paragraph(inline_markup(cell), style) for cell in row])
    widths = [available_width / column_count] * column_count
    table = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT', splitByRow=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('GRID', (0, 0), (-1, -1), 0.35, GRID),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F7F9FB')]),
    ]))
    return table


def make_callout(quoted_lines: list[str], available_width: float) -> Table:
    texts = [re.sub(r'^>\s?', '', line).strip() for line in quoted_lines]
    first = texts[0] if texts else ''
    match = re.match(r'^\[!([A-Za-z0-9_-]+)\]\s*(.*)$', first)
    if match:
        kind, heading = match.groups()
        title = f'{kind.upper()}: {heading}'.strip()
        body = ' '.join(text for text in texts[1:] if text)
        title_style = styles['CalloutTitle']
        background = PALE_GOLD if kind.lower() in {'tip', 'important', 'success'} else PALE_BLUE
    else:
        title = ''
        body = ' '.join(text for text in texts if text)
        title_style = styles['CalloutTitle']
        background = PALE_BLUE
    cells = []
    if title:
        cells.append([Paragraph(inline_markup(title), title_style)])
    cells.append([Paragraph(inline_markup(body), styles['CalloutBody' if title else 'QuoteBody'])])
    box = Table(cells, colWidths=[available_width], hAlign='LEFT')
    box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), background),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#D8C98F' if title else '#B9CDD9')),
        ('LINEBEFORE', (0, 0), (0, -1), 3, TEAL),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return box


def is_block_start(lines: list[str], index: int) -> bool:
    text = lines[index].strip()
    return (not text or text.startswith('#') or text.startswith('```') or text.startswith('>') or
            text.startswith('|') or re.match(r'^\s*(?:[-*+]\s+|\d+[.)]\s+)', lines[index]) is not None or
            re.fullmatch(r'-{3,}', text) is not None)


def remove_frontmatter(lines: list[str]) -> list[str]:
    if not lines or lines[0].strip() != '---':
        return lines
    for index in range(1, len(lines)):
        if lines[index].strip() in {'---', '...'}:
            return lines[index + 1:]
    return lines


def render_markdown(md_path: Path, pdf_path: Path, page_size: tuple[float, float]) -> None:
    lines = remove_frontmatter(md_path.read_text(encoding='utf-8').splitlines())
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(pdf_path), pagesize=page_size, rightMargin=48, leftMargin=48,
                            topMargin=48, bottomMargin=46, title=md_path.stem,
                            author='Markdown notes')
    available_width = page_size[0] - doc.leftMargin - doc.rightMargin
    story = []
    index = 0
    first_title = True
    while index < len(lines):
        line = lines[index]
        text = line.strip()
        if not text:
            index += 1
            continue
        if text.startswith('```'):
            index += 1
            code_lines = []
            while index < len(lines) and not lines[index].strip().startswith('```'):
                code_lines.append(lines[index].rstrip())
                index += 1
            if index < len(lines):
                index += 1
            story.extend([CodeBox('\n'.join(code_lines)), Spacer(1, 5)])
            continue
        if text.startswith('#'):
            level = len(text) - len(text.lstrip('#'))
            heading = text[level:].strip()
            if level == 1 and first_title:
                story.append(Paragraph(inline_markup(heading), styles['DocTitle']))
                first_title = False
            else:
                style = styles['HeadingOne'] if level <= 2 else styles['HeadingTwo'] if level == 3 else styles['HeadingThree']
                story.append(Paragraph(inline_markup(heading), style))
            index += 1
            continue
        if text.startswith('>'):
            quoted = []
            while index < len(lines) and lines[index].strip().startswith('>'):
                quoted.append(lines[index].strip())
                index += 1
            story.extend([make_callout(quoted, available_width), Spacer(1, 7)])
            continue
        if text.startswith('|'):
            rows = []
            while index < len(lines) and lines[index].strip().startswith('|'):
                rows.append(lines[index])
                index += 1
            story.extend([make_table(rows, available_width), Spacer(1, 7)])
            continue
        if re.fullmatch(r'-{3,}', text):
            story.append(Spacer(1, 8))
            index += 1
            continue
        list_match = re.match(r'^(\s*)([-*+]|\d+[.)])\s+(.*)$', line)
        if list_match:
            indent, marker, content = list_match.groups()
            prefix = '• ' if marker in {'-', '*', '+'} else marker + ' '
            bullet_style = ParagraphStyle(
                f'BulletIndent{len(indent)}', parent=styles['BulletText'],
                leftIndent=14 + min(len(indent), 12) * 2,
            )
            story.append(Paragraph(prefix + inline_markup(content), bullet_style))
            index += 1
            continue
        paragraph = [text]
        index += 1
        while index < len(lines) and not is_block_start(lines, index):
            paragraph.append(lines[index].strip())
            index += 1
        joined = ' '.join(paragraph)
        is_meta = any(joined.startswith(f'**{key}:**') for key in
                      ('Status', 'Last updated', 'Scope', 'Notation', 'Date'))
        story.append(Paragraph(inline_markup(joined), styles['MetaText'] if is_meta else styles['BodyTextCustom']))

    short_title = md_path.stem.replace('-', ' ')

    def footer(canvas, current_doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#D5DCE2'))
        canvas.setLineWidth(0.5)
        canvas.line(current_doc.leftMargin, 34, page_size[0] - current_doc.rightMargin, 34)
        canvas.setFont('DV', 7.5)
        canvas.setFillColor(colors.HexColor('#5B6770'))
        canvas.drawString(current_doc.leftMargin, 22, short_title[:95])
        canvas.drawRightString(page_size[0] - current_doc.rightMargin, 22, str(current_doc.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Convert Markdown notes to readable, searchable PDFs. Outputs sit beside the source by default.'
    )
    parser.add_argument('markdown', nargs='+', type=Path, help='one or more .md files')
    parser.add_argument('-d', '--output-dir', type=Path,
                        help='put all PDFs in this directory instead of beside each source')
    parser.add_argument('--paper', choices=('A4', 'Letter'), default='A4',
                        help='page size (default: A4)')
    parser.add_argument('--no-overwrite', action='store_true',
                        help='leave an existing PDF unchanged and report it as skipped')
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    page_size = A4 if args.paper == 'A4' else LETTER
    if args.output_dir:
        args.output_dir.mkdir(parents=True, exist_ok=True)
    failures = 0
    for source in args.markdown:
        if not source.is_file():
            print(f'ERROR: Markdown file not found: {source}', file=sys.stderr)
            failures += 1
            continue
        if source.suffix.lower() not in {'.md', '.markdown'}:
            print(f'ERROR: expected a .md/.markdown file: {source}', file=sys.stderr)
            failures += 1
            continue
        destination = (args.output_dir / f'{source.stem}.pdf') if args.output_dir else source.with_suffix('.pdf')
        if args.no_overwrite and destination.exists():
            print(f'SKIP (already exists): {destination}')
            continue
        try:
            render_markdown(source, destination, page_size)
            print(f'CREATED: {destination} ({destination.stat().st_size:,} bytes)')
        except Exception as error:
            print(f'ERROR converting {source}: {error}', file=sys.stderr)
            failures += 1
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
