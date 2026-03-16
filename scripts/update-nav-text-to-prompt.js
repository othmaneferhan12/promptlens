/**
 * update-nav-text-to-prompt.js
 *
 * Adds "Text to Prompt" as the first item in every nav-dropdown-menu
 * across all static HTML files in public/.
 *
 * Usage:
 *   node scripts/update-nav-text-to-prompt.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');

// Files that already have the link (skip them)
const SKIP_FILES = new Set([
  join(PUBLIC_DIR, 'text-to-prompt', 'index.html'),
  join(PUBLIC_DIR, 'blog', 'text-to-prompt-generator', 'index.html'),
]);

let updatedCount = 0;
let skippedCount = 0;
let alreadyHasCount = 0;

function getAllHtmlFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  if (SKIP_FILES.has(filePath)) {
    skippedCount++;
    return;
  }

  let content = readFileSync(filePath, 'utf8');

  // Check if nav-dropdown-menu exists in this file
  if (!content.includes('nav-dropdown-menu')) {
    skippedCount++;
    return;
  }

  // Check if already updated
  if (content.includes('/text-to-prompt/')) {
    alreadyHasCount++;
    return;
  }

  // Find the nav-dropdown-menu div and insert new link as first item
  const marker = '<div class="nav-dropdown-menu" role="menu">';
  const markerIdx = content.indexOf(marker);

  if (markerIdx === -1) {
    skippedCount++;
    return;
  }

  const insertIdx = markerIdx + marker.length;

  // Detect indentation of the next link to match it
  const afterMarker = content.slice(insertIdx);
  const nextLinkMatch = afterMarker.match(/^(\s*)<a /);
  const indent = nextLinkMatch ? nextLinkMatch[1] : '\n            ';

  const newLink = `\n${indent}<a href="/text-to-prompt/" role="menuitem">&#9999;&#65039; Text to Prompt</a>`;

  content = content.slice(0, insertIdx) + newLink + content.slice(insertIdx);

  writeFileSync(filePath, content, 'utf8');
  updatedCount++;
  console.log('  Updated:', relative(PUBLIC_DIR, filePath));
}

console.log('Scanning public/ for HTML files...\n');
const files = getAllHtmlFiles(PUBLIC_DIR);
console.log(`Found ${files.length} HTML files.\n`);

for (const file of files) {
  processFile(file);
}

console.log(`\nDone.`);
console.log(`  Updated:      ${updatedCount} files`);
console.log(`  Already had:  ${alreadyHasCount} files`);
console.log(`  Skipped:      ${skippedCount} files`);
