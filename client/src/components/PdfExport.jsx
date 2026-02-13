import { useState, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';

/* ── Emoji → text replacements for jsPDF (no emoji support) ── */
const EMOJI_REPLACEMENTS = {
  '\u{1F4A1}': 'Astuce : ',   // 💡
  '\u{1F3AF}': '[Cible] ',    // 🎯
  '\u{1F9F2}': '[Aimant] ',   // 🧲
  '\u{1F4BC}': '[Emploi] ',   // 💼
  '\u{1F3A4}': '[Micro] ',    // 🎤
  '\u2615':    '',             // ☕
  '\u{1F9EA}': '',             // 🧪
  '\u{1FAF6}\u{1F3FC}': '',   // 🫶🏼
  '\u{1FAF6}': '',             // 🫶
};

function stripEmojis(text) {
  if (!text) return '';
  let cleaned = text;
  for (const [emoji, replacement] of Object.entries(EMOJI_REPLACEMENTS)) {
    cleaned = cleaned.replaceAll(emoji, replacement);
  }
  // Remove any remaining emojis (surrogate pairs, variation selectors, ZWJ sequences, etc.)
  cleaned = cleaned.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, '');
  // Clean up extra whitespace left behind
  cleaned = cleaned.replace(/  +/g, ' ').trim();
  return cleaned;
}

/* ── Color helpers ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getScoreColor(score) {
  if (score < 40) return '#EF4444';
  if (score < 60) return '#F59E0B';
  if (score < 80) return '#3B82F6';
  return '#10B981';
}

function getScoreLabel(score, t) {
  if (score < 40) return t('scoreFaible');
  if (score < 60) return t('scoreMoyen');
  if (score < 80) return t('scoreBon');
  return t('scoreExcellent');
}

/* ── Page constants ── */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 12;
const USABLE_H = PAGE_H - MARGIN - FOOTER_H;

/* ── Objective labels ── */
const OBJ_LABELS = {
  fr: { clients: 'Objectif : Clients', talents: 'Objectif : Talents', recruteurs: 'Objectif : Emploi', branding: 'Objectif : Personal Branding' },
  en: { clients: 'Goal: Clients', talents: 'Goal: Talent', recruteurs: 'Goal: Employment', branding: 'Goal: Personal Branding' },
};

/* ── PDF Builder ── */
function generatePDF(doc, results, lang, t) {
  // Wrap t() to strip emojis from all translated strings rendered in PDF
  const pt = (key) => stripEmojis(t(key));

  let y = 0;
  let pageNum = 1;

  const date = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const coffeeUrl = 'https://buymeacoffee.com/augustin.lelab';
  const siteUrl = 'le-lab-linkedin-production.up.railway.app';

  /* ── Helpers ── */
  function checkPage(needed) {
    if (y + needed > USABLE_H) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = MARGIN;
      drawHeader();
    }
  }

  function drawFlask(fx, fy) {
    // Simple erlenmeyer flask: rectangular neck + triangular body
    // All in white outline on dark background with blue fill
    const w = 7;   // total width
    const h = 9;   // total height
    const nw = 1.8; // neck width
    const nh = 3;   // neck height
    const nx = fx + (w - nw) / 2; // neck x position

    // Body fill (blue liquid)
    doc.setFillColor(96, 165, 250);
    // Draw body as a filled polygon: neck base left → bottom left → bottom right → neck base right
    const bodyPts = [
      nx, fy + nh,           // neck base left
      fx, fy + h,            // bottom left
      fx + w, fy + h,        // bottom right
      nx + nw, fy + nh,      // neck base right
    ];
    // Use lines to fill body shape
    doc.triangle(nx, fy + nh, fx, fy + h, fx + w / 2, fy + h, 'F');
    doc.triangle(nx, fy + nh, fx + w / 2, fy + h, fx + w, fy + h, 'F');
    doc.triangle(nx, fy + nh, fx + w, fy + h, nx + nw, fy + nh, 'F');

    // White outlines
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.4);
    // Neck rim
    doc.line(nx - 0.5, fy, nx + nw + 0.5, fy);
    // Neck sides
    doc.line(nx, fy, nx, fy + nh);
    doc.line(nx + nw, fy, nx + nw, fy + nh);
    // Body sides
    doc.line(nx, fy + nh, fx, fy + h);
    doc.line(nx + nw, fy + nh, fx + w, fy + h);
    // Bottom
    doc.line(fx, fy + h, fx + w, fy + h);
  }

  function drawHeader() {
    doc.setFillColor(10, 31, 59);
    doc.rect(0, 0, PAGE_W, 20, 'F');
    // Flask icon in header
    drawFlask(MARGIN, 5.5);
    // Title text shifted right of flask
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('Le Lab LinkedIn d\'Augustin', MARGIN + 10, 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 200, 220);
    doc.text(date, PAGE_W - MARGIN, 13, { align: 'right' });
    y = 28;
  }

  function drawFooter() {
    const fy = PAGE_H - FOOTER_H + 2;
    doc.setDrawColor(226, 232, 240);
    doc.line(MARGIN, fy, PAGE_W - MARGIN, fy);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`${pt('pdfFooter')} - ${siteUrl}`, PAGE_W / 2, fy + 5, { align: 'center' });
    doc.text(`${pageNum}`, PAGE_W - MARGIN, fy + 5, { align: 'right' });
  }

  function wrapText(text, maxWidth, fontSize) {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(stripEmojis(text || ''), maxWidth);
  }

  function drawProgressBar(x, barY, width, pct, color) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, barY, width, 4, 2, 2, 'F');
    if (pct > 0) {
      const rgb = hexToRgb(color);
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      const fillW = Math.max(4, (pct / 100) * width);
      doc.roundedRect(x, barY, fillW, 4, 2, 2, 'F');
    }
  }

  /* ════════════════════════════
     PAGE 1 — Score + Overview
     ════════════════════════════ */
  drawHeader();

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(pt('pdfTitle'), PAGE_W / 2, y, { align: 'center' });
  y += 8;

  y += 4;

  // Score circle
  const scoreColor = getScoreColor(results.scoreGlobal);
  const scoreRgb = hexToRgb(scoreColor);
  const cx = PAGE_W / 2;
  const cy = y + 25;
  const r = 22;

  // Background circle
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(3);
  doc.circle(cx, cy, r, 'S');

  // Colored arc (approximate with colored circle outline)
  doc.setDrawColor(scoreRgb[0], scoreRgb[1], scoreRgb[2]);
  doc.setLineWidth(3);
  // Draw arc by simulating with a partial line
  const pct = results.scoreGlobal / 100;
  const steps = Math.floor(pct * 60);
  for (let i = 0; i < steps; i++) {
    const angle1 = -Math.PI / 2 + (i / 60) * 2 * Math.PI;
    const angle2 = -Math.PI / 2 + ((i + 1) / 60) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle1);
    const y1 = cy + r * Math.sin(angle1);
    const x2 = cx + r * Math.cos(angle2);
    const y2 = cy + r * Math.sin(angle2);
    doc.line(x1, y1, x2, y2);
  }

  // Score number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(scoreRgb[0], scoreRgb[1], scoreRgb[2]);
  doc.text(`${results.scoreGlobal}`, cx, cy + 2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('/100', cx, cy + 8, { align: 'center' });

  // Objective badge (under score circle)
  y = cy + r + 8;
  const objText = OBJ_LABELS[lang]?.[results.objective] || OBJ_LABELS.fr[results.objective] || '';
  if (objText) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const badgeW = doc.getTextWidth(objText) + 12;
    const badgeX = (PAGE_W - badgeW) / 2;
    doc.setFillColor(235, 245, 255);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.3);
    doc.roundedRect(badgeX, y - 4, badgeW, 8, 4, 4, 'FD');
    doc.setTextColor(30, 58, 95);
    doc.text(objText, PAGE_W / 2, y + 1, { align: 'center' });
    y += 12;
  }

  // Score label
  const scoreLabel = stripEmojis(getScoreLabel(results.scoreGlobal, t));
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(scoreRgb[0], scoreRgb[1], scoreRgb[2]);
  doc.text(scoreLabel, cx, y, { align: 'center' });
  y += 10;

  // ── Score summary table (replaces radar) ──
  checkPage(10 + results.criteres.length * 9);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.text(pt('radarView'), MARGIN, y);
  y += 6;

  for (const c of results.criteres) {
    checkPage(9);
    const color = getScoreColor(c.score);
    const cRgb = hexToRgb(color);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(stripEmojis(c.nom), MARGIN, y + 3);

    // Progress bar
    const barX = MARGIN + 68;
    const barW = CONTENT_W - 68 - 28;
    drawProgressBar(barX, y, barW, c.score, color);

    // Score value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cRgb[0], cRgb[1], cRgb[2]);
    doc.text(`${c.score}`, PAGE_W - MARGIN, y + 3, { align: 'right' });

    y += 9;
  }
  y += 4;

  // ── Global analysis ──
  const analysisLines = wrapText(results.analyseGlobale, CONTENT_W - 10, 9);
  const analysisH = analysisLines.length * 4.5 + 14;
  checkPage(analysisH);

  // Blue left border block
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, y, CONTENT_W, analysisH, 2, 2, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(MARGIN, y, 2, analysisH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text(pt('globalOverview'), MARGIN + 8, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(analysisLines, MARGIN + 8, y + 14);
  y += analysisH + 6;

  /* ════════════════════════════
     PAGE 2+ — Criteria detail
     ════════════════════════════ */
  checkPage(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 58, 95);
  doc.text(pt('criteriaDetail'), MARGIN, y);
  y += 8;

  for (let i = 0; i < results.criteres.length; i++) {
    const c = results.criteres[i];
    const color = getScoreColor(c.score);
    const cRgb = hexToRgb(color);

    // Pre-calculate height
    const explLines = wrapText(c.explication, CONTENT_W - 4, 8.5);
    let blockH = 22 + explLines.length * 4;
    if (c.actions?.length) blockH += c.actions.length * 5 + 4;
    checkPage(blockH + 8);

    // Criterion name + score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(stripEmojis(c.nom), MARGIN, y);

    doc.setFontSize(14);
    doc.setTextColor(cRgb[0], cRgb[1], cRgb[2]);
    doc.text(`${c.score}/100`, PAGE_W - MARGIN, y, { align: 'right' });
    y += 5;

    // Progress bar
    drawProgressBar(MARGIN, y, CONTENT_W, c.score, color);
    y += 6;

    // Weight
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${pt('pdfWeightLabel')} : ${c.poids}%`, MARGIN, y);
    y += 5;

    // Explanation
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(explLines, MARGIN + 2, y);
    y += explLines.length * 4 + 2;

    // Actions
    if (c.actions?.length) {
      for (const a of c.actions) {
        const actionLines = wrapText(a, CONTENT_W - 8, 8);
        checkPage(actionLines.length * 4 + 2);
        doc.setTextColor(59, 130, 246);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('-', MARGIN + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(actionLines, MARGIN + 6, y);
        y += actionLines.length * 4 + 1;
      }
      y += 2;
    }

    // Separator between criteria
    if (i < results.criteres.length - 1) {
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 6;
    }
  }

  /* ════════════════════════════
     Roadmap
     ════════════════════════════ */
  y += 6;
  checkPage(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 58, 95);
  doc.text(pt('priorityActions'), MARGIN, y);
  y += 8;

  for (const item of results.feuilleDeRoute) {
    const titleLines = wrapText(item.titre, CONTENT_W - 18, 10);
    const descLines = wrapText(item.description, CONTENT_W - 18, 8.5);
    const blockH = titleLines.length * 5 + descLines.length * 4 + 6;
    checkPage(blockH);

    // Number circle
    const circleX = MARGIN + 5;
    const circleY = y + 2;
    doc.setFillColor(59, 130, 246);
    doc.circle(circleX, circleY, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${item.priorite}`, circleX, circleY + 1.2, { align: 'center' });

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(titleLines, MARGIN + 14, y + 3);
    y += titleLines.length * 5 + 1;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(descLines, MARGIN + 14, y);
    y += descLines.length * 4 + 6;
  }

  /* ════════════════════════════
     Buy Me a Coffee
     ════════════════════════════ */
  checkPage(22);
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, y, CONTENT_W, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(pt('pdfCoffeeCta'), PAGE_W / 2, y + 7, { align: 'center' });
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(8);
  doc.textWithLink(coffeeUrl, PAGE_W / 2 - doc.getTextWidth(coffeeUrl) / 2, y + 13, { url: coffeeUrl });
  y += 22;

  /* ── Final footer ── */
  drawFooter();
}

/* ══════════════════════════════════
   React Component (floating button)
   ══════════════════════════════════ */
export default function PdfExport({ results }) {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      generatePDF(doc, results, lang, t);
      doc.save('analyse-linkedin-lab-augustin.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  }, [results, lang, t]);

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="pdf-float-btn group"
    >
      {loading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{t('pdfExportLoading')}</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{t('pdfExportButton')}</span>
        </>
      )}
    </button>
  );
}
