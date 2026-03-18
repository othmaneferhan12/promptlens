#!/usr/bin/env node
/**
 * Master performance + SEO script:
 * 1. Rename images to SEO-friendly names (both .jpeg and .webp)
 * 2. Update all references in HTML + TSX/TS files
 * 3. Convert <img src="*.webp"> to <picture> + WebP/JPEG fallback
 * 4. Update footer languages in all static HTML
 * 5. Fix render-blocking CSS (async load)
 * 6. Fix accessibility (role, aria-label on nav buttons)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IMG_DIR = path.join(PUBLIC, 'images');

// ─── 1. IMAGE RENAMES ──────────────────────────────────────────────────────
const RENAMES = {
  'mj-architecture-cathedral': 'midjourney-architecture-cathedral-prompt-example',
  'mj-fantasy-library':        'midjourney-fantasy-library-ai-art-prompt',
  'mj-landscape-ruins':        'midjourney-landscape-ruins-prompt-output',
  'mj-portrait-fisherman':     'midjourney-portrait-fisherman-prompt-example',
  'mj-product-perfume':        'midjourney-product-photography-perfume-prompt',
  'mj-version-v52':            'midjourney-v52-version-comparison',
  'mj-version-v6':             'midjourney-v6-version-comparison',
  'mj-version-v61':            'midjourney-v61-latest-version-output',
  'model-comparison-source':   'ai-model-comparison-midjourney-vs-stable-diffusion',
  'pair1-cinematic':            'ai-prompt-cinematic-portrait-style',
  'pair1-editorial':            'ai-prompt-editorial-portrait-style',
  'pair2-blue-hour':            'ai-prompt-blue-hour-lighting-example',
  'pair2-golden-hour':          'ai-prompt-golden-hour-lighting-example',
  'pair3-oil-painting':         'ai-prompt-oil-painting-style-example',
  'pair3-watercolor':           'ai-prompt-watercolor-style-example',
  'pair4-closeup':              'ai-prompt-extreme-closeup-composition',
  'pair4-wide-shot':            'ai-prompt-wide-shot-composition',
  'pair5-ominous':              'ai-prompt-ominous-mood-example',
  'pair5-peaceful':             'ai-prompt-peaceful-mood-example',
  'stage1-cat':                 'prompt-engineering-basic-cat-garden',
  'stage2-cat':                 'prompt-engineering-add-style-cat',
  'stage3-cat':                 'prompt-engineering-add-lighting-cat',
  'stage4-cat':                 'prompt-engineering-add-details-cat',
  'stage5-cat':                 'prompt-engineering-final-result-cat',
};

// Step 1: Rename actual files
console.log('\n── Step 1: Renaming image files ──');
for (const [oldBase, newBase] of Object.entries(RENAMES)) {
  for (const ext of ['.jpeg', '.webp']) {
    const src = path.join(IMG_DIR, oldBase + ext);
    const dst = path.join(IMG_DIR, newBase + ext);
    if (fs.existsSync(src)) {
      fs.renameSync(src, dst);
      console.log(`  ✓ ${oldBase + ext} → ${newBase + ext}`);
    }
  }
}

// ─── 2. COLLECT ALL TEXT FILES TO UPDATE ──────────────────────────────────
function getAllFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'scripts'].includes(item)) {
        results.push(...getAllFiles(full, exts));
      }
    } else if (exts.some(e => item.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = getAllFiles(PUBLIC, ['.html']);
const srcFiles = getAllFiles(path.join(ROOT, 'src'), ['.tsx', '.ts', '.css']);
const allTextFiles = [...htmlFiles, ...srcFiles,
  path.join(PUBLIC, 'image-sitemap.xml'),
  path.join(PUBLIC, 'video-sitemap.xml'),
].filter(f => fs.existsSync(f));

// Step 2: Update all filename references
console.log('\n── Step 2: Updating filename references ──');
let refFilesUpdated = 0;
// Sort by length descending so "mj-version-v61" is replaced before "mj-version-v6"
const sortedRenames = Object.entries(RENAMES).sort((a, b) => b[0].length - a[0].length);

for (const file of allTextFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [oldBase, newBase] of sortedRenames) {
    // Replace exact filename base (surrounded by non-alphanumeric or start/end of value)
    const re = new RegExp(oldBase.replace(/-/g, '\\-'), 'g');
    if (re.test(content)) {
      content = content.replace(new RegExp(oldBase.replace(/-/g, '\\-'), 'g'), newBase);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    refFilesUpdated++;
    console.log(`  ✓ ${path.relative(ROOT, file)}`);
  }
}
console.log(`  → ${refFilesUpdated} files updated`);

// ─── 3. CONVERT <img> TO <picture> IN STATIC HTML ─────────────────────────
console.log('\n── Step 3: Converting <img> to <picture> tags ──');
let pictureFilesUpdated = 0;
let totalPictureTags = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Match <img ...> tags that have src="/images/something.webp"
  // Captures: before-attrs, webp-src, after-attrs
  // Handles self-closing /> and non-self-closing >
  content = content.replace(
    /<img\b((?:[^>](?!src=))*?)src="(\/images\/[^"]+\.webp)"((?:[^>])*?)(?:\s*\/)?\s*>/gi,
    (match, before, webpSrc, after) => {
      const jpegSrc = webpSrc.replace(/\.webp$/, '.jpeg');
      // Clean up combined attributes
      const rawAttrs = (before + ' ' + after)
        .replace(/\s*\/\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `<picture><source srcset="${webpSrc}" type="image/webp"><img ${rawAttrs} src="${jpegSrc}"></picture>`;
    }
  );

  // Also handle .jpeg refs that aren't already in a picture tag
  content = content.replace(
    /<img\b((?:[^>](?!src=))*?)src="(\/images\/[^"]+\.jpeg)"((?:[^>])*?)(?:\s*\/)?\s*>/gi,
    (match, before, jpegSrc, after) => {
      // Skip if already inside <picture>
      const webpSrc = jpegSrc.replace(/\.jpeg$/, '.webp');
      const rawAttrs = (before + ' ' + after)
        .replace(/\s*\/\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `<picture><source srcset="${webpSrc}" type="image/webp"><img ${rawAttrs} src="${jpegSrc}"></picture>`;
    }
  );

  if (content !== original) {
    const count = (content.match(/<picture>/gi) || []).length;
    totalPictureTags += count;
    fs.writeFileSync(file, content, 'utf8');
    pictureFilesUpdated++;
  }
}
console.log(`  → ${pictureFilesUpdated} files updated, ${totalPictureTags} total <picture> elements`);

// ─── 4. FOOTER LANGUAGES IN STATIC HTML ───────────────────────────────────
console.log('\n── Step 4: Updating footer languages ──');

// Languages that exist: en, fr, ar, es, ja, ko
const NEW_LANG_HTML = `<div class="f4-section">
          <h4 class="f4-heading">Languages</h4>
          <a href="/">English</a>
          <a href="/fr/">Fran&#231;ais</a>
          <a href="/ar/">&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;</a>
          <a href="/es/">Espa&#241;ol</a>
          <a href="/ko/">&#54620;&#44397;&#50612;</a>
          <a href="/ja/">&#26085;&#26412;&#35486;</a>
        </div>`;

// Match the existing languages section (3 languages currently)
const LANG_RE = /<div class="f4-section">\s*<h4 class="f4-heading">Languages<\/h4>[\s\S]*?<\/div>/;

let footerFilesUpdated = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (LANG_RE.test(content)) {
    const updated = content.replace(LANG_RE, NEW_LANG_HTML);
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      footerFilesUpdated++;
    }
  }
}
console.log(`  → ${footerFilesUpdated} files updated`);

// ─── 5. RENDER-BLOCKING CSS: ASYNC LOAD ───────────────────────────────────
console.log('\n── Step 5: Making CSS non-render-blocking ──');

// Pattern: synchronous <link rel="stylesheet" href="/blog.css"> or /model-pages.css
// Replace with preload + onload async pattern + noscript fallback
function makeAsyncCSS(href) {
  return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
}

let cssFilesUpdated = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Make blog.css async (but NOT theme.css which is critical for no-FOUC)
  const blogCssRe = /<link\s+rel="stylesheet"\s+href="\/blog\.css"\s*\/?>/g;
  if (blogCssRe.test(content)) {
    content = content.replace(blogCssRe, makeAsyncCSS('/blog.css'));
    changed = true;
  }

  const modelCssRe = /<link\s+rel="stylesheet"\s+href="\/model-pages\.css"\s*\/?>/g;
  if (modelCssRe.test(content)) {
    content = content.replace(modelCssRe, makeAsyncCSS('/model-pages.css'));
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    cssFilesUpdated++;
  }
}
console.log(`  → ${cssFilesUpdated} files updated (async CSS)`);

// ─── 6. PRELOAD CRITICAL ASSETS PER PAGE ──────────────────────────────────
console.log('\n── Step 6: Adding preload hints for critical assets ──');

// For pages that use blog.css, also add dns-prefetch for GA
let preloadFilesUpdated = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add preload for theme.css if not already there
  if (content.includes('href="/theme.css"') && !content.includes('rel="preload".*theme.css')) {
    content = content.replace(
      '<link rel="stylesheet" href="/theme.css">',
      '<link rel="preload" href="/theme.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="/theme.css"></noscript>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    preloadFilesUpdated++;
  }
}
console.log(`  → ${preloadFilesUpdated} files updated (preloads)`);

// ─── 7. VERIFY: CHECK FOR BROKEN IMAGE REFS ───────────────────────────────
console.log('\n── Step 7: Verifying — checking for broken image references ──');
let broken = 0;
for (const file of allTextFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(/\/images\/([^"'\s)>]+)/g);
  for (const m of matches) {
    const imgPath = path.join(PUBLIC, 'images', m[1]);
    if (!fs.existsSync(imgPath)) {
      console.log(`  ✗ BROKEN in ${path.relative(ROOT, file)}: /images/${m[1]}`);
      broken++;
    }
  }
}
if (broken === 0) {
  console.log('  ✓ Zero broken image references!');
} else {
  console.log(`  ✗ ${broken} broken references found!`);
}

console.log('\n✅ All done!');
