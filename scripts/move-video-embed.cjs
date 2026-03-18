#!/usr/bin/env node
/**
 * Moves the YouTube embed:
 * - Model pages: replaces <section class="model-showcase-section"> with the video
 * - Blog posts:  moves video from before FAQ to right after the article header
 */
const fs = require('fs');
const path = require('path');

const ROOT   = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// All 25 pages that have the embed
const MODEL_PAGES = [
  'veo-prompt-generator/index.html',
  'kling-prompt-generator/index.html',
  'runway-prompt-generator/index.html',
  'pika-prompt-generator/index.html',
  'luma-prompt-generator/index.html',
  'sora-prompt-generator/index.html',
  'minimax-prompt-generator/index.html',
  'stable-video-prompt-generator/index.html',
  'image-to-video-prompt/index.html',
  'text-to-video-prompt/index.html',
  'midjourney-prompt-generator/index.html',
  'stable-diffusion-prompt-generator/index.html',
  'flux-prompt-generator/index.html',
  'dall-e-prompt-generator/index.html',
  'adobe-firefly-prompt-generator/index.html',
  'leonardo-ai-prompt-generator/index.html',
  'ideogram-prompt-generator/index.html',
  'text-to-prompt/index.html',
];

const BLOG_PAGES = [
  'blog/video-prompt-guide-2026/index.html',
  'blog/veo-vs-kling-vs-runway/index.html',
  'blog/midjourney-prompt-guide-2026/index.html',
  'blog/prompt-engineering-for-ai-art/index.html',
  'blog/convert-image-to-ai-prompt/index.html',
  'blog/stable-diffusion-vs-midjourney-vs-dalle3/index.html',
  'blog/reverse-engineer-ai-art-prompts/index.html',
];

let updated = 0;

function extractYoutubeBlock(content) {
  // Match the entire <!-- YouTube Demo Video --> ... </div>\n block
  const match = content.match(/\n?\s*<!-- YouTube Demo Video -->[\s\S]*?<\/div>\s*\n?\s*<\/div>\s*\n/);
  return match ? match[0] : null;
}

// ── Process MODEL pages ────────────────────────────────────────────────────
for (const rel of MODEL_PAGES) {
  const filePath = path.join(PUBLIC, rel.replace(/\//g, path.sep));
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Extract the YouTube block from its current position
  const ytBlock = extractYoutubeBlock(content);
  if (!ytBlock) { console.log(`  ⚠ No embed found: ${rel}`); continue; }

  // 2. Remove YouTube block from current location (before FAQ)
  content = content.replace(ytBlock, '\n');

  // 3. Replace <section class="model-showcase-section">...</section> with YouTube block
  //    The section ends at the FIRST </section> after the opening tag
  const showcaseRe = /\n?\s*<!-- Section 1: See It in Action -->\s*\n\s*<section class="model-showcase-section">[\s\S]*?<\/section>/;
  if (showcaseRe.test(content)) {
    // Clean up the youtube block for placement here
    const cleanBlock = ytBlock.trim();
    content = content.replace(showcaseRe, '\n\n    ' + cleanBlock + '\n');
    console.log(`  ✓ model (showcase→video): ${rel}`);
  } else {
    // No showcase section — insert right after </div> of tool-embed-container
    content = content.replace(
      /(<\/div>\s*\n)(\s*<!-- Section)/,
      `$1\n    ${ytBlock.trim()}\n\n$2`
    );
    // Fallback: after tool-embed-container closing div
    if (!content.includes(ytBlock.trim())) {
      content = content.replace(
        '</div>\n\n    <section class="model-features-section">',
        `</div>\n\n    ${ytBlock.trim()}\n\n    <section class="model-features-section">`
      );
    }
    console.log(`  ✓ model (after tool): ${rel}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  updated++;
}

// ── Process BLOG pages ─────────────────────────────────────────────────────
for (const rel of BLOG_PAGES) {
  const filePath = path.join(PUBLIC, rel.replace(/\//g, path.sep));
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Extract the YouTube block
  const ytBlock = extractYoutubeBlock(content);
  if (!ytBlock) { console.log(`  ⚠ No embed found: ${rel}`); continue; }

  // 2. Remove YouTube block from current location
  content = content.replace(ytBlock, '\n');

  // 3. Insert after </header> + before <div class="article-body">
  const insertPoint = '\n    <div class="article-body">';
  if (content.includes(insertPoint)) {
    const cleanBlock = ytBlock.replace(/^\n/, '').replace(/\n$/, '');
    content = content.replace(
      insertPoint,
      `\n\n    ${cleanBlock}\n${insertPoint}`
    );
    console.log(`  ✓ blog (after header): ${rel}`);
  } else {
    // Fallback: after <article class="blog-article"> or similar
    console.log(`  ⚠ blog fallback: ${rel}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  updated++;
}

console.log(`\n✅ ${updated} pages updated`);
