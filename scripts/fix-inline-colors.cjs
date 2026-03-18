/**
 * fix-inline-colors.cjs
 * Replaces hardcoded dark-theme colors in style="..." attributes of all public HTML files.
 * Does NOT touch <script>, <style>, or JSON-LD blocks.
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// ── Replacement map ──────────────────────────────────────────────────────────
const REPLACEMENTS = [
  // Text colors
  ['color:#f5f5ff',   'color:var(--text-primary)'],
  ['color: #f5f5ff',  'color: var(--text-primary)'],
  ['color:#e0e0f5',   'color:var(--text-primary)'],
  ['color:#8888bb',   'color:var(--text-muted)'],
  ['color: #8888bb',  'color: var(--text-muted)'],
  ['color:#9999bb',   'color:var(--text-muted)'],
  ['color:#9090bb',   'color:var(--text-muted)'],
  ['color:#a0a0cc',   'color:var(--text-secondary)'],
  ['color:#b0b0cc',   'color:var(--text-secondary)'],
  ['color:#c0c0dd',   'color:var(--text-secondary)'],
  ['color:#6060aa',   'color:var(--text-dim, #6060aa)'],
  ['color:#3a3a66',   'color:var(--text-muted)'],
  // Backgrounds
  ['background:#080810',                'background:var(--bg-base)'],
  ['background:#0d0d1a',                'background:var(--bg-surface)'],
  ['background:#0e0e1a',                'background:var(--bg-surface)'],
  ['background:rgba(255,255,255,0.03)', 'background:var(--bg-card)'],
  ['background:rgba(255,255,255,0.04)', 'background:var(--bg-card)'],
  ['background:rgba(255,255,255,0.05)', 'background:var(--bg-card)'],
  ['background:rgba(224,64,251,0.05)',  'background:var(--accent-dim)'],
  ['background:rgba(224,64,251,0.06)',  'background:var(--accent-dim)'],
  // Borders
  ['border:1px solid rgba(255,255,255,0.08)', 'border:1px solid var(--border-card)'],
  ['border:1px solid rgba(255,255,255,0.1)',  'border:1px solid var(--border-mid)'],
  ['border:1px solid rgba(224,64,251,0.2)',   'border:1px solid var(--accent-border)'],
];

// ── Find all public HTML files ───────────────────────────────────────────────
const publicDir = path.resolve(__dirname, '../public');
const files = globSync('**/*.html', { cwd: publicDir, absolute: true });

let totalReplacements = 0;
let filesChanged = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;

  // Replace only within style="..." attribute values
  const updated = content.replace(/style="([^"]*)"/g, (match, styleValue) => {
    let newValue = styleValue;
    for (const [from, to] of REPLACEMENTS) {
      const before = newValue;
      // Simple global string replacement within the style value
      while (newValue.includes(from)) {
        newValue = newValue.replace(from, to);
        fileReplacements++;
      }
      void before; // suppress unused warning
    }
    return newValue === styleValue ? match : `style="${newValue}"`;
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    filesChanged++;
    totalReplacements += fileReplacements;
    console.log(`  [${fileReplacements} fixes] ${path.relative(publicDir, filePath)}`);
  }
}

console.log(`\nDone. ${totalReplacements} replacements across ${filesChanged} files (${files.length} total scanned).`);
